"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'lrm-graphhopper';

import MarkerClusterGroup from 'react-leaflet-cluster';
import toast from 'react-hot-toast';
import { Navigation, LocateFixed } from 'lucide-react';

if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

function GraphHopperRouting({ dangerZones = [], waypoints = [] }) {
    const map = useMap();

    useEffect(() => {
        if (!map || typeof window === 'undefined') return;
        if (!waypoints || waypoints.length < 2) return;
        try {
            const routingWaypoints = waypoints.map(wp => L.latLng(wp.lat, wp.lng));

            const routingControl = L.Routing.control({
                waypoints: routingWaypoints,
                router: L.Routing.graphHopper(process.env.NEXT_PUBLIC_GRAPHHOPPER_KEY, {
                    urlParameters: {
                        "ch.disable": true,
                    },
                    custom_model: dangerZones.length > 0 ? {
                        priority: dangerZones.map((zone, idx) => ({
                            if: `in_zone_${idx}`,
                            multiply_by: 0
                        })),
                        areas: dangerZones.reduce((acc, zone, idx) => {
                            const [lng, lat] = zone.geometry.coordinates;
                            acc[`zone_${idx}`] = {
                                type: "Point",
                                coordinates: [lng, lat],
                                radius: 50000
                            };
                            return acc;
                        }, {})
                    } : null
                }),
                routeWhileDragging: true,
                addWaypoints: true,
                show: true,
                lineOptions: {
                    styles: [{ color: '#27AE60', opacity: 0.9, weight: 6, dashArray: '10, 10' }],
                    zIndex: 400
                },
                createMarker: function (i, wp, nWps) {
                    return L.marker(wp.latLng, {
                        draggable: true,
                        zIndexOffset: 600
                    });
                }
            }).addTo(map);

            return () => {
                if (map && routingControl) {
                    map.removeControl(routingControl);
                }
            };
        } catch (e) {
            console.error("Failed to initialize GraphHopper routing:", e);
        }
    }, [map, dangerZones, waypoints]);

    return null;
}

function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            if (e?.latlng) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
}

function MapAutoCenter({ waypoints = [] }) {
    const map = useMap();
    const [lastLoc, setLastLoc] = React.useState(null);

    useEffect(() => {
        if (waypoints.length === 0) return;

        const currentStart = waypoints[0];
        const dest = waypoints.length > 1 ? waypoints[waypoints.length - 1] : null;

        const flyOptions = { duration: 1.2, easeLinearity: 0.25 };

        if (!dest && (currentStart.lat !== lastLoc?.lat || currentStart.lng !== lastLoc?.lng)) {
            map.flyTo([currentStart.lat, currentStart.lng], map.getZoom(), flyOptions);
            setLastLoc(currentStart);
            return;
        }

        if (dest && (dest.lat !== lastLoc?.lat || dest.lng !== lastLoc?.lng)) {
            map.flyTo([dest.lat, dest.lng], 15, flyOptions);
            setLastLoc(dest);
        }
    }, [map, waypoints, lastLoc]);

    return null;
}

function RecenterControl({ startPoint }) {
    const map = useMap();

    const handleRecenter = () => {
        if (!startPoint) {
            toast.error("Home position not established.");
            return;
        }
        map.flyTo([startPoint.lat, startPoint.lng], 13, { duration: 1.2 });
        toast.success("Home Position Restored", { duration: 1500 });
    };

    return (
        <div className="leaflet-top leaflet-right" style={{ marginTop: '100px', marginRight: '16px' }}>
            <div className="leaflet-control">
                <button
                    onClick={handleRecenter}
                    title="Recenter on Me"
                    className="w-10 h-10 md:w-12 md:h-12 bg-[#04120a] border-2 border-[#27AE60]/40 rounded-xl flex items-center justify-center text-[#27AE60] hover:bg-[#27AE60] hover:text-[#04120a] transition-all shadow-2xl active:scale-90 group pointer-events-auto"
                >
                    <LocateFixed size={18} className="md:size-20 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
}

export default function TacticalMap({ reports = [], waypoints = [], onReportSubmit }) {
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reportData, setReportData] = useState({ status: 'DANGER', description: '' });
    const [isLocating, setIsLocating] = useState(false);

    const dangerZones = (reports || []).filter(r => {
        const risk = r?.properties ? (r.properties.riskLevel ?? r.properties.status) : (r?.riskLevel ?? r?.status);
        return risk === 'DANGER';
    });


    const handleInitiateReport = () => {

        if (waypoints[0] && waypoints[0].lat !== 9.0820) {
            console.log("⚡ Hot-Swap: Using live telemetry lock for update:", waypoints[0]);
            setSelectedCoords({ lat: waypoints[0].lat, lng: waypoints[0].lng });
            setShowModal(true);
            return;
        }


        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your current device.");
            return;
        }

        setIsLocating(true);
        const tryLocate = (highAccuracy) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`📍 Fresh GPS Fix (${highAccuracy ? 'High' : 'Standard'} Accuracy):`, latitude, longitude);
                    setSelectedCoords({ lat: latitude, lng: longitude });
                    setIsLocating(false);
                    setShowModal(true);
                },
                (error) => {
                    console.error("Manual GPS Fix failed:", { code: error.code, message: error.message });
                    if (highAccuracy && (error.code === 3 || error.code === 2)) {
                        console.warn("Retrying refreshed location with standard accuracy...");
                        tryLocate(false);
                        return;
                    }
                    setIsLocating(false);
                    toast.error("Unable to verify field position. Please try again.");
                },
                { enableHighAccuracy: highAccuracy, timeout: highAccuracy ? 8000 : 15000, maximumAge: 0 }
            );
        };

        tryLocate(true);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedCoords) {
            toast.error("Signal Lost. Please try again.");
            return;
        }

        const newReport = {
            latitude: selectedCoords.lat,
            longitude: selectedCoords.lng,
            status: reportData.status,
            description: reportData.description,
            id: Date.now()
        };

        onReportSubmit(newReport);
        setShowModal(false);
        setSelectedCoords(null);
        setReportData({ status: 'DANGER', description: '' });
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="relative h-[650px] w-full rounded-3xl overflow-hidden border-2 border-[#27AE60]/20 shadow-2xl bg-[#04120a]">
                <MapContainer
                    center={[9.0820, 8.6753]}
                    zoom={6}
                    className="h-full w-full z-0"
                    preferCanvas={true}
                    zoomSnap={0.5}
                    zoomDelta={0.5}
                    style={{ willChange: 'transform', background: '#04120a' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        keepBuffer={8}
                        updateWhenIdle={true}
                    />

                    <GraphHopperRouting dangerZones={dangerZones} waypoints={waypoints} />
                    <MapAutoCenter waypoints={waypoints} />
                    <RecenterControl startPoint={waypoints[0]} />
                    <MapClickHandler onMapClick={(latlng) => console.log("Map Click intercepted:", latlng)} />

                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={150}
                        spiderfyOnMaxZoom={true}
                        polygonOptions={{
                            fillColor: '#ef4444',
                            color: '#ef4444',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.1,
                        }}
                    >
                        {(reports || []).map((report) => {
                            const lat = report?.geometry ? report.geometry.coordinates[1] : report?.latitude;
                            const lng = report?.geometry ? report.geometry.coordinates[0] : report?.longitude;
                            const level = report?.properties ? (report.properties.riskLevel ?? report.properties.status) : (report?.riskLevel ?? report?.status);
                            const desc = report?.properties ? report.properties.description : report?.description;
                            const rId = report?.properties ? report.properties.id : report?.id;

                            if (lat == null || lng == null) return null;
                            const isDanger = level === 'DANGER';

                            return (
                                <Circle
                                    key={rId || Math.random()}
                                    center={[lat, lng]}
                                    pathOptions={{
                                        fillColor: isDanger ? '#ef4444' : '#22c55e',
                                        color: isDanger ? '#ffffff' : '#ffffff',
                                        weight: 2,
                                        fillOpacity: 0.6,
                                        dashArray: isDanger ? '5, 5' : null,
                                        zIndex: 500
                                    }}
                                    radius={500}
                                >
                                    <Popup>
                                        <div className="font-sans p-1 text-slate-900">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${isDanger ? 'bg-red-500' : 'bg-green-500'}`} />
                                                <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">Live Field Update</p>
                                            </div>
                                            <p className="text-sm font-bold">{desc || "Field Report Logged"}</p>
                                            <p className="text-[9px] text-slate-400 mt-2 italic">Reported near {lat.toFixed(2)}, {lng.toFixed(2)}</p>
                                        </div>
                                    </Popup>
                                </Circle>
                            );
                        })}
                    </MarkerClusterGroup>
                </MapContainer>

                { }
                {showModal && (
                    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                        <div className="bg-[#04120a] border border-[#27AE60]/40 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(39,174,96,0.3)]">
                            <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">Share Field Update</h3>
                            <p className="text-[10px] text-emerald-500/60 mb-8 font-bold uppercase tracking-[0.2em]">Updating the conditions for others</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Field Condition</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setReportData({ ...reportData, status: 'DANGER' })}
                                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${reportData.status === 'DANGER' ? 'bg-red-600 text-white shadow-lg' : 'bg-white/5 text-white/30 border border-white/5'}`}
                                        >
                                            Danger / Risk
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReportData({ ...reportData, status: 'SAFE' })}
                                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${reportData.status === 'SAFE' ? 'bg-[#27AE60] text-white shadow-lg' : 'bg-white/5 text-white/30 border border-white/5'}`}
                                        >
                                            Safe Passage
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Situation Description</label>
                                    <textarea
                                        required
                                        value={reportData.description}
                                        placeholder="e.g. Broken irrigation, clear path, or soil issue..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-[#27AE60] transition-all h-32 resize-none"
                                        onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#27AE60] hover:text-white transition-all shadow-xl"
                                    >
                                        Share Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-2 text-white/30 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Cancel Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center pb-12">
                <button
                    onClick={handleInitiateReport}
                    disabled={isLocating}
                    className={`bg-[#27AE60] text-[#04120a] px-12 py-5 rounded-full flex items-center gap-4 shadow-[0_20px_50px_rgba(39,174,96,0.5)] border border-white/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${isLocating ? 'animate-pulse bg-amber-500' : 'hover:bg-white hover:border-[#27AE60]'}`}
                >
                    <Navigation size={20} className={isLocating ? 'animate-spin' : 'animate-pulse'} />
                    <span className="text-[13px] font-black uppercase tracking-[0.3em] leading-none">
                        {isLocating ? 'Acquiring GPS Fix...' : 'Click Map to Share Condition'}
                    </span>
                </button>
            </div>
        </div>
    );
}