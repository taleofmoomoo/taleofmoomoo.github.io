import { Direction, GridEngine } from "grid-engine";
import * as Phaser from "phaser";
import type {
  TileMap,
  MusicConfig,
  PositionDict,
  InteractionMap,
  Cell,
} from "./utils";
import {
  PLAYER_ID,
  PLAYER_SCALE,
  SCALE,
  PLAYER_SPRITE_INDEX,
  PLAYER_SPRITE_SHEET,
  PLAYER_SPRITE_SIZE,
  SECOND_MS,
  getLayerPropertyValue,
  hashCell,
} from "./utils";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class GameScene<T> extends Phaser.Scene {
  gridEngine!: GridEngine;
  tileMap!: TileMap;
  music?: MusicConfig;
  startCharLayer: string;
  startPosition: PositionDict = { x: 0, y: 0 };
  interactionMap: InteractionMap<GameScene<T>> = {};
  isInteracting: boolean = false;

  parentEl!: HTMLElement;
  textWrapper!: HTMLElement;
  textContent!: HTMLElement;
  hudEl!: HTMLElement;
  debugEl!: HTMLElement;

  public state: T;

  constructor(config: {
    key: string;
    music?: MusicConfig;
    tileMap: TileMap;
    startCharLayer: string;
    startPosition: PositionDict;
    interactionMap: InteractionMap<GameScene<T>>;
    initialState: T;
  }) {
    super({
      key: config.key,
      active: false,
      visible: false,
    });
    this.music = config.music;
    this.tileMap = config.tileMap;
    this.startCharLayer = config.startCharLayer;
    this.startPosition = config.startPosition;
    this.interactionMap = config.interactionMap;
    this.state = config.initialState;
  }

  create() {
    const scene = this;
    scene.parentEl = document.getElementById("game")!;
    scene.textWrapper = scene.parentEl.querySelector(".text-wrapper")!;
    scene.textContent = scene.textWrapper.querySelector(".text-content")!;
    scene.hudEl = scene.parentEl.querySelector("#hud")!;
    scene.debugEl = scene.parentEl.querySelector("#debug")!;

    const tileData = this.tileMap;
    const tileMap = this.make.tilemap({ key: tileData.path });
    tileData.tileSets.forEach((ts) =>
      tileMap.addTilesetImage(ts.name, ts.path)
    );
    const tileSetNames = tileData.tileSets.map((ts) => ts.name);

    tileMap.layers.forEach((layerData, i) => {
      const layer = tileMap.createLayer(i, tileSetNames, 0, 0);
      if (layer) {
        layer.scale = SCALE;
        const shouldHide =
          getLayerPropertyValue(layerData, "shouldHide", "bool") ?? false;
        layer.setVisible(!shouldHide);
      }
    });

    const playerSprite = this.add.sprite(0, 0, PLAYER_ID);
    playerSprite.scale = PLAYER_SCALE;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    const gridEngineConfig = {
      characters: [
        {
          id: PLAYER_ID,
          sprite: playerSprite,
          walkingAnimationMapping: PLAYER_SPRITE_INDEX,
          startPosition: this.startPosition,
          charLayer: this.startCharLayer,
        },
      ],
    };
    this.gridEngine.create(tileMap, gridEngineConfig);

    this.game.sound.removeAll();
    if (this.music) {
      const backgroundMusic = this.game.sound.add(this.music.path);
      backgroundMusic.setLoop(true);
      backgroundMusic.setVolume(0.5);
      backgroundMusic.play();
    }

    this.createThen();
  }

  createThen() {}
  preloadThen() {}
  updateThen() {}

  async maybeDoActionAt(cell: Cell) {
    const scene = this;
    const cellHash = hashCell(cell);
    const doAction = scene.interactionMap?.[cellHash];
    if (doAction && !scene.isInteracting) {
      scene.isInteracting = true;
      await doAction(scene);
      await sleep(SECOND_MS);
      scene.isInteracting = false;
    }
  }

  debugPosition() {
    const current = this.gridEngine.getPosition(PLAYER_ID);
    this.debugEl.innerText = `${current.x}, ${current.y}`;
    this.updateThen();
  }

  public update() {
    const cursors = this?.input?.keyboard?.createCursorKeys();
    if (!cursors) return;
    if (cursors.left.isDown) {
      this.gridEngine.move(PLAYER_ID, Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridEngine.move(PLAYER_ID, Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine.move(PLAYER_ID, Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine.move(PLAYER_ID, Direction.DOWN);
    }

    if (cursors.space.isDown) {
      const pos = this.gridEngine.getFacingPosition(PLAYER_ID);
      this.maybeDoActionAt(pos);
    }

    this.debugPosition();
  }

  preload() {
    const scene = this;
    const tileData = scene.tileMap;
    tileData.tileSets.forEach((ts) => scene.load.image(ts.path, ts.path));
    scene.load.tilemapTiledJSON(tileData.path, tileData.path);
    scene.load.spritesheet(PLAYER_ID, PLAYER_SPRITE_SHEET, PLAYER_SPRITE_SIZE);
    if (scene.music) {
      scene.load.audio(scene.music.path, scene.music.path);
    }
    scene.preloadThen();
  }

  async showText(text: string, ms: number) {
    const scene = this;
    if (!scene.textWrapper || !scene.textContent) return;
    scene.scene.pause();
    scene.textWrapper.style.display = "block";
    scene.textContent.innerText = text;
    await sleep(ms);
    scene.textWrapper.style.display = "none";
    scene.textContent.innerText = "";
    scene.scene.resume();
  }

  writeToHud(text: string) {
    if (!this.hudEl) return;
    this.hudEl.style.display = "block";
    this.hudEl.innerText = text;
  }

  hideHud() {
    if (!this.hudEl) return;
    this.hudEl.innerText = "";
    this.hudEl.style.display = "none";
  }

  async writeToHudForMs(text: string, ms: number) {
    this.writeToHud(text);
    await sleep(ms);
    this.hideHud();
  }
}
