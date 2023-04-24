import { extend } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BufferAttribute, MeshBasicMaterial, Vector2 } from 'three'
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

// function setGradient(geometry: THREE.BufferGeometry, colors, axis, reverse) {
//     geometry.computeBoundingBox()

//     var bbox = geometry.boundingBox
//     var size = new THREE.Vector3().subVectors(bbox.max, bbox.min)

//     var vertexIndices = ['a', 'b', 'c']
//     var face,
//         vertex,
//         normalized = new THREE.Vector3(),
//         normalizedAxis = 0

//     const geometryIndexArray = geometry.getIndex().array
//     for (let i = 0; i < geometryIndexArray.length; i++) {

//     }
//     geometryIndexArray.map((index) => {

//         })
//     let faces =

//     for (var c = 0; c < colors.length - 1; c++) {
//         var colorDiff = colors[c + 1].stop - colors[c].stop

//         for (var i = 0; i < geometry.faces.length; i++) {
//             face = geometry.faces[i]
//             for (var v = 0; v < 3; v++) {
//                 vertex = geometry.vertices[face[vertexIndices[v]]]
//                 normalizedAxis = normalized.subVectors(vertex, bbox.min).divide(size)[axis]
//                 if (reverse) {
//                     normalizedAxis = 1 - normalizedAxis
//                 }
//                 if (normalizedAxis >= colors[c].stop && normalizedAxis <= colors[c + 1].stop) {
//                     var localNormalizedAxis = (normalizedAxis - colors[c].stop) / colorDiff
//                     face.vertexColors[v] = colors[c].color.clone().lerp(colors[c + 1].color, localNormalizedAxis)
//                 }
//             }
//         }
//     }
// }

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

    var colors = [
        {
            stop: 0,
            color: new THREE.Color(0xf7b000),
        },
        {
            stop: 0.25,
            color: new THREE.Color(0xdd0080),
        },
        {
            stop: 0.5,
            color: new THREE.Color(0x622b85),
        },
        {
            stop: 0.75,
            color: new THREE.Color(0x007dae),
        },
        {
            stop: 1,
            color: new THREE.Color(0x77c8db),
        },
    ]

    let CustomMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: {
                value: new THREE.Color('green'),
            },
            color2: {
                value: new THREE.Color('white'),
            },
        },
        vertexShader: `
        varying vec2 vUv;
    
        void main() {
          // vUv = uv;
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
    })

    useEffect(() => {
        if (!ref.current || !planeGeom.current) {
            return
        }
        planeGeom.current.setAttribute('position', new BufferAttribute(vertices, 3))
        planeGeom.current.attributes.position.needsUpdate = true
        console.log(planeGeom.current)
        // setGradient(planeGeom.current, colors, 'z', true)
        planeGeom.current.computeVertexNormals()
    }, [vertices, ref, planeGeom])

    return (
        <mesh ref={ref} castShadow={false} receiveShadow={false}>
            <planeBufferGeometry args={[size, size, controls.resolution, controls.resolution]} ref={planeGeom} />
            {/* <shaderMaterial
                uniforms={CustomMaterial.uniforms}
                vertexShader={CustomMaterial.vertexShader}
                fragmentShader={CustomMaterial.fragmentShader}
            /> */}
            {/* <meshBasicMaterial vertexColors={true} /> */}
            <meshLambertMaterial color={'white'} side={THREE.DoubleSide} />
        </mesh>
    )
}
