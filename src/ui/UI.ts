import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";
import { sound } from "../utils/sound";
import { GAME_CONFIG } from "../config/GameConfig";
import { Logger, GameError } from "../utils/Logger";
import { eventBus, GameEvent } from "../events/EventBus";

export class UI {
  public container: PIXI.Container;
  private app: PIXI.Application;
  private spinButton!: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();

    this.createSpinButton();
    this.setupEventListeners();
    this.layout();
  }

  private setupEventListeners(): void {
    eventBus.on("SPIN_STARTED", this.onSpinStarted.bind(this));
    eventBus.on("SPIN_STOPPED", this.onSpinStopped.bind(this));
  }

  private createSpinButton(): void {
    try {
      this.spinButton = new PIXI.Sprite(
        AssetLoader.getTexture("button_spin.png"),
      );

      this.spinButton.anchor.set(0.5);
      this.spinButton.interactive = true;
      this.spinButton.cursor = "pointer";

      this.spinButton.on("pointerdown", this.onSpinButtonClick.bind(this));
      this.spinButton.on("pointerover", this.onButtonOver.bind(this));
      this.spinButton.on("pointerout", this.onButtonOut.bind(this));

      this.container.addChild(this.spinButton);
    } catch (error) {
      throw new GameError(
        "Failed to create spin button",
        "UI.createSpinButton",
        error as Error,
      );
    }
  }

  public layout(): void {
    this.spinButton.x = GAME_CONFIG.DISPLAY.WIDTH / 2;
    this.spinButton.y = GAME_CONFIG.DISPLAY.HEIGHT - 55;
  }

  private onSpinButtonClick(): void {
    sound.play("Spin button");
    eventBus.emit({ type: "SPIN_REQUESTED" });
  }

  private onSpinStarted(): void {
    this.spinButton.texture = AssetLoader.getTexture(
      "button_spin_disabled.png",
    );
    this.spinButton.interactive = false;
  }

  private onSpinStopped(): void {
    this.spinButton.texture = AssetLoader.getTexture("button_spin.png");
    this.spinButton.interactive = true;
  }

  private onButtonOver(event: PIXI.FederatedPointerEvent): void {
    (event.currentTarget as PIXI.Sprite).scale.set(1.05);
  }

  private onButtonOut(event: PIXI.FederatedPointerEvent): void {
    (event.currentTarget as PIXI.Sprite).scale.set(1.0);
  }
}
