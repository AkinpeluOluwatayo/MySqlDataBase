"use client";

import React, { Suspense, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Float, Html, Center, ContactShadows, Environment } from '@react-three/drei';

import Navbar from '../shared/components/navbar';
import Footer from '../shared/components/footer';

useGLTF.preload('/images/farm_pickup_truck.glb');

function TruckModel() {
  const { scene } = useGLTF('/images/farm_pickup_truck.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
      <primitive
          object={clonedScene}
          scale={1.5}
          position={[0, -0.5, 0]}
          castShadow
          receiveShadow
      />
  );
}

function Loader() {
  return (
      <Html center>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#27AE60] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Syncing 3D Intel</p>
        </div>
      </Html>
  );
}

export default function SecurePathLanding() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
      <div className="relative min-h-screen w-full bg-[#04120a] font-sans selection:bg-green-500/40">
        <Navbar />

        <main className="relative min-h-screen w-full overflow-hidden">
          {}
          <div className="absolute inset-0 z-0 bg-[#04120a]">
            {}
            <Image
                src="/images/landing-bg.avif"
                alt="SecurePath Logistics"
                fill
                priority
                className="object-cover opacity-20 grayscale-[0.5] contrast-[1.2]"
                quality={85}
                sizes="100vw"
                onError={(e) => { e.target.style.display = 'none' }} 
            />
            {}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(39,174,96,0.1)_0%,rgba(4,18,10,0.9)_70%,rgba(4,18,10,1)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04120a] via-[#04120a]/80 to-transparent" />
          </div>

          <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2 items-center px-6 md:px-16 lg:px-24 pt-24 lg:pt-0">

            {}
            <motion.div
                initial="hidden"
                animate="visible"
                className="w-full max-w-7xl order-1 lg:order-none"
            >
              <div className="flex flex-col gap-6 lg:gap-8">
                <section className="max-w-2xl">
                  <motion.h1
                      variants={fadeInUp}
                      transition={{ duration: 0.6 }}
                      className="text-4xl font-black leading-[1.1] tracking-tighter text-white md:text-5xl lg:text-7xl"
                  >
                    Safe Routes for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#4ade80] via-[#27AE60] to-[#14532d]">
                    Agric Drivers
                  </span>
                  </motion.h1>

                  <motion.p
                      variants={fadeInUp}
                      transition={{ delay: 0.2 }}
                      className="mt-4 lg:mt-6 max-w-md text-sm font-medium leading-relaxed text-emerald-50/60 md:text-base border-l-2 border-[#27AE60] pl-6"
                  >
                    Empowering agricultural drivers with real-time intelligence to navigate routes safely and eliminate transit extortion.
                  </motion.p>
                </section>

                {}
                <motion.div variants={fadeInUp} transition={{ delay: 0.4 }} className="flex gap-10">
                  <div>
                    <p className="text-2xl font-black text-white">24/7</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/50">Active Intel</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/50">Verified</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {}
            <div className="h-[450px] md:h-[550px] lg:h-[650px] w-full relative order-2 lg:order-none">
              <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 12], fov: 35 }}>
                {}
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <directionalLight position={[-5, 5, 5]} intensity={1} />
                <pointLight position={[0, -2, 5]} intensity={0.5} color="#27AE60" />

                <Suspense fallback={<Loader />}>
                  <Center>
                    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                      <TruckModel />
                    </Float>
                  </Center>

                  <ContactShadows
                      position={[0, -1.4, 0]}
                      opacity={0.5}
                      scale={10}
                      blur={2}
                      far={4}
                  />

                  <OrbitControls
                      enableZoom={false}
                      autoRotate
                      autoRotateSpeed={0.8}
                      minPolarAngle={Math.PI / 2.2}
                      maxPolarAngle={Math.PI / 2}
                  />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
}