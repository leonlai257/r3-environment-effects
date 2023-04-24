import { useControls } from 'leva'
import React, { ForwardedRef, forwardRef, useEffect, useRef } from 'react'
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

export const HeightMap = forwardRef(({ config, size }: HeightMapProps) =>
    // ref: ForwardedRef<THREE.Mesh> = null!
    {
        var bumpTexture = new THREE.Texture()
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping
        // magnitude of normal displacement
        var bumpScale = 200.0

        var oceanTexture = new THREE.Texture()
        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping

        var sandyTexture = new THREE.Texture()
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping

        var grassTexture = new THREE.Texture()
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping

        var rockyTexture = new THREE.Texture()
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping

        var snowyTexture = new THREE.Texture()
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping
        const customUniforms = {
            bumpTexture: { type: 't', value: bumpTexture },
            bumpScale: { type: 'f', value: bumpScale },
            oceanTexture: { type: 't', value: oceanTexture },
            sandyTexture: { type: 't', value: sandyTexture },
            grassTexture: { type: 't', value: grassTexture },
            rockyTexture: { type: 't', value: rockyTexture },
            snowyTexture: { type: 't', value: snowyTexture },
        }
        const customMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: `uniform sampler2D bumpTexture;
            uniform float bumpScale;
            
            varying float vAmount;
            varying vec2 vUV;
            
            void main() 
            { 
              vUV = uv;
              vec4 bumpData = texture2D( bumpTexture, uv );
              
              vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
              
              // move the position along the normal
                vec3 newPosition = position + normal * bumpScale * vAmount;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            }`,
            fragmentShader: `uniform sampler2D oceanTexture;
            uniform sampler2D sandyTexture;
            uniform sampler2D grassTexture;
            uniform sampler2D rockyTexture;
            uniform sampler2D snowyTexture;
            
            varying vec2 vUV;
            
            varying float vAmount;
            
            void main() 
            {
              vec4 water = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.24, 0.26, vAmount)) * texture2D( oceanTexture, vUV * 10.0 );
              vec4 sandy = (smoothstep(0.24, 0.27, vAmount) - smoothstep(0.28, 0.31, vAmount)) * texture2D( sandyTexture, vUV * 10.0 );
              vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );
              vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );
              vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);
            }  `,
            // side: THREE.DoubleSide
        })

        const controls = useControls(config)
        const ref = useRef<THREE.Mesh>(null)
        const planeGeom = useRef<THREE.PlaneGeometry>(null!)
        useFlipPlaneOnX(ref)

        const vertices = useNoisyVertices(controls, {
            ...controls,
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
                <planeGeometry args={[size, size, controls.resolution, controls.resolution]} ref={planeGeom} />
                <shaderMaterial
                    uniforms={customUniforms}
                    vertexShader={customMaterial.vertexShader}
                    fragmentShader={customMaterial.fragmentShader}
                />
                {/* <customMaterial /> */}
                {/* <meshLambertMaterial color={'white'} side={THREE.DoubleSide} /> */}
            </mesh>
        )
    }
)
