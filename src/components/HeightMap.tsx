import { extend } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BufferAttribute } from 'three'
import useFlipPlaneOnX from '../hooks/useFlipPlaneOnX'
import useNoisyVertices from '../hooks/useNoisyVertices'

type ControlConfig = {
    value: number
    min: number
    max: number
    step: number
}

export type HeightMapConfig = {
    seed: string
    resolution: ControlConfig
    maxHeight: ControlConfig
    frequency: ControlConfig
    exponent: ControlConfig
    octaves: ControlConfig
}

interface HeightMapProps {
    config: HeightMapConfig
    size?: number
}

export const HeightMap = ({ config, size }: HeightMapProps) => {
    const controls = useControls(config)
    const ref = useRef<THREE.Mesh>(null)
    const planeGeom = useRef<THREE.PlaneGeometry>(null!)
    useFlipPlaneOnX(ref)

    const vertices = useNoisyVertices(controls, {
        ...controls,
    })
    console.log(vertices)

    const CustomMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color('red'),
            },
            color2: {
                value: new THREE.Color('purple'),
            },
        },
        vertexShader: `
            varying vec2 vUv;
        
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
          
            varying vec2 vUv;
            
            void main() {
              
              gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
          `,
        wireframe: true,
    })

    extend({ CustomMaterial })

    useEffect(() => {
        if (!ref.current || !planeGeom.current) {
            return
        }
        planeGeom.current.setAttribute('position', new BufferAttribute(vertices, 3))
        planeGeom.current.attributes.position.needsUpdate = true
        planeGeom.current.computeVertexNormals()
    }, [vertices, ref, planeGeom])

    return (
        <mesh ref={ref} castShadow={false} receiveShadow={false}>
            <planeGeometry args={[size, size, controls.resolution, controls.resolution]} ref={planeGeom} />
            {/* <shaderMaterial
                    uniforms={heatMapMaterial.uniforms}
                    vertexShader={heatMapMaterial.vertexShader}
                    fragmentShader={heatMapMaterial.fragmentShader}
                /> */}
            <shaderMaterial {...CustomMaterial} />
            <meshLambertMaterial color={'white'} side={THREE.DoubleSide} />
            {/* <CustomMaterial /> */}
        </mesh>
    )
}
