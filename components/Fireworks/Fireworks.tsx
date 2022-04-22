import React from "react";
import { Fireworks as ReactFireworks } from "fireworks-js/dist/react";


export default function Fireworks() {

  const options = {
    hue: {
      min: 0,
      max: 345
    },
    delay: {
      min: 1,
      max: 5
    },
    rocketsPoint: 50,
    speed: 1,
    acceleration: 1,
    friction: 0.96,
    gravity: 1,
    particles: 100,
    trace: 1,
    explosion: 1,
    autoresize: true,
    brightness: {
      min: 50,
      max: 80,
      decay: {
        min: 0.015,
        max: 0.03
      }
    },
    boundaries: {
      visible: false
    },
    mouse: {
      click: true,
      move: false,
      max: 1
    }
  }

  return (
    <ReactFireworks className="fireworks" style={{
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      position: "fixed",
      background: "transparent",
      zIndex: 10,
    }} enabled options={options}>
      <div />
    </ReactFireworks>
  )
}
