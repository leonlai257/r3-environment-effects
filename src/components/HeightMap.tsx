import { invalidate, useLoader } from '@react-three/fiber'
import { useControls } from 'leva'
import { ForwardedRef, Ref, forwardRef, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BufferAttribute } from 'three'
import useFlipPlaneOnX from '../hooks/useFlipPlaneOnX'
import useNoisyVertices from '../hooks/useNoisyVertices'
import Perlin from 'perlin.js'
import { ComputedAttribute } from '@react-three/drei'
import { AltGrass } from './AltGrass'

const computeGrassDensity = (geometry: THREE.BufferGeometry) => {
    const position = geometry.getAttribute('position') as BufferAttribute
    const density = []
    const vertex = new THREE.Vector3()
    console.log(position)
    for (let i = 0; i < position.count; i += 3) {
        vertex.fromBufferAttribute(position, i)

        const p = vertex.clone().multiplyScalar(1)
        const n = Perlin.simplex3(...p.toArray())
        let m = THREE.MathUtils.mapLinear(n, -1, 1, 0, 1)

        if (m > 0.5 && i <= 5.0) m = 0
        for (let i = 0; i < 3; i++) {
            density.push(m)
        }
    }
    return new THREE.Float32BufferAttribute(density, 1)
}

const computeFlowerDensity = (geometry: THREE.BufferGeometry) => {
    const position = geometry.getAttribute('position') as BufferAttribute
    const density = []
    const vertex = new THREE.Vector3()
    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i)
        const p = vertex.clone().multiplyScalar(1)
        const n = Perlin.simplex3(...p.toArray())
        let m = THREE.MathUtils.mapLinear(n, -1, 1, 0, 1)
        if (m > 0.15) m = 0
        density.push(m)
    }
    return new THREE.Float32BufferAttribute(density, 1)
}

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

export const HeightMap = forwardRef(({ config, size }: HeightMapProps, ref?: ForwardedRef<THREE.Mesh>) => {
    const controls = useControls(config)
    // const ref = useRef<THREE.Mesh>(null)
    const planeGeom = useRef<THREE.BufferGeometry>(null!)

    let vertices = useNoisyVertices(controls, {
        ...controls,
    })

    const gradientTexture = useLoader(THREE.TextureLoader, '/heightmap/biomeGradientMap.png')
    // const gradientTexture = useLoader(THREE.TextureLoader, '/heightmap/heatGradientMap.png')

    let CustomMaterial = new THREE.ShaderMaterial({
        uniforms: {
            colorTexture: {
                value: gradientTexture,
            },
            limits: {
                value: controls.limits || 0.4,
            },
            height: {
                value: controls.maxHeight || 3.5,
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
            float h = (vPos.z - (-limits))/(limits * height * 20.);
            vec4 diffuseColor = texture2D(colorTexture, vec2(vPos.z, h) ) ;
            gl_FragColor = vec4(diffuseColor.rgb, 1.0);
          }
      `,
    })

    useEffect(() => {
        if (!planeGeom.current) {
            return
        }
        planeGeom.current.setAttribute('position', new BufferAttribute(vertices, 3))
        planeGeom.current.attributes.position.needsUpdate = true
        planeGeom.current.computeVertexNormals()
    }, [vertices, ref, planeGeom])

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
            {/* <AltGrass vertices={vertices} /> */}
            <planeBufferGeometry args={[size, size, controls.resolution, controls.resolution]} ref={planeGeom}>
                <ComputedAttribute name="grassDensity" compute={computeGrassDensity} usage={THREE.StaticReadUsage} />
            </planeBufferGeometry>
            <shaderMaterial
                uniforms={CustomMaterial.uniforms}
                vertexShader={CustomMaterial.vertexShader}
                fragmentShader={CustomMaterial.fragmentShader}
            />
            {/* <meshLambertMaterial color={'white'} side={THREE.DoubleSide} /> */}
        </mesh>
    )
})
