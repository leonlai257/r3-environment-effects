import { Grass, Glass, HeightMap, Clouds, WaterPlane, SkyBox, WorldEnvironment, AnimationType, HtmlAnimation, Tunnel } from '@/components'
import { Billboard, Environment, Html, OrbitControls, PerspectiveCamera, useDetectGPU } from '@react-three/drei'
import { Suspense, createRef, useEffect, useState } from 'react'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { invalidate, useFrame, useThree } from '@react-three/fiber'
import { ControlConfigType } from '@/types'
import * as THREE from 'three'
import BlurTransition from '@/effects/blurTransition'

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
    strands: {
        value: 1000,
        min: 0,
        max: 500000,
        step: 100,
    },
}

const Main = () => {
    const orbitsControlRef = createRef<any>()
    const glassRef = createRef<THREE.Mesh>()

    const state = useThree()
    const camera = state.camera as THREE.PerspectiveCamera
    const cameraDefaultPosition = new THREE.Vector3(0, 30, -70)

    const mapSize = 10
    const GPUTier = useDetectGPU()
    console.log(GPUTier.tier === 0 || GPUTier.isMobile ? 'low-setting' : 'high-setting')

    const [fov, setFov] = useState(75)
    const [transition, setTransition] = useState<string>('enterScene')
    const [animation, setAnimation] = useState<AnimationType>('enterScene')

    const [isUserInteraction, setUserInteraction] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => {
            setAnimation('leaveTunnelEnterWorld')
        }, 2700)

        setTimeout(() => {
            setTransition('')
            setUserInteraction(true)
            camera.position.set(cameraDefaultPosition.x, cameraDefaultPosition.y, cameraDefaultPosition.z)
        }, 3000)
    }, [])

    useFrame(() => {
        if (orbitsControlRef.current) {
            if (isUserInteraction) {
                setTimeout(() => {
                    if (isUserInteraction) {
                        setUserInteraction(false)
                    }
                }, 1000)
            }
        }

        if (transition === 'room') {
            setTimeout(() => {
                setAnimation('fadeIn')
            }, 5000)
        }
    })

    const onGlassClick = () => {
        if (glassRef.current) {
            camera.lookAt(new THREE.Vector3(glassRef.current.position.x, glassRef.current.position.y, glassRef.current.position.z))
            camera.updateProjectionMatrix()
        }
        setAnimation('fadeInAndOut')
        setTransition('room')
    }

    return (
        <>
            <Html
                as="div"
                fullscreen
                zIndexRange={[100, 0]}
                style={{
                    backgroundColor: 'transparent',
                }}>
                <HtmlAnimation animation={animation == '' ? 'enterScene' : animation} />
            </Html>
            <fog attach="fog" args={['hotpink', 20, 240]} />
            <Suspense
                fallback={
                    <Tunnel
                        position={[0, 30, 500]}
                        radius={16}
                        length={50}
                        props={{
                            rotation: [-Math.PI, 0, 0],
                        }}
                    />
                }>
                <SkyBox />
                {transition !== 'enterScene' && (
                    <group>
                        {/* <Clouds targetLocations={[new THREE.Vector3(50, 20, 80), new THREE.Vector3(-50, 20, 80)]} /> */}
                        <Billboard>
                            <Glass
                                ref={glassRef}
                                onClick={() => onGlassClick()}
                                lerpSpeed={0.03}
                                targetLocation={new THREE.Vector3(0, 30, 0)}
                                props={{
                                    position: [0, 100, 0],
                                    rotation: [(Math.PI * 10) / 18, 0, 0],
                                    scale: [2, 2, 2],
                                }}
                            />
                        </Billboard>
                    </group>
                )}

                <WaterPlane
                    size={mapSize}
                    props={{
                        position: [0, 3, 0],
                    }}
                />

                <Grass config={DEFAULT_CONTROL_VALUES}>
                    <HeightMap size={mapSize} config={DEFAULT_CONTROL_VALUES} />
                </Grass>
                <Environment preset="sunset" />
                <WorldEnvironment />
            </Suspense>

            {/* {transition && <BlurTransition />} */}

            {transition && (
                <Tunnel
                    position={[0, 30, 500]}
                    radius={16}
                    length={7}
                    props={{
                        rotation: [-Math.PI, 0, 0],
                    }}
                />
            )}

            <PerspectiveCamera
                makeDefault
                fov={fov}
                near={0.1}
                far={1000}
                position={[cameraDefaultPosition.x, cameraDefaultPosition.y, cameraDefaultPosition.z]}
            />
            {/* <EffectComposer>
                <DepthOfField focusDistance={0.1} focalLength={0.1} bokehScale={4.0} />
            </EffectComposer> */}

            <OrbitControls
                ref={orbitsControlRef}
                enableZoom={true}
                enableRotate={transition ? false : true}
                autoRotate={isUserInteraction ? false : true}
                minPolarAngle={transition ? Math.PI - Math.PI : (Math.PI * 8) / 36}
                maxPolarAngle={transition ? Math.PI : (Math.PI * 16) / 36}
            />
        </>
    )
}

export default Main
