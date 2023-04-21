import {
    ThreeElements,
    extend,
    useFrame,
    useLoader,
    useThree,
} from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Water } from 'three-stdlib';

extend({ Water });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            water: ThreeElements['mesh'];
        }
    }
}

interface WaterPlaneProps {
    size: number;
    props?: ThreeElements['mesh'];
}

export const WaterPlane = ({ size, props }: WaterPlaneProps) => {
    const ref = useRef<THREE.Mesh>(null!);
    const gl = useThree((state) => state.gl);
    const waterNormals = useLoader(
        THREE.TextureLoader,
        '/normals/waterNormalMap.jpeg'
    );
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    const waterGeometrySize = size * 20;
    const waterGeometry = useMemo(
        () => new THREE.PlaneGeometry(waterGeometrySize, waterGeometrySize),
        []
    );
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: false,
            format: gl.outputEncoding,
        }),
        [waterNormals]
    );
    useFrame(
        (state, delta) =>
            ((
                ref.current.material as THREE.ShaderMaterial
            ).uniforms.time.value += delta)
    );
    return (
        <water
            ref={ref}
            args={[waterGeometry, config]}
            rotation-x={-Math.PI / 2}
            {...props}
        />
    );
};
