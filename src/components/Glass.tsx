import { Cylinder, MeshTransmissionMaterial } from '@react-three/drei'
import { ThreeElements, useFrame } from '@react-three/fiber'
import { ForwardedRef, forwardRef, useState } from 'react'

export type GlassProps = {
    onClick: () => void
    lerpSpeed?: number
    targetLocation?: THREE.Vector3
    props?: ThreeElements['mesh']
}

export const Glass = forwardRef(({ onClick, lerpSpeed, targetLocation, props }: GlassProps, ref: ForwardedRef<THREE.Mesh>) => {
    const [hovered, setHover] = useState(false)

    useFrame(() => {
        if (targetLocation && targetLocation !== ref.current?.position) {
            ref.current?.position.lerp(targetLocation, lerpSpeed || 0.03)
        }
    })
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
        <mesh ref={ref} {...props} onClick={() => onClick()} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <cylinderGeometry args={[8, 8, 1, 64]} />
            <MeshTransmissionMaterial
                color={hovered ? 'blue' : 'pink'}
                thickness={10.0}
                chromaticAberration={0.3}
                anisotropy={0.8}
                reflectivity={0.5}
                clearcoat={1}
                clearcoatRoughness={0.2}
                distortionScale={0.1}
                temporalDistortion={0}
            />
        </mesh>

        // </Caustics>
    )
})
