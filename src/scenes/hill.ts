import { GameScene } from "../core/game-scene";

export class HillScene extends GameScene {
  constructor() {
    super({
      key: "HillScene",
      tileMap: {
        path: "../assets/tiled/maps/hill.json",
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
      startPosition: { x: 27, y: 57 },
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
