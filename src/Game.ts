import * as PIXI from "pixi.js";
import { SlotMachine } from "./slots/SlotMachine";
import { AssetLoader } from "./utils/AssetLoader";
import { UI } from "./ui/UI";
import { GAME_CONFIG } from "./config/GameConfig";
import { Logger, GameError } from "./utils/Logger";
import { eventBus, GameEvent } from "./events/EventBus";

export class Game {
  private app: PIXI.Application;
  private slotMachine!: SlotMachine;
  private ui!: UI;
  private assetLoader: AssetLoader;

  constructor() {
    try {
      this.app = new PIXI.Application({
        width: GAME_CONFIG.DISPLAY.WIDTH,
        height: GAME_CONFIG.DISPLAY.HEIGHT,
        backgroundColor: GAME_CONFIG.DISPLAY.BACKGROUND_COLOR,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      this.initializeContainer();
      this.assetLoader = new AssetLoader();
      this.setupEventListeners();
      this.resize();
    } catch (error) {
      throw new GameError(
        "Failed to initialize game",
        "Game.constructor",
        error as Error,
      );
    }
  }

  private initializeContainer(): void {
    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) {
      throw new GameError(
        "Game container not found",
        "Game.initializeContainer",
      );
    }
    gameContainer.appendChild(this.app.view as HTMLCanvasElement);
  }

  private setupEventListeners(): void {
    this.init = this.init.bind(this);
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  }

  public async init(): Promise<void> {
    try {
      Logger.info("Initializing game...");

      await this.assetLoader.loadAssets();
      Logger.info("Assets loaded successfully");

      this.slotMachine = new SlotMachine(this.app);
      this.app.stage.addChild(this.slotMachine.container);

      this.ui = new UI(this.app);
      this.app.stage.addChild(this.ui.container);

      this.app.ticker.add(this.update.bind(this));

      eventBus.emit({ type: "GAME_INITIALIZED" });
      Logger.info("Game initialized successfully");
    } catch (error) {
      Logger.error("Error initializing game", error);
      throw new GameError(
        "Game initialization failed",
        "Game.init",
        error as Error,
      );
    }
  }

  private update(delta: number): void {
    if (this.slotMachine) {
      this.slotMachine.update(delta);
    }
  }

  private resize(): void {
    if (!this.app?.renderer) {
      Logger.warn("Cannot resize: app or renderer not available");
      return;
    }

    const gameContainer = document.getElementById("game-container");
    if (!gameContainer) {
      Logger.warn("Cannot resize: game container not found");
      return;
    }

    const w = gameContainer.clientWidth;
    const h = gameContainer.clientHeight;

    const scale = Math.min(
      w / GAME_CONFIG.DISPLAY.WIDTH,
      h / GAME_CONFIG.DISPLAY.HEIGHT,
    );

    this.app.stage.scale.set(scale);
    this.app.renderer.resize(w, h);
    this.app.stage.position.set(w / 2, h / 2);
    this.app.stage.pivot.set(
      GAME_CONFIG.DISPLAY.WIDTH / 2,
      GAME_CONFIG.DISPLAY.HEIGHT / 2,
    );
  }
}
