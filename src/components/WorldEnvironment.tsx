import { Environment } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

export const WorldEnvironment = () => {
    const environmentTexture = useMemo(
        () =>
            new THREE.CubeTextureLoader().load([
                '/envMap/pinkSceneEnvMap.jpg',
                '/envMap/pinkSceneEnvMap.jpg',
                '/envMap/pinkSceneEnvMap.jpg',
                '/envMap/pinkSceneEnvMap.jpg',
                '/envMap/pinkSceneEnvMap.jpg',
                '/envMap/pinkSceneEnvMap.jpg',
            ]),
        []
    )
    return <Environment preset={undefined} map={environmentTexture} />
}
