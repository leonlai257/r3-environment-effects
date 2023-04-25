import { useLoader } from '@react-three/fiber'
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
    limits: ControlConfig
}

interface HeightMapProps {
    config: HeightMapConfig
    size?: number
}

export const HeightMap = ({ config, size }: HeightMapProps) => {
    const controls = useControls(config)
    const ref = useRef<THREE.Mesh>(null)
    const planeGeom = useRef<THREE.BufferGeometry>(null!)
    useFlipPlaneOnX(ref)

    let vertices = useNoisyVertices(controls, {
        ...controls,
    })

    vertices = vertices.map((vertex: any, index) => {
        if ((index + 1) % 3 === 0) {
            vertex = vertex * 1
        }
        return vertex
    })

    console.log('vertices: ', vertices)

    // const gradientTexture = useLoader(THREE.TextureLoader, '/heightmap/biomeGradientMap.png')
    const gradientTexture = useLoader(THREE.TextureLoader, '/heightmap/heatGradientMap.png')

    let CustomMaterial = new THREE.ShaderMaterial({
        uniforms: {
            colorTexture: {
                value: gradientTexture,
            },
            limits: {
                value: config.limits.value || 0.4,
            },
            height: {
                value: config.maxHeight.value || 3.5,
            },
        },
        vertexShader: `
          varying vec3 vPos;

          void main() {
            vPos = position;
            gl_Position =  projectionMatrix * modelViewMatrix * vec4(vPos,1.0);
          }
        `,
        fragmentShader: `    
          varying vec3 vPos;

          uniform float limits;
          uniform sampler2D colorTexture;
          uniform float height;
          
          void main() {
            // float h = clamp(vPos.z, 0., 1.) ;
            float h = (vPos.z - (-limits))/(limits * height * 20.);
            // h = clamp(h, 0., 1.);
            vec4 diffuseColor = texture2D(colorTexture, vec2(0, h) ) ;
            gl_FragColor = vec4(diffuseColor.rgb, 1.0);
          }
      `,
    })

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
            <planeBufferGeometry args={[size, size, controls.resolution, controls.resolution]} ref={planeGeom} />
            <shaderMaterial
                uniforms={CustomMaterial.uniforms}
                vertexShader={CustomMaterial.vertexShader}
                fragmentShader={CustomMaterial.fragmentShader}
            />
            {/* <meshLambertMaterial color={'white'} side={THREE.DoubleSide} /> */}
        </mesh>
    )
}
