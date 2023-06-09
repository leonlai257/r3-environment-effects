import { useGLTF, useTexture } from '@react-three/drei'
import { LayerMaterial, Texture } from 'lamina'
import { forwardRef } from 'react'
import { DoubleSide } from 'three'

// Flower component, using instanced mesh and alpha blending
export const Flower = forwardRef((props, ref) => {
    const { nodes } = useGLTF('/models/flower.glb')
    const map = useTexture('/textures/flowerDiffuse.jpg')
    const ao = useTexture('/textures/flowerAlpha.jpg')

    return (
        <group>
            <instancedMesh
                ref={ref}
                args={[undefined, undefined, 1000]}
                castShadow
                receiveShadow
                geometry={nodes._ndyj_Var10_LOD0.geometry}
                {...props}>
                <LayerMaterial lighting="standard" side={DoubleSide}>
                    <Texture map={map} />
                    <Texture map={ao} mode="multiply" />
                </LayerMaterial>
            </instancedMesh>
        </group>
    )
})
