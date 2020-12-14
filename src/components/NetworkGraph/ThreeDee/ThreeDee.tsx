import React, { useRef, useState } from "react";
import { useWindowSize } from "utils/hooks";
import { Controls, useControl } from "react-three-gui";
import { BackDrop, FillLight, KeyLight, Sphere, SunLight } from "./Shapes";
import MemoryStats from "react-memorystats";
import { OrbitControls } from "@react-three/drei";
import SarsCov2 from "./GLTFs/SarsCov2";

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef(null as any);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => {
  //   mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  // });

  const count = useControl("Things", {
    type: "number",
    min: 1,
    max: 100,
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[count, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
const ThreeDee = () => {
  const windowSize = useWindowSize();

  return (
    <>
      <MemoryStats corner="topLeft" />,
      <Controls.Provider>
        <Controls.Canvas
          style={{ height: windowSize.height, width: windowSize.width }}
        >
          {/* <Light brightness={10} color={"white"} /> */}
          {/* <pointLight position={[10, 10, 10]} /> */}
          <BackDrop />
          <KeyLight brightness={5.6} color="#ffbdf4" />
          <FillLight brightness={2.6} color="#bdefff" />
          <SunLight />
          {/* <RimLight brightness={54} color="#fff" /> */}
          {/* <GroundPlane /> */}
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
          <ManySpheres />
          <SarsCov2 />
        </Controls.Canvas>
        <Controls />
        <OrbitControls />
      </Controls.Provider>
    </>
  );
};

export default ThreeDee;

// * according to this, 1000 spheres can be on the screen at a time without impacting frame rate (on my computer)
function ManySpheres() {
  const numSpheres = useControl("numSpheres", {
    type: "number",
    min: 1,
    max: 5000,
    value: 1,
  });
  console.log("🌟🚨 ~ ManySpheres ~ numSpheres", numSpheres);
  return (
    <>
      {[...new Array(Math.round(numSpheres))].map((_, idx) => (
        <Sphere
          position={[
            (idx - (numSpheres - 1) / 2) / numSpheres ** 0.7,
            randBetween(0.5, -0.5),
            0,
          ]}
        />
      ))}
    </>
  );
}

function randBetween(min: number, max: number): number {
  // randBetween(0,2)
  // randBetween(-2,2)
  return Math.random() * (max - min) + min;
}

useGLTF.preload("/src/assets/models/SarsCov2/scene.gltf");
