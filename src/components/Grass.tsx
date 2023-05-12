import React, { JSXElementConstructor, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { Depth, LayerMaterial } from 'lamina'
import { Sampler } from '@react-three/drei'
import WindLayer from '../shaders/windLayer'
import { Flower } from './Flower'
import Perlin from 'perlin.js'
import { DepthProps } from 'lamina/types'
import { useControls } from 'leva'
import { ControlConfigType } from '@/types'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            windLayer: DepthProps
        }
    }
}

Perlin.seed(Math.random())
extend({ WindLayer })

type GrassProps = {
    children: ReactElement<any, string | JSXElementConstructor<any>>
    config: ControlConfigType
    props?: any
}

// Grass, it uses a sampler to generate multiple instances of the grass mesh based the grass density attribute calculated during the height map generation
export function Grass({ children, config, ...props }: GrassProps) {
    // For the strands value in the config
    const controls = useControls(config)

    const grassInstanceRef = useRef<THREE.InstancedMesh>(null!)
    const flowerRef = useRef<THREE.InstancedMesh>(null!)
    const windLayer = useRef<DepthProps>(null!)
    const geomRef = useRef<THREE.Mesh>(null!)
    const grassSamplerRef = useRef<any>(null!)

    useEffect(() => {
        // Apply rotation and translation to the grass mesh
        grassInstanceRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        grassInstanceRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
    }, [])

    // useFrame(() => (windLayer.current.time += 0.005))
    return (
        <>
            {/* Cloning the children(height map) and passed a forwarded ref so that multiple samplers could reference this geometry for instanced mesh generation */}
            {React.cloneElement(children, { ref: geomRef })}

            {/* Flower Mesh */}
            {/* <Flower ref={flowerRef} />s */}

            {/* Grass Instanced Mesh, which blends 2 shaders into one single material (1 for gradient, 1 for swaying/moving effect) */}
            <instancedMesh ref={grassInstanceRef} args={[undefined, undefined, controls.strands]} castShadow>
                <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} />
                <LayerMaterial side={THREE.DoubleSide} lighting="physical" envMapIntensity={1}>
                    <Depth colorA="#86608E" colorB="#ffddf4" near={0.14} far={1.24} mapping={'world'} />
                    {/* Disable Wind Layer for performance*/}
                    {/* <windLayer
                        args={[{ mode: 'multiply' }]}
                        colorA={'#ffddf4'}
                        colorB={'#fddde6'}
                        noiseScale={10}
                        noiseStrength={1}
                        length={1.4}
                        sway={0.1}
                        ref={windLayer}
                    /> */}
                </LayerMaterial>
            </instancedMesh>
            <group>
                <Sampler
                    ref={grassSamplerRef}
                    count={controls.strands}
                    matrixAutoUpdate
                    matrixWorldNeedsUpdate
                    transform={({ sampledMesh, position, normal, dummy: object }) => {
                        // Setting random scaling
                        const p = position.clone().multiplyScalar(200)
                        const n = Perlin.simplex3(...p.toArray())
                        object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, 0.3, 1) * 5)

                        // Setting instances position
                        object.position.copy(sampledMesh.localToWorld(position))

                        // Setting random rotation
                        object.lookAt(normal.add(new THREE.Vector3(position.x, position.y + 10, position.z)))
                        object.rotation.y += Math.random() - 0.1 * (Math.PI * 0.5)
                        object.rotation.z += Math.random() - 0.1 * (Math.PI * 0.5)
                        object.rotation.x += Math.random() - 0.1 * (Math.PI * 0.5)

                        object.updateMatrix()
                        return object
                    }}
                    mesh={geomRef}
                    instances={grassInstanceRef}
                    weight="grassDensity"
                />

                {/* Flower Sampler*/}
                {/* <Sampler
                    transform={({ sampledMesh, position, normal, dummy: object }) => {
                        // Set random scaling
                        object.scale.setScalar(Math.random() * 0.0075)

                        // Set instances position
                        object.position.copy(sampledMesh.localToWorld(position))

                        // Set random rotation
                        object.lookAt(normal.add(new THREE.Vector3(position.x, position.y + 100, position.z)))
                        object.rotation.y += Math.random() - 0.1 * (Math.PI * 0.5)
                        object.rotation.z += Math.random() - 0.1 * (Math.PI * 0.5)
                        object.rotation.x += Math.random() - 0.1 * (Math.PI * 0.5)

                        object.updateMatrix()
                        return object
                    }}
                    mesh={geomRef}
                    instances={flowerRef}
                    weight="flowerDensity"
                /> */}
            </group>
        </>
    )
}
