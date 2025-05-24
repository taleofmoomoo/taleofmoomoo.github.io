import { GameScene } from "../core/game-scene";
import type { Cell, Interactable } from "../core/utils";
import { getInteractionMap, interactIfNotStarted } from "../core/utils";

function makeCat(topLeft: Cell): Cell[] {
  const { x, y } = topLeft;
  return [
    { x, y },
    { x: x + 1, y },
  ];
}

const doChatWithCat = interactIfNotStarted<GameScene>(async (scene) => {
  scene.showText("Hello, cat!", 3000);
});

const interactables: Interactable<GameScene>[] = [
  {
    cells: makeCat({ x: 17, y: 34 }),
    action: doChatWithCat,
  },
];

const interactionMap = getInteractionMap(interactables);

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
          {
            name: "Creatures",
            path: "../assets/tiled/sprites/monsters-animals-cats.png",
          },
        ],
      },
      startCharLayer: "Collisions",
      startPosition: { x: 27, y: 57 },
      interactionMap,
    });
  }

  // preloadThen() {
  //   const scene = this;
  // }

  // createThen() {
  //   const scene = this;
  // }
}
