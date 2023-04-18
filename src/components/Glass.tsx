import {
    Box,
    Caustics,
    Cylinder,
    MeshRefractionMaterial,
    MeshTransmissionMaterial,
    Sphere,
} from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import React from 'react';

const Glass = (props: ThreeElements['mesh']) => {
    return (
        // <Caustics
        //     backside
        //     color={[1, 0.8, 0.8]}
        //     lightSource={[-2, 2.5, -2.5]}
        //     intensity={0.005}
        //     worldRadius={0.66 / 10}
        //     ior={0.6}
        //     backsideIOR={1.26}
        //     causticsOnly={false}>
        <Cylinder args={[8, 8, 1, 32]} {...props}>
            <MeshTransmissionMaterial
                color={'pink'}
                thickness={0.2}
                chromaticAberration={0.05}
                anisotropy={1.5}
                clearcoat={1}
                clearcoatRoughness={0.2}
                envMapIntensity={3}
                distortionScale={0}
                temporalDistortion={0}
            />
        </Cylinder>
        // </Caustics>
    );
};

export default Glass;
