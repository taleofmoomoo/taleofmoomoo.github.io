import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { useEffect } from "react";
import { DemoScene } from "./scenes/demo";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Tale of Moomoo",
  type: Phaser.AUTO,
  scene: [DemoScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 2400,
      height: 1800,
    },
  },
  render: {
    antialias: false,
  },
  fps: {
    smoothStep: false,
  },
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
};

export function GameComponent() {
  useEffect(() => {
    const game = new Phaser.Game(gameConfig);
    return () => game.destroy(true);
  }, []);

  return <div id="game" />;
}
