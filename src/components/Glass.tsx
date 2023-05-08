import { MeshTransmissionMaterial } from '@react-three/drei'
import { ThreeElements, useFrame } from '@react-three/fiber'
import { ForwardedRef, forwardRef, useState } from 'react'

export type GlassProps = {
    onClick: () => void
    lerpSpeed?: number
    targetLocation?: THREE.Vector3
    props?: ThreeElements['mesh']
}

// Glass, it uses a Cylinder mesh with the MeshTransmissionMaterial for effect
export const Glass = forwardRef(({ onClick, lerpSpeed, targetLocation, props }: GlassProps, ref: ForwardedRef<THREE.Mesh>) => {
    const [hovered, setHover] = useState(false)

    useFrame(() => {
        // Moving the glass to the target location
        if (ref && targetLocation && targetLocation !== ref.current.position) {
            ref.current.position.lerp(targetLocation, lerpSpeed || 0.03)
        }
    })
    return (
        <mesh ref={ref} {...props} onClick={() => onClick()} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <cylinderGeometry args={[8, 8, 1, 64]} />
            <MeshTransmissionMaterial
                color={hovered ? 'blue' : 'pink'} // Change the color based on hover
                thickness={10.0}
                chromaticAberration={0.3}
                anisotropy={0.8}
                reflectivity={0.5} // The reflection is based on environment
                clearcoat={1}
                clearcoatRoughness={0.2}
                distortionScale={0.1}
                temporalDistortion={0}
            />
        </mesh>
    )
})
