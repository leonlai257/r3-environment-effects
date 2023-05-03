import {
    AltGrass,
    Grass,
    Glass,
    HeightMap,
    Clouds,
    WaterPlane,
    SkyBox,
    WorldEnvironment,
    AnimationType,
    HtmlAnimation,
    Tunnel,
} from '@/components'
import { Environment, Html, OrbitControls, PerspectiveCamera, Plane, Sky, Sphere, useDetectGPU } from '@react-three/drei'
import { Suspense, createRef, useState } from 'react'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { useFrame, useThree } from '@react-three/fiber'
import { ControlConfigType } from '@/types'
import * as THREE from 'three'

export const DEFAULT_CONTROL_VALUES: ControlConfigType = {
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
        max: 500000,
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
    const glassRef = createRef<THREE.Mesh>()
    const state = useThree()
    const camera = state.camera as THREE.PerspectiveCamera

    const mapSize = 10
    const GPUTier = useDetectGPU()
    console.log(GPUTier.tier === 0 || GPUTier.isMobile ? 'low-setting' : 'high-setting')

    const [fov, setFov] = useState(75)
    const [transition, setTransition] = useState<string>('')
    const [animation, setAnimation] = useState<AnimationType>('fadeOut')

    const defaultFocalLength = camera.getFocalLength()
    useFrame(() => {
        if (transition) {
            console.log(camera.fov)
            camera.setFocalLength(camera.getFocalLength() + 0.5)
        }
        if (camera.fov <= 30) {
            if (transition === 'room') {
                camera.setFocalLength(defaultFocalLength)
            }
            setTransition('')
        }
    })

    const onGlassClick = () => {
        if (glassRef.current) {
            camera.lookAt(new THREE.Vector3(glassRef.current.position.x, glassRef.current.position.y, glassRef.current.position.z))
            camera.updateProjectionMatrix()
        }
        setTransition('room')
    }

    return (
        <>
            <Html as="div" fullscreen zIndexRange={[9999, 0]}>
                <HtmlAnimation animation={animation == '' ? 'fadeOut' : animation} />
            </Html>
            {/* <fog attach="fog" args={['hotpink', 20, 200]} /> */}
            <Suspense fallback={null}>
                <Tunnel
                    radius={16}
                    length={50}
                    props={{
                        position: [0, 30, 0],
                        rotation: [-Math.PI / 2, 0, 0],
                    }}
                />
                <SkyBox config={DEFAULT_CONTROL_VALUES} />
                {/* <Clouds /> */}
                <Glass
                    ref={glassRef}
                    onClick={() => onGlassClick()}
                    props={{
                        position: [0, 30, 0],
                        rotation: [Math.PI / 2, 0, 0],
                        scale: [2, 2, 2],
                    }}
                />

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
                <Environment preset="sunset" />
                {/* <WorldEnvironment /> */}
            </Suspense>

            <PerspectiveCamera makeDefault fov={fov} near={0.1} far={1000} position={[0, 30, -70]} />
            {/* <EffectComposer>
                <DepthOfField focusDistance={0.1} focalLength={0.1} bokehScale={4.0} />
            </EffectComposer> */}

            <OrbitControls enableZoom={true} enableRotate={true} />
        </>
    )
}

export default Main
