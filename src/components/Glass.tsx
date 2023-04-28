import {
    Box,
    Caustics,
    Cylinder,
    Environment,
    MeshReflectorMaterial,
    MeshRefractionMaterial,
    MeshTransmissionMaterial,
    Sphere,
} from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'
import { WorldEnvironment } from '@src/components'

export const Glass = (props: ThreeElements['mesh']) => {
    const glassTexture = new THREE.TextureLoader().load('/envMap/pinkSceneEnvMap.jpeg')

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
            <Environment preset={'city'} />
            {/* <WorldEnvironment /> */}

            <MeshTransmissionMaterial
                color={'pink'}
                thickness={10.0}
                chromaticAberration={0.3}
                anisotropy={0.8}
                clearcoat={1}
                clearcoatRoughness={0.2}
                distortionScale={0.1}
                temporalDistortion={0}
            />
        </Cylinder>
        // </Caustics>
    )
}
