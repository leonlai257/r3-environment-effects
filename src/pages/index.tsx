import Glass from '@/components/Glass';
import HeightMap from '@/components/HeightMap';
import {
    Cloud,
    OrbitControls,
    PerspectiveCamera,
    Plane,
    Sky,
    Sphere,
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { createRef, useState } from 'react';
import * as THREE from 'three';
export interface MainProps {}

const Main = (props: MainProps) => {
    const { camera } = useThree();
    const cameraRef = createRef();

    const [fov] = useState(75);

    return (
        <>
            <Sky />
            <Cloud
                position={[0, 100, 0]}
                color={'#ffffff'}
                opacity={1}
                speed={0.4}
                width={50}
                depth={0.3}
                segments={300}
            />
            {/* <Glass
                position={[0, 10, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[1, 1, 1]}
            /> */}
            <HeightMap size={10} />

            <PerspectiveCamera
                makeDefault
                ref={cameraRef}
                fov={fov}
                near={0.1}
                far={1000}
                position={[0, 0, 10]}
            />

            <OrbitControls enableZoom={true} enableRotate={true} />
        </>
    );
};

export default Main;
