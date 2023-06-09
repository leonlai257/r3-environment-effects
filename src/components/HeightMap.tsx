import { heightMapFragment, heightMapVertex } from '@/shaders/heightMapShader'
import { ControlConfigType } from '@/types'
import { useControls } from 'leva'
import Perlin from 'perlin.js'
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BufferAttribute } from 'three'
import useNoisyVertices from '../hooks/useNoisyVertices'

function remap(x: number, [low1, high1]: number[], [low2, high2]: number[]) {
    return low2 + ((x - low1) * (high2 - low2)) / (high1 - low1)
}

const computeGrassDensity = (geometry: THREE.BufferGeometry) => {
    const position = geometry.getAttribute('position') as BufferAttribute
    const density = []
    const normalVector = new THREE.Vector3()
    const up = new THREE.Vector3(0, 0, 1)
    for (let i = 0; i < position.count; i++) {
        // Get the vertex
        const n = new THREE.Vector3()
        n.fromBufferAttribute(position, i)
        normalVector.set(n.x, n.y, n.z)

        // Get the up vector of the current vertex
        const dot = normalVector.dot(up)

        // Remap and push the density value based on a threshold
        const value = dot > 5.2 ? remap(dot, [0.1, 10], [0, 10]) : 0
        density.push(value)
    }
    return new THREE.Float32BufferAttribute(density, 1)
}

const computeFlowerDensity = (geometry: THREE.BufferGeometry) => {
    const position = geometry.getAttribute('position') as BufferAttribute
    const density = []
    const normalVector = new THREE.Vector3()
    const up = new THREE.Vector3(0, 0, 1)
    for (let i = 0; i < position.count; i++) {
        // Get the vertex
        const n = new THREE.Vector3()
        n.fromBufferAttribute(position, i)
        normalVector.set(n.x, n.y, n.z)

        // Get the up vector of the current vertex
        const dot = normalVector.dot(up)

        // Remap and push the density value based on a threshold
        const value = dot > 5.2 ? remap(dot, [0.1, 10], [0, 10]) : 0
        density.push(value)
    }
    return new THREE.Float32BufferAttribute(density, 1)
}

interface HeightMapProps {
    config: ControlConfigType
    size?: number
}

// Height map component, which convert noises based on a config to generate vertices and
export const HeightMap = forwardRef((props: HeightMapProps, ref?: ForwardedRef<THREE.Mesh>) => {
    const { config, size = 100 } = props
    const controls = useControls(config)

    const planeGeom = useRef<THREE.BufferGeometry>(null!)

    // Generate the gradient texture based on these stops and colors (the array length must be the same)
    const stops = [0, 0.4, 1]
    const colors = ['#fddde6', '#FFC0CB', '#ddddff']
    const gradientSize = 1024

    // create a 1D gradient canvas
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = gradientSize
    const context = canvas.getContext('2d')
    const gradient = context.createLinearGradient(0, 0, 0, gradientSize)
    let i = stops.length
    while (i--) {
        gradient.addColorStop(stops[i], colors[i])
    }
    context.fillStyle = gradient
    context.fillRect(0, 0, 16, gradientSize)

    // create a 1D gradient texture from the canvas
    const gradientTexture = new THREE.CanvasTexture(canvas)

    // Generate a gradient for texture or you pass your own gradient here
    // const gradientTexture = useLoader(THREE.TextureLoader, '/heightmap/biomeGradientMap.png')
    const GradientMaterial = new THREE.ShaderMaterial({
        uniforms: {
            colorTexture: {
                value: gradientTexture,
            },
            limits: {
                value: 0.4,
            },
            height: {
                value: controls.maxHeight || 3.5,
            },
        },
        vertexShader: heightMapVertex,
        fragmentShader: heightMapFragment,
    })

    // For each time the config is updated, the vertices will be recomputed, as well as the normals and the sampler density
    let vertices = useNoisyVertices(controls, {
        ...controls,
    })
    useEffect(() => {
        if (!planeGeom.current) {
            return
        }
        planeGeom.current.setAttribute('position', new BufferAttribute(vertices, 3))
        planeGeom.current.attributes.position.needsUpdate = true
        planeGeom.current.computeVertexNormals()
        planeGeom.current.setAttribute('grassDensity', computeGrassDensity(planeGeom.current))
        planeGeom.current.setAttribute('flowerDensity', computeFlowerDensity(planeGeom.current))
    }, [vertices, ref, planeGeom])

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <planeBufferGeometry args={[size, size, controls.resolution, controls.resolution]} ref={planeGeom}></planeBufferGeometry>
            <shaderMaterial
                uniforms={GradientMaterial.uniforms}
                vertexShader={GradientMaterial.vertexShader}
                fragmentShader={GradientMaterial.fragmentShader}
            />
        </mesh>
    )
})
