import { Cloud } from '@react-three/drei'
import { ThreeElements, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

type CloudsProps = {
    lerpSpeeds?: number[]
    targetLocations?: THREE.Vector3[]
    props?: ThreeElements['group']
}

// Cloud component, it handles the clouds in a group
export const Clouds = ({ lerpSpeeds, targetLocations, props }: CloudsProps) => {
    const cloudRef1 = useRef<THREE.Group>(null!)
    const cloudRef2 = useRef<THREE.Group>(null!)

    useFrame(() => {
        // Moving the clouds to the target locations
        if (targetLocations) {
            if (targetLocations[0] !== cloudRef1.current?.position) {
                cloudRef1.current?.position.lerp(targetLocations[0], 0.024)
            }

            if (targetLocations[1] !== cloudRef2.current?.position) {
                cloudRef2.current?.position.lerp(targetLocations[1], 0.018)
            }
        }
    })

    return (
        <group {...props}>
            <group ref={cloudRef1} position={[100, 20, 80]}>
                <Cloud color={'#ffffff'} opacity={1} speed={0.4} width={40} depth={0.8} segments={200} />
            </group>

            <group ref={cloudRef2} position={[-100, 20, 80]}>
                <Cloud color={'#ffffff'} opacity={1} speed={0.4} width={40} depth={0.8} segments={200} />
            </group>
        </group>
    )
}
