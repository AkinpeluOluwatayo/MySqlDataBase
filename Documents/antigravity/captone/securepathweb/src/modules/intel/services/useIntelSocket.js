import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useIntelSocket = (onReportReceived) => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP:', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to Intel WebSocket');
                setConnected(true);
                client.subscribe('/topic/intel', (message) => {
                    if (message.body) {
                        const payload = JSON.parse(message.body);
                        onReportReceived(payload);
                    }
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from Intel WebSocket');
                setConnected(false);
            },
        });

        client.activate();

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [onReportReceived]);

    return { connected };
};
