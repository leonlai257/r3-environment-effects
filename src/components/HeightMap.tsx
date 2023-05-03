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
import { ControlConfigType } from '@/types'

const computeGrassDensity = (geometry: THREE.BufferGeometry) => {
    const position = geometry.getAttribute('position') as BufferAttribute
    const density = []
    let vertex = new THREE.Vector3()
    let vertexZ = 0
    for (let i = 0; i < position.count; i += 3) {
        vertex.fromBufferAttribute(position, i)
        const p = vertex.clone().multiplyScalar(1)
        const n = Perlin.simplex3(...p.toArray())
        let m = THREE.MathUtils.mapLinear(n, -1, 1, 0, 1)

        vertexZ = vertex.fromBufferAttribute(position, i - 1).z
        // console.log(vertexZ)
        if (m < 0.15) m = 0
        // if (vertexZ <= 10.0) m = 0
        for (let j = 0; j <= 3; j++) {
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

interface HeightMapProps {
    config: ControlConfigType
    size?: number
}

export const HeightMap = forwardRef((props: HeightMapProps, ref?: ForwardedRef<THREE.Mesh>) => {
    const { config, size = 100 } = props
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
        } else {
            invalidate()
        }
        planeGeom.current.setAttribute('position', new BufferAttribute(vertices, 3))
        planeGeom.current.attributes.position.needsUpdate = true
        planeGeom.current.computeVertexNormals()
    }, [vertices, ref, planeGeom])

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
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
