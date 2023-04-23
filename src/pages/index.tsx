import Glass from "@/components/Glass";
import Grass from "@/components/Grass";
import HeightMap from "@/components/HeightMap";
import { WaterPlane } from "@/components/WaterPlane";
import {
  Cloud,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  Sky,
  Sphere,
} from "@react-three/drei";
import { Suspense, createRef, useState } from "react";

export interface MainProps {}

export const DEFAULT_CONTROL_VALUES = {
  seed: "React3-Environment-Test",
  resolution: {
    value: 40,
    min: 1,
    max: 100,
    step: 1,
  },
  maxHeight: {
    value: 3.5,
    min: 1,
    max: 5,
    step: 0.1,
  },
  frequency: {
    value: 3,
    min: 0.1,
    max: 8,
    step: 0.1,
  },
  exponent: {
    value: 3,
    min: 1,
    max: 4.5,
    step: 0.25,
  },
  octaves: {
    value: 2,
    min: 1,
    max: 6,
    step: 1,
  },
};

const Main = (props: MainProps) => {
  const cameraRef = createRef();

  const [fov] = useState(75);

  const mapSize = 10;

  return (
    <>
      <Suspense fallback={null}>
        <Sky />
        {/* <Cloud
                position={[0, 100, 0]}
                color={'#ffffff'}
                opacity={1}
                speed={0.4}
                width={50}
                depth={0.3}
                segments={300}
            /> */}
        {/* <Glass
                position={[0, 10, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[1, 1, 1]}
            /> */}
        {/* <Grass /> */}
        <HeightMap size={mapSize} config={DEFAULT_CONTROL_VALUES} />
        <WaterPlane
          size={mapSize}
          props={{
            position: [0, 3, 0],
          }}
        />
      </Suspense>

      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        fov={fov}
        near={0.1}
        far={1000}
        position={[0, 0, 10]}
      />

      <OrbitControls enableZoom={true} enableRotate={true} />
    </>
  );
};

export default Main;
