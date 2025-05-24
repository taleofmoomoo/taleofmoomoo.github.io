import { Direction } from "grid-engine";

export type PhaserSound =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;

export type PositionDict = { x: number; y: number };
export type FacingDirection = "up" | "down" | "left" | "right";

export type Cell = {
  x: number;
  y: number;
};

export type Interaction<S extends Phaser.Scene> = (scene: S) => Promise<void>;

export type Interactable<S extends Phaser.Scene> = {
  cells: Cell[];
  action: Interaction<S>;
};

export type InteractionMap<S extends Phaser.Scene> = {
  [cellHash: string]: Interaction<S>;
};

export type TileSet = {
  name: string;
  path: string;
};

export type TileMap = {
  path: string;
  tileSets: TileSet[];
};

export type MusicConfig = {
  path: string;
};

export type LayerProperty =
  | {
      name: string;
      type: "bool";
      value: boolean;
    }
  | {
      name: string;
      type: "string";
      value: string;
    };

export const PLAYER_ID = "player";
export const PLAYER_SCALE = 3;
export const PLAYER_SPRITE_SHEET = "../assets/tiled/sprites/tuxedo-cat.png";
// Index in the sprite sheet file, left to right, top to bottom, zero-indexed.
export const PLAYER_SPRITE_INDEX = 0;
export const PLAYER_SPRITE_SIZE = {
  frameWidth: 32,
  frameHeight: 32,
};

export const TILE_SIZE_PX = 16;
export const SCALE = 4;
export const TILE_SIZE_SCALED = TILE_SIZE_PX * SCALE;

export const FONT = "Arial";
export const TEXT_SIZE = 24;
export const TEXT_PAD = 8;

export const SECOND_MS = 1000;

export function Facing(
  x: number,
  y: number,
  direction: FacingDirection
): string {
  return `${x}_${y}_${direction}`;
}

export function tileToPixels(t: number): number {
  return t * TILE_SIZE_SCALED;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function renderText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: string
): Phaser.GameObjects.Text {
  const tX = TEXT_PAD + tileToPixels(x);
  const tY = TEXT_PAD + tileToPixels(y);
  const textObject = scene.add.text(tX, tY, text, {
    fontFamily: FONT,
    fontSize: TEXT_SIZE,
    color: color,
  });
  return textObject;
}

export function hashCell(cell: Cell): string {
  return `${cell.x}-${cell.y}`;
}

export function getInteractionMap<S extends Phaser.Scene>(
  interactables: Interactable<S>[]
): InteractionMap<S> {
  return interactables.reduce(
    (agg, val) => ({
      ...agg,
      ...val.cells.reduce(
        (cellMap, cell) => ({
          ...cellMap,
          [hashCell(cell)]: val.action,
        }),
        {}
      ),
    }),
    {}
  );
}

export function interactIfNotStarted<S extends Phaser.Scene>(
  doInteract: Interaction<S>
): Interaction<S> {
  let isStarted = false;
  return async (scene: S) => {
    if (isStarted) return;
    isStarted = true;
    await doInteract(scene);
    isStarted = false;
  };
}

export function getLayerPropertyValue(
  layerData: Phaser.Tilemaps.LayerData,
  name: string,
  type: LayerProperty["type"]
): LayerProperty["value"] | null {
  const properties = layerData.properties as LayerProperty[];
  const property = properties.find((p) => p.name === name && p.type === type);
  return property?.value ?? null;
}

export function getManhattanDistance(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function plural(
  count: number,
  singular: string,
  plural: string
): string {
  return count === 1 ? singular : plural;
}

export function getDirection(fromPos: Cell, toPos: Cell): Direction {
  if (fromPos.x < toPos.x) {
    return Direction.LEFT;
  } else if (fromPos.x > toPos.x) {
    return Direction.RIGHT;
  } else if (fromPos.y < toPos.y) {
    return Direction.UP;
  } else if (fromPos.y > toPos.y) {
    return Direction.DOWN;
  }
  return Direction.NONE;
}

export function makeRows(lines: { leftEdge: Cell; length: number }[]): Cell[] {
  return lines.flatMap(({ leftEdge, length }) =>
    Array.from({ length }, (_, i) => ({
      x: leftEdge.x + i,
      y: leftEdge.y,
    }))
  );
}
