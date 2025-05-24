import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { useEffect } from "react";
import { DemoScene } from "./scenes/demo";
// import { HillScene } from "./scenes/hill";
import { WaterfallScene } from "./scenes/waterfall";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Tale of Moomoo",
  type: Phaser.AUTO,
  scene: [
    // HillScene,
    WaterfallScene,
    DemoScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%",
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

  return (
    <div id="game">
      <div className="text-wrapper">
        <div className="text-box">
          <div className="text-content">Hello</div>
        </div>
      </div>
      <div id="hud"></div>
      <div id="debug"></div>
    </div>
  );
}
