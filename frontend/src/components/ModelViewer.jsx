import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    useGLTF,
    Html,
    useProgress,
    } from "@react-three/drei";
    import { Suspense, useEffect } from "react";

    // ✅ Preload models for smoother experience
    export function preloadModel(url) {
    if (url) {
        try {
        useGLTF.preload(url);
        } catch (e) {
        console.warn("Preload failed for:", url, e);
        }
    }
    }

    function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
        <div style={{ color: "#311b92", fontWeight: "bold" }}>
            Loading... {progress.toFixed(0)}%
        </div>
        </Html>
    );
    }

    function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1} />;
    }

    export default function ModelViewer({ modelUrl }) {
    useEffect(() => {
        if (modelUrl) preloadModel(modelUrl);
    }, [modelUrl]);

    if (!modelUrl) {
        return <div style={{ color: "red" }}>⚠ No model URL provided!</div>;
    }

    return (
        <Canvas
        style={{
            height: "100%",
            width: "100%",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #e1f5fe, #f3e5f5)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
        camera={{ position: [2, 2, 4], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
        >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls makeDefault enableZoom={true} />
        <Environment preset="city" />
        <Suspense fallback={<Loader />}>
            <Model url={modelUrl} />
        </Suspense>
        </Canvas>
    );
}
