import { ThreeElements, useFrame, useLoader, useThree } from '@react-three/fiber'
import { createRef, useState } from 'react'
import * as THREE from 'three'

export type TunnelProps = {
    speed?: number
    radius?: number
    length?: number
    props?: ThreeElements['mesh']
}

export const Tunnel = ({ speed = 10, radius = 16, length = 50, props }: TunnelProps) => {
    const materialRef = createRef<THREE.MeshBasicMaterial>()
    const vec = new THREE.Vector3()
    const { mouse, camera } = useThree()
    const cameraOffset: number = 10

    const texture = useLoader(THREE.TextureLoader, '/textures/galaxyTexture.jpeg')
    texture.wrapS = THREE.MirroredRepeatWrapping
    texture.wrapT = THREE.MirroredRepeatWrapping
    texture.repeat.set(4, 10)

    const [curve] = useState(() => {
        // Create an empty array to stores the points
        let points = []
        // Define points along Z axis
        for (let i = 0; i < length; i += 1) {
            points.push(new THREE.Vector3(0, 10 * (i / 4)))
        }
        return new THREE.CatmullRomCurve3(points)
    })
    let geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(70))
    let splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())
    // let tubeGeometry = new THREE.TubeGeometry(curve, 70, 0.02, 30, false);
    // let tubeGeometry_o = tubeGeometry.clone();

    useFrame(() => {
        texture.offset.x -= 0.02
        texture.offset.y += 0.01

        camera.position.lerp(vec.set(-mouse.x * cameraOffset, 30 - mouse.y * cameraOffset, -100), 0.05)
    })

    return (
        <mesh {...props}>
            <tubeGeometry args={[curve, 70, radius, length, false]} />
            <meshBasicMaterial ref={materialRef} map={texture} side={THREE.BackSide} />
        </mesh>
    )
}
