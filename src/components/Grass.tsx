import React, { JSXElementConstructor, ReactElement, ReactNode, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ThreeElements, extend, useFrame } from '@react-three/fiber'
import { Depth, LayerMaterial } from 'lamina'
import { Sampler } from '@react-three/drei'
import WindLayer from '../shaders/windLayer'
import { Flower } from './Flower'
import Perlin from 'perlin.js'
import { DepthProps } from 'lamina/types'

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
    strands?: number
    props?: any
}

export const Grass = ({ children, strands = 1000, ...props }: GrassProps) => {
    const grassInstanceRef = useRef<THREE.InstancedMesh>(null!)
    const flowerRef = useRef<THREE.InstancedMesh>(null!)
    const windLayer = useRef<DepthProps>(null!)
    const geomRef = useRef<THREE.Mesh>(null!)
    useEffect(() => {
        console.log(children)
        console.log(geomRef)
        grassInstanceRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        grassInstanceRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))

        // flowerRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        // flowerRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
    }, [])

    useFrame(() => (windLayer.current.time += 0.005))
    return (
        <>
            {React.cloneElement(children, { ref: geomRef })}

            {/* <Flower ref={flowerRef} /> */}
            <instancedMesh ref={grassInstanceRef} args={[undefined, undefined, strands]}>
                <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} />
                <LayerMaterial side={THREE.DoubleSide} lighting="physical" envMapIntensity={1}>
                    <Depth colorA="#221600" colorB="#ade266" near={0.14} far={1.52} mapping={'world'} />
                    <windLayer
                        args={[{ mode: 'multiply' }]}
                        colorA={'#ffffff'}
                        colorB={'#acf5ce'}
                        noiseScale={10}
                        noiseStrength={5}
                        length={1.4}
                        sway={0.1}
                        ref={windLayer}
                    />
                </LayerMaterial>
            </instancedMesh>
            <group rotation={[0, 0, Math.PI / 2]}>
                <Sampler
                    count={strands}
                    matrixAutoUpdate
                    matrixWorldNeedsUpdate
                    transform={({ sampledMesh, position, normal, dummy: object }) => {
                        // Set random scaling
                        const p = position.clone().multiplyScalar(200)
                        const n = Perlin.simplex3(...p.toArray())
                        object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, 0.3, 1) * 5)

                        // Set instances position
                        object.position.copy(sampledMesh.localToWorld(position))

                        // Set random rotation
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
                    weight="density"
                /> */}
            </group>
        </>
    )
}
