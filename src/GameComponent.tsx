import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { useEffect } from "react";
import { DemoScene } from "./scenes/demo";
import { HillScene } from "./scenes/hill";
import { WaterfallScene } from "./scenes/waterfall";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Tale of Moomoo",
  type: Phaser.AUTO,
  scene: [HillScene, WaterfallScene, DemoScene],
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
      <div id="attribution">
        <p>
          <span>Tilesets by </span>
          <a href="https://zaebucca.itch.io/adventure-begins" target="_blank">
            Zaebucca
          </a>
          <br />
          <span>Sprites adapted from </span>
          <a href="https://joao9396.itch.io/pixel-cats-pack" target="_blank">
            Joao9396
          </a>
          <br />
          <span>Music by Eric Matyas, </span>
          <a href="https://soundimage.org" target="_blank">
            soundimage.com
          </a>
        </p>
      </div>
    </div>
  );
}
