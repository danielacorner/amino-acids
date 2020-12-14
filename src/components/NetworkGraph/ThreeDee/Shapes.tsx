import React from "react";
import { useControl } from "react-three-gui";

export function Sphere({ position }) {
  return (
    <mesh visible userData={{ test: "hello" }} position={position} castShadow>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}

export function Light({ brightness, color }) {
  return (
    <rectAreaLight
      width={3}
      height={3}
      color={color}
      intensity={brightness}
      position={[-2, 0, 5]}
      lookAt={[0, 0, 0] as any}
      // penumbra={1}
      castShadow
    />
  );
}

// Lights
export function KeyLight({ brightness, color }) {
  // const positionX = useControl("keylight position x", {
  //   type: "number",
  //   min: -10,
  //   max: 10,
  // });
  // const positionY = useControl("keylight position y", {
  //   type: "number",
  //   min: -10,
  //   max: 10,
  // });
  // const positionZ = useControl("keylight position z", {
  //   type: "number",
  //   min: -10,
  //   max: 10,
  // });

  return (
    <rectAreaLight
      {...{
        width: 2,
        height: 2,
        color,
        intensity: brightness,
        position: [0, 0, 0],
        // position: [positionX, positionY, positionZ],
      }}
      lookAt={[0, 0, 0] as any}
      // penumbra={1}
      castShadow
    />
  );
}
export function FillLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={3}
      height={3}
      intensity={brightness}
      color={color}
      position={[2, 1, 4]}
      lookAt={[0, 0, 0] as any}
      // penumbra={2}
      castShadow
    />
  );
}
export function RimLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={2}
      height={2}
      intensity={brightness}
      color={color}
      position={[1, 4, -2]}
      rotation={[0, 180, 0]}
      castShadow
    />
  );
}

export function SunLight() {
  const brightness = useControl("brightness", {
    type: "number",
    min: 4,
    max: 2000,
    value: 1000,
  });
  const positionY = useControl("posY", {
    type: "number",
    min: -30,
    max: 30,
    value: 12,
  });
  const positionX = useControl("posX", {
    type: "number",
    min: -30,
    max: 30,
    value: -10,
  });
  const positionZ = useControl("posZ", {
    type: "number",
    min: -30,
    max: 30,
    value: -2.6,
  });

  return (
    <rectAreaLight
      width={2}
      height={2}
      intensity={brightness}
      color={"white"}
      position={[positionX, positionY, positionZ]}
      rotation={[0, 0, 0]}
      castShadow
    />
  );
}

// Geometry
export function GroundPlane() {
  return (
    <mesh receiveShadow rotation={[5, 0, 0]} position={[0, -1, 0]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}
export function BackDrop() {
  return (
    <mesh receiveShadow position={[0, -1, -5]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}
