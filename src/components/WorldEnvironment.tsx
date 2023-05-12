import { Environment } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

// Environment for reflection, using react drei's Environment component
export const WorldEnvironment = () => {
    return <Environment preset={undefined} files={'/envMap/sunsetEnvironment.hdr'} />
}
