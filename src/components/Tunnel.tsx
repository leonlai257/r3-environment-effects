import { ThreeElements, useFrame, useLoader, useThree } from '@react-three/fiber'
import { createRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export type TunnelProps = {
    position: [number, number, number]
    speed?: number
    radius?: number
    length?: number
    props?: ThreeElements['mesh']
}

export const Tunnel = ({ position, speed = 10, radius = 16, length = 50, props }: TunnelProps) => {
    const materialRef = createRef<THREE.MeshBasicMaterial>()
    const vec = new THREE.Vector3()
    const { mouse, camera } = useThree()
    const cameraOffset: number = 10

    const texture = useLoader(THREE.TextureLoader, '/textures/galaxyTexture.jpeg')

    useEffect(() => {
        texture.wrapS = THREE.MirroredRepeatWrapping
        texture.wrapT = THREE.MirroredRepeatWrapping
        texture.repeat.set(2, 10)
        // camera.position.set(0, position[1], 100)
    }, [])

    const [curve, setCurve] = useState(() => {
        let points = []
        for (let i = 0; i < 5; i += 1) {
            points.push(new THREE.Vector3(0, 0, 50 * i))
        }
        return new THREE.CatmullRomCurve3(points)
    })
    let geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(70))
    let splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())

    useFrame(() => {
        setCurve(() => {
            const newCurve = curve.clone()
            newCurve.points[2].x = radius * -mouse.x * 1.5
            newCurve.points[2].y = radius * -mouse.y * 1.5
            newCurve.points[3].x = 0
            newCurve.points[3].y = 0
            newCurve.points[4].x = radius * (1 - mouse.x)
            newCurve.points[4].y = radius * (1 - mouse.y)

            // newCurve.points[4].x = -mouse.x * 0.1 * radius
            return newCurve
        })

        texture.offset.x += 0.1
        texture.offset.y += 0.03
        if (texture.repeat.x >= 0.5) {
            texture.repeat.x = texture.repeat.x - 0.02
        }

        camera.position.lerp(vec.set(-mouse.x * cameraOffset, position[1] - mouse.y * cameraOffset, position[2]), 0.05)
    })

    return (
        <mesh position={position} {...props}>
            <tubeGeometry args={[curve, 70, radius, length, false]} onUpdate={(self) => (self.verticesNeedUpdate = true)} />
            <meshBasicMaterial ref={materialRef} map={texture} side={THREE.BackSide} />
        </mesh>
    )
}
