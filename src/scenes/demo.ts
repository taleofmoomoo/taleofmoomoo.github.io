import { GameScene } from "../core/game-scene";

export class DemoScene extends GameScene {
  constructor() {
    super({
      key: "DemoScene",
      tileMap: {
        path: "../assets/tiled/maps/demo.json",
        tileSets: [
          {
            name: "Collisions",
            path: "../assets/tiled/tiles/collisions.png",
          },
          {
            name: "Adventure",
            path: "../assets/tiled/tiles/adventure-day.png",
          },
          {
            name: "Water",
            path: "../assets/tiled/tiles/water-day-1.png",
          },
        ],
      },
      startCharLayer: "Collisions",
      startPosition: { x: 7, y: 12 },
      sceneInteractionMap: {},
    });
  }

  // preloadThen() {
  //   const scene = this;
  // }

  // createThen() {
  //   const scene = this;
  // }
}
