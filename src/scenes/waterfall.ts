import { Direction } from "grid-engine";
import { GameScene } from "../core/game-scene";
import type { Cell, Interactable } from "../core/utils";
import {
  getDirection,
  getInteractionMap,
  interactIfNotStarted,
  makeRows,
  PLAYER_ID,
} from "../core/utils";

type WaterfallState = {
  slidingDirection: Direction;
  nextSlidingDirection: Direction;
};

function isWaterCurrent(cell: Cell): boolean {
  return cell.x >= 16 && cell.x <= 45 && cell.y >= 24 && cell.y <= 53;
}

const doWaterfall = interactIfNotStarted<GameScene<WaterfallState>>(
  async (scene) => {
    await scene.showText("You reached the waterfall.", 3000);
    // scene.scene.start("DemoScene");
    window.open("/assets/video/portal.mp4", "_blank");
  }
);

const interactables: Interactable<GameScene<WaterfallState>>[] = [
  {
    cells: makeRows([{ leftEdge: { x: 29, y: 23 }, length: 4 }]),
    action: doWaterfall,
  },
];

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
      music: {
        path: "../assets/audio/a-flock-of-bubbles-looping.mp3",
      },
      startCharLayer: "Collisions",
      startPosition: { x: 30, y: 70 },
      // For testing the end of the puzzle.
      // startPosition: { x: 29, y: 24 },
      interactionMap,
      initialState: {
        slidingDirection: Direction.NONE,
        nextSlidingDirection: Direction.NONE,
      },
    });
  }

  createThen() {
    const scene = this;
    setTimeout(() => {
      scene.showText("Where water flows long, the current is strong.", 3000);
    }, 3000);

    function startSliding(direction: Direction) {
      scene.state.nextSlidingDirection = direction;
    }

    function stopSliding() {
      if (scene.state.slidingDirection !== Direction.NONE) {
        scene.state.slidingDirection = Direction.NONE;
        scene.gridEngine.setWalkingAnimationMapping(PLAYER_ID, 0);
      }
    }

    scene.gridEngine
      .positionChangeStarted()
      .subscribe(({ enterTile, exitTile }) => {
        if (isWaterCurrent(enterTile)) {
          startSliding(getDirection(enterTile, exitTile));
        } else {
          stopSliding();
        }
      });
    scene.gridEngine.movementStopped().subscribe(() => {
      stopSliding();
    });
  }

  update() {
    if (this.state.nextSlidingDirection !== Direction.NONE) {
      this.state.slidingDirection = this.state.nextSlidingDirection;
      this.state.nextSlidingDirection = Direction.NONE;
      this.gridEngine.setWalkingAnimationMapping(PLAYER_ID, undefined);
    }

    if (this.state.slidingDirection !== Direction.NONE) {
      this.gridEngine.move(PLAYER_ID, this.state.slidingDirection);
      this.debugPosition();
      return;
    }

    super.update();
  }
}
