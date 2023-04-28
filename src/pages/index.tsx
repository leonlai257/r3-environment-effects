import { AltGrass, Grass, Glass, HeightMap, Clouds, WaterPlane, SkyBox } from '@/components'
import { Environment, OrbitControls, PerspectiveCamera, Plane, Sky, Sphere } from '@react-three/drei'
import { Suspense, createRef, useState } from 'react'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'

export const DEFAULT_CONTROL_VALUES = {
    seed: 'React3-Environment-Test',
    resolution: {
        value: 40,
        min: 1,
        max: 100,
        step: 1,
    },
    maxHeight: {
        value: 3.5,
        min: 1,
        max: 5,
        step: 0.1,
    },
    frequency: {
        value: 3,
        min: 0.1,
        max: 8,
        step: 0.1,
    },
    exponent: {
        value: 3,
        min: 1,
        max: 4.5,
        step: 0.25,
    },
    octaves: {
        value: 2,
        min: 1,
        max: 6,
        step: 1,
    },
    limits: {
        value: 0.4,
        min: 0,
        max: 1,
        step: 0.05,
    },
    strands: {
        value: 1000,
        min: 0,
        max: 20000,
        step: 100,
    },
    time: {
        value: 0.9,
        min: 0,
        max: 1,
        step: 0.05,
    },
}

const Main = () => {
    const cameraRef = createRef()

    const [fov] = useState(75)

    const mapSize = 10

    return (
        <>
            {/* <fog attach="fog" args={['hotpink', 20, 200]} /> */}
            <Suspense fallback={null}>
                <SkyBox config={DEFAULT_CONTROL_VALUES} />
                {/* <Clouds /> */}
                <Glass position={[0, 30, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[2, 2, 2]} />

                <WaterPlane
                    size={mapSize}
                    props={{
                        position: [0, 3, 0],
                    }}
                />
                {/* <HeightMap size={mapSize} config={DEFAULT_CONTROL_VALUES} /> */}

                <Grass config={DEFAULT_CONTROL_VALUES}>
                    <HeightMap size={mapSize} config={DEFAULT_CONTROL_VALUES} />
                </Grass>
                <Environment preset="city"></Environment>
            </Suspense>

            <PerspectiveCamera makeDefault ref={cameraRef} fov={fov} near={0.1} far={1000} position={[0, 30, -70]} />
            {/* <EffectComposer>
                <DepthOfField focusDistance={0.05} focalLength={0.02} bokehScale={2} />
            </EffectComposer> */}

            <OrbitControls enableZoom={true} enableRotate={true} />
        </>
    )
}

export default Main
