import { GameScene } from "../core/game-scene";
import type { Cell, Interactable } from "../core/utils";
import {
  getInteractionMap,
  getManhattanDistance,
  interactIfNotStarted,
  makeRows,
  PLAYER_ID,
  plural,
} from "../core/utils";

type HillState = {
  isSolved: boolean;
  isWalking: boolean;
  farthestPoint: Cell;
};

function makeTwoByOneAt(topLeft: Cell): Cell[] {
  const { x, y } = topLeft;
  return [
    { x, y },
    { x: x + 1, y },
  ];
}

const CAT_RIGHT_CELL = { x: 18, y: 34 };
const BIG_WALK_TARGET_DISTANCE = 27;

const doChatWithCat = interactIfNotStarted<GameScene<HillState>>(
  async (scene) => {
    const { isWalking, isSolved } = scene.state;
    if (isSolved) {
      await scene.showText("Remember: FRIENDSHIP is the key...", 3000);
      await scene.showText("The path home is through the cave...", 3000);
      await scene.showText("Go to the cliff. Take a leap of faith.", 3000);
      return;
    }

    if (!isWalking) {
      await scene.showText(
        "If you want to go home, FRIENDSHIP is the key...",
        3000
      );
      await scene.showText("Go for a BIG WALK and come back to me.", 3000);
      scene.state.isWalking = true;
      scene.state.farthestPoint = CAT_RIGHT_CELL;
      return;
    }

    const distanceWalked = getManhattanDistance(
      CAT_RIGHT_CELL,
      scene.state.farthestPoint
    );

    if (distanceWalked === BIG_WALK_TARGET_DISTANCE) {
      await scene.showText("Now THAT is what I call a big walk! ...", 3000);
      await scene.showText("The path home is through the cave...", 3000);
      await scene.showText("Go to the cliff. Take a leap of faith.", 3000);
      scene.hideHud();
      scene.state.farthestPoint = CAT_RIGHT_CELL;
      scene.state.isWalking = false;
      scene.state.isSolved = true;
      return;
    }

    const judgement =
      distanceWalked < BIG_WALK_TARGET_DISTANCE
        ? "That's not very far... Purr."
        : "That's far too far. Meow!";
    const steps = plural(distanceWalked, "step", "steps");
    await scene.showText(`So you walked ${distanceWalked} ${steps}? ...`, 3000);
    await scene.showText(judgement, 3000);
    scene.hideHud();
    scene.state.farthestPoint = CAT_RIGHT_CELL;
  }
);

const doChatWithRock = interactIfNotStarted<GameScene<HillState>>(
  async (scene) => {
    await scene.showText("This is a rock...", 3000);
    await scene.showText("You pet the rock.", 3000);
  }
);

const doLeapOfFaith = interactIfNotStarted<GameScene<HillState>>(
  async (scene) => {
    if (scene.state.isSolved) {
      await scene.showText("You take a leap of faith...", 3000);
      scene.scene.start("DemoScene");
    } else {
      await scene.showText("This cliff looks scary.", 3000);
    }
  }
);

const interactables: Interactable<GameScene<HillState>>[] = [
  {
    cells: makeTwoByOneAt({ x: CAT_RIGHT_CELL.x - 1, y: CAT_RIGHT_CELL.y }),
    action: doChatWithCat,
  },
  {
    cells: makeTwoByOneAt({ x: 27, y: 52 }),
    action: doChatWithRock,
  },
  {
    cells: makeRows([
      { leftEdge: { x: 29, y: 58 }, length: 3 },
      { leftEdge: { x: 28, y: 59 }, length: 5 },
      { leftEdge: { x: 24, y: 60 }, length: 21 },
    ]),
    action: doLeapOfFaith,
  },
];

const interactionMap = getInteractionMap(interactables);

export class HillScene extends GameScene<HillState> {
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
      // For testing the start of the puzzle.
      // startPosition: { x: 18, y: 35 }
      interactionMap,
      initialState: {
        isWalking: false,
        farthestPoint: CAT_RIGHT_CELL,
        isSolved: false,
      },
    });
  }

  createThen() {
    const scene = this;
    setTimeout(() => {
      scene.showText("Press space to interact with things.", 3000);
    }, 3000);
  }

  updateThen() {
    const scene = this;
    const { isWalking, farthestPoint } = scene.state;
    if (!isWalking) {
      return;
    }

    const current = scene.gridEngine.getPosition(PLAYER_ID);
    const bestDistance = getManhattanDistance(CAT_RIGHT_CELL, farthestPoint);
    const distance = getManhattanDistance(CAT_RIGHT_CELL, current);
    if (distance > bestDistance) {
      scene.state.farthestPoint = current;
      scene.writeToHud(`You walked ${distance} steps away.`);
    }
  }
}
