import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

// Blur Transition Effect, it uses blend shader to blend the current frame with the previous frame to create a motion blur effect
const BlurTransition = () => {
    const { scene, gl, size, camera } = useThree()
    const composer = useMemo(() => {
        const composer = new EffectComposer(gl)

        // render pass
        const renderPass = new RenderPass(scene, camera)

        // save pass
        const parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
        }
        const savePass = new SavePass(new THREE.WebGLRenderTarget(size.width, size.height, parameters))

        // blend pass
        const blendPass = new ShaderPass(BlendShader, 'tDiffuse1')
        blendPass.uniforms['tDiffuse2'].value = savePass.renderTarget.texture
        blendPass.uniforms['mixRatio'].value = 0.4

        // output pass
        const outputPass = new ShaderPass(CopyShader)
        composer.addPass(renderPass)
        composer.addPass(blendPass)
        composer.addPass(savePass)
        composer.addPass(outputPass)

        return composer
    }, [camera, scene, gl, size])
    useEffect(() => void composer.setSize(size.width, size.height), [size, composer])
    useFrame(() => {
        composer.render()
    }, 1)
    return null
}

export default BlurTransition
