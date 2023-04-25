import React, { JSXElementConstructor, ReactElement, ReactNode, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ThreeElements, extend, useFrame } from '@react-three/fiber'
import { Depth, LayerMaterial } from 'lamina'
import { Sampler } from '@react-three/drei'
import WindLayer from '../shaders/windLayer'
import { Flower } from './Flower'
import Perlin from 'perlin.js'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            windLayer: THREE.Layers
        }
    }
}

Perlin.seed(Math.random())
extend({ WindLayer })

type GrassProps = {
    children: ReactElement<any, string | JSXElementConstructor<any>>
    strands?: number
    props?: any
}

export const Grass = ({ children, strands = 1000, ...props }: GrassProps) => {
    const grassSamplerRef = useRef(null!)
    const meshRef = useRef<THREE.InstancedMesh>(null!)
    const windLayer = useRef<THREE.Layers>(null!)
    const flowerRef = useRef<THREE.Mesh>(null!)
    const geomRef = useRef<THREE.Mesh>(null!)
    useEffect(() => {
        console.log(children)
        console.log(geomRef)
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))

        // flowerRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        // flowerRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
    }, [])

    useEffect(() => {
        console.log(grassSamplerRef)
    })

    useFrame(() => (windLayer.current.time += 0.005))
    return (
        <>
            {React.cloneElement(children, { ref: geomRef })}

            {/* <Flower ref={flowerRef} /> */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, strands]}>
                <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} />
                <LayerMaterial side={THREE.DoubleSide} lighting="physical" envMapIntensity={1}>
                    <Depth colorA="#221600" colorB="#ade266" near={0.14} far={1.52} mapping={'world'} />
                    <windLayer
                        args={[{ mode: 'multiply' }]}
                        colorA={'#ffffff'}
                        colorB={'#acf5ce'}
                        noiseScale={10}
                        noiseStrength={5}
                        length={1.2}
                        sway={0.5}
                        ref={windLayer}
                    />
                </LayerMaterial>
            </instancedMesh>
            <group rotation={[0, -Math.PI / 2, 0]}>
                <Sampler
                    ref={grassSamplerRef}
                    matrixAutoUpdate
                    matrixWorldNeedsUpdate
                    transform={({ position, normal, dummy: object }) => {
                        const p = position.clone().multiplyScalar(200)
                        const n = Perlin.simplex3(...p.toArray())
                        object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, 0.3, 1) * 10)
                        object.position.copy(position)
                        object.lookAt(normal.add(new THREE.Vector3(position.x, position.y + 100, position.z)))
                        object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
                        object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
                        object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
                        object.updateMatrix()
                        return object
                    }}
                    mesh={geomRef}
                    instances={meshRef}>
                    {/* {children} */}
                </Sampler>
                {/* <Sampler
                    transform={({ position, normal, dummy: object }) => {
                        object.scale.setScalar(Math.random() * 0.0075)
                        object.position.copy(position)
                        object.lookAt(normal.add(position))
                        object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
                        object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
                        object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
                        object.updateMatrix()
                        return object
                    }}
                    mesh={geomRef}
                    instances={flowerRef}
                    weight="density"
                /> */}
            </group>
        </>
    )
}
