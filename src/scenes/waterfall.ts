import { GameScene } from "../core/game-scene";
import type { Interactable } from "../core/utils";
import { getInteractionMap } from "../core/utils";

type WaterfallState = {
  isSolved: boolean;
};

const interactables: Interactable<GameScene<WaterfallState>>[] = [];

const interactionMap = getInteractionMap(interactables);

export class WaterfallScene extends GameScene<WaterfallState> {
  constructor() {
    super({
      key: "WaterfallScene",
      tileMap: {
        path: "../assets/tiled/maps/waterfall.json",
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
      startPosition: { x: 30, y: 70 },
      interactionMap,
      initialState: {
        isSolved: false,
      },
    });
  }
}
