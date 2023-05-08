import { Environment } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

// Environment for reflection, using react drei's Environment component
export const WorldEnvironment = () => {
    const environmentTexture = useMemo(() => new THREE.CubeTextureLoader().load(['/envMap/sunsetEnvironment.hdr']), [])
    return <Environment preset={undefined} map={environmentTexture} />
}
