import { ThreeElements, useLoader } from '@react-three/fiber'
import { createRef, useState } from 'react'
import * as THREE from 'three'

export type TunnelProps = {
    radius?: number
    length?: number
    props?: ThreeElements['mesh']
}

export const Tunnel = ({ radius = 16, length = 50, props }: TunnelProps) => {
    const materialRef = createRef<THREE.MeshBasicMaterial>()
    const texture = useLoader(THREE.TextureLoader, '/textures/galaxyTexture.jpeg')
    texture.wrapS = THREE.MirroredRepeatWrapping
    texture.wrapT = THREE.MirroredRepeatWrapping
    texture.repeat.set(texture.repeat.x, texture.repeat.y)

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

    return (
        <mesh {...props}>
            <tubeGeometry args={[curve, 70, radius, length, false]} />
            <meshBasicMaterial ref={materialRef} map={texture} side={THREE.DoubleSide} />
        </mesh>
    )
}
