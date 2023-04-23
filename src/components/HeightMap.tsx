import React, { useEffect, useMemo, useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import useNoisyVertices from "../hooks/useNoisyVertices";
import { BufferAttribute } from "three";
import useFlipPlaneOnX from "../hooks/useFlipPlaneOnX";
import Grass, { getAttributeData } from "./Grass";
import { useLoader } from "@react-three/fiber";

interface HeightMapProps {
  config: any;
  size?: number;
}

const HeightMap: React.FC<HeightMapProps> = ({ size = 200, config }) => {
  const controls = useControls(config);
  const planeMesh = useRef<THREE.Mesh>(null);
  const planeGeom = useRef<THREE.PlaneGeometry>(null);
  useFlipPlaneOnX(planeMesh);

  const vertices = useNoisyVertices(controls, {
    ...controls,
  });

  const grassRef = useRef<THREE.InstancedBufferGeometry>(null!);

  useEffect(() => {
    if (!planeMesh.current || !planeGeom.current) {
      return;
    }
    planeGeom.current.setAttribute(
      "position",
      new BufferAttribute(vertices, 3)
    );
    planeGeom.current.attributes.position.needsUpdate = true;
    planeGeom.current.computeVertexNormals();
  }, [vertices, planeMesh, planeGeom]);

  //   const options = { bW: 0.12, bH: 1, joints: 5 };
  //   const { bW, bH, joints } = options;
  //   const materialRef = useRef<THREE.ShaderMaterial>(null!);
  //   const width = 200;
  //   const instances = 50000;
  //   const bladeDiffuse = "/textures/grassBladeDiffuse.jpg";
  //   const bladeAlpha = "/textures/grassBladeAlpha.jpg";
  //   const [texture, alphaMap] = useLoader(THREE.TextureLoader, [
  //     bladeDiffuse,
  //     bladeAlpha,
  //   ]);
  //   const attributeData = useMemo(
  //     () => getAttributeData(instances, width),
  //     [instances, width]
  //   );

  return (
    <group>
      <Grass planeGeom={planeGeom.current} />
      {/* <mesh>
        <instancedBufferGeometry ref={grassRef}>
          <instancedBufferAttribute
            attach="attributes-offset"
            args={[new Float32Array(attributeData.offsets), 3]}
          />
          <instancedBufferAttribute
            attach="attributes-orientation"
            args={[new Float32Array(attributeData.orientations), 4]}
          />
          <instancedBufferAttribute
            attach="attributes-stretch"
            args={[new Float32Array(attributeData.stretches), 1]}
          />
          <instancedBufferAttribute
            attach="attributes-halfRootAngleSin"
            args={[new Float32Array(attributeData.halfRootAngleSin), 1]}
          />
          <instancedBufferAttribute
            attach="attributes-halfRootAngleCos"
            args={[new Float32Array(attributeData.halfRootAngleCos), 1]}
          />
        </instancedBufferGeometry>
        <grassMaterial
          ref={materialRef}
          map={texture}
          alphaMap={alphaMap}
          toneMapped={false}
        />
      </mesh> */}
      <mesh ref={planeMesh} castShadow={false} receiveShadow={false}>
        <planeGeometry
          args={[size, size, controls.resolution, controls.resolution]}
          ref={planeGeom}
        />
        <meshLambertMaterial color={"white"} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default HeightMap;
