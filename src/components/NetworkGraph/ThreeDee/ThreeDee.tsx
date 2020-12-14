import React, { useRef, useState } from "react";
import { useWindowSize } from "utils/hooks";
import { Controls, useControl } from "react-three-gui";
import { BackDrop, FillLight, KeyLight, RimLight, SunLight } from "./Shapes";

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
      </Controls.Canvas>
      <Controls />
    </Controls.Provider>
  );
};

export default ThreeDee;
