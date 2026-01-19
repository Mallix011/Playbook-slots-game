import * as PIXI from "pixi.js";
import "pixi-spine";
import { Reel } from "./Reel";
import { sound } from "../utils/sound";
import { AssetLoader } from "../utils/AssetLoader";
import { Spine } from "pixi-spine";
import { GAME_CONFIG } from "../config/GameConfig";
import { Logger, GameError } from "../utils/Logger";
import { eventBus, GameEvent } from "../events/EventBus";

export class SlotMachine {
  public container: PIXI.Container;
  private reels: Reel[];
  private app: PIXI.Application;
  private isSpinning: boolean = false;
  private frameSpine: Spine | null = null;
  private winAnimation: Spine | null = null;
  private reelsContainer: PIXI.Container;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container();
    this.reels = [];
    this.reelsContainer = new PIXI.Container();

    this.setupEventListeners();
    this.createBackground();
    this.createReelMask();
    this.container.addChild(this.reelsContainer);
    this.createReels();
    this.initSpineAnimations();
    this.layout();
  }

  private setupEventListeners(): void {
    eventBus.on("SPIN_REQUESTED", this.spin.bind(this));
  }

  public layout() {
    this.container.x = (GAME_CONFIG.DISPLAY.WIDTH - this.width) / 2;
    this.container.y = (GAME_CONFIG.DISPLAY.HEIGHT - this.height) / 2;
  }

  private get width(): number {
    return GAME_CONFIG.REELS.SYMBOL_SIZE * GAME_CONFIG.REELS.SYMBOLS_PER_REEL;
  }

  private get height(): number {
    return (
      GAME_CONFIG.REELS.HEIGHT * GAME_CONFIG.REELS.COUNT +
      GAME_CONFIG.REELS.SPACING * (GAME_CONFIG.REELS.COUNT - 1)
    );
  }

  private createBackground(): void {
    try {
      const background = new PIXI.Graphics();
      background.beginFill(0x000000, 0.5);
      background.drawRect(-20, -20, this.width + 40, this.height + 40);
      background.endFill();
      this.container.addChild(background);
    } catch (error) {
      throw new GameError(
        "Failed to create background",
        "SlotMachine.createBackground",
        error as Error,
      );
    }
  }

  private createReelMask(): void {
    try {
      const mask = new PIXI.Graphics();
      mask.beginFill(0xff00ff, 1);
      mask.drawRect(-20, -20, this.width + 40, this.height + 40);
      mask.endFill();

      this.reelsContainer.mask = mask;
      this.container.addChild(mask);
    } catch (error) {
      throw new GameError(
        "Failed to create reel mask",
        "SlotMachine.createReelMask",
        error as Error,
      );
    }
  }

  private createReels(): void {
    for (let i = 0; i < GAME_CONFIG.REELS.COUNT; i++) {
      const reel = new Reel(
        GAME_CONFIG.REELS.SYMBOLS_PER_REEL,
        GAME_CONFIG.REELS.SYMBOL_SIZE,
      );
      reel.container.y =
        i * (GAME_CONFIG.REELS.HEIGHT + GAME_CONFIG.REELS.SPACING);
      this.reelsContainer.addChild(reel.container);
      this.reels.push(reel);
    }
  }

  public update(delta: number): void {
    // Update each reel
    for (const reel of this.reels) {
      reel.update(delta);
    }
  }

  public spin(): void {
    if (this.isSpinning) {
      Logger.warn("Spin requested but already spinning");
      return;
    }

    this.isSpinning = true;
    sound.play("Reel spin");
    eventBus.emit({ type: "SPIN_STARTED" });
    Logger.info("Slot spin started");

    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].startSpin();
      }, i * GAME_CONFIG.ANIMATION.SPIN_DELAY);
    }

    setTimeout(
      () => {
        this.stopSpin();
      },
      GAME_CONFIG.ANIMATION.FINAL_DELAY +
        (this.reels.length - 1) * GAME_CONFIG.ANIMATION.SPIN_DELAY,
    );
  }

  private stopSpin(): void {
    for (let i = 0; i < this.reels.length; i++) {
      setTimeout(() => {
        this.reels[i].stopSpin();

        if (i === this.reels.length - 1) {
          setTimeout(() => {
            sound.stop("Reel spin");
            this.checkWin();
            this.isSpinning = false;
            eventBus.emit({ type: "SPIN_STOPPED" });
          }, GAME_CONFIG.ANIMATION.FINAL_DELAY);
        }
      }, i * GAME_CONFIG.ANIMATION.STOP_DELAY);
    }
  }

  private checkWin(): void {
    const randomWin = Math.random() < GAME_CONFIG.WIN.CHANCE;

    if (randomWin) {
      sound.play("win");
      Logger.info("Win detected!");
      eventBus.emit({ type: "WIN_DETECTED", data: { amount: "random" } });

      if (this.winAnimation) {
        this.winAnimation.visible = true;
        if (this.winAnimation.state.hasAnimation("start")) {
          this.winAnimation.state.setAnimation(0, "start", false);
        }
      }
    }
  }

  private initSpineAnimations(): void {
    try {
      this.initFrameSpine();
      this.initWinAnimation();
    } catch (error) {
      throw new GameError(
        "Failed to initialize spine animations",
        "SlotMachine.initSpineAnimations",
        error as Error,
      );
    }
  }

  private initFrameSpine(): void {
    const frameSpineData = AssetLoader.getSpine("base-feature-frame.json");
    if (frameSpineData) {
      this.frameSpine = new Spine(frameSpineData.spineData);

      this.frameSpine.y = this.height / 2;
      this.frameSpine.x = this.width / 2;

      if (this.frameSpine.state.hasAnimation("idle")) {
        this.frameSpine.state.setAnimation(0, "idle", true);
      }

      this.container.addChild(this.frameSpine);
    }
  }

  private initWinAnimation(): void {
    const winSpineData = AssetLoader.getSpine("big-boom-h.json");
    if (winSpineData) {
      this.winAnimation = new Spine(winSpineData.spineData);

      this.winAnimation.x = this.height / 2 + this.winAnimation.width / 4;
      this.winAnimation.y = this.width / 2 - this.winAnimation.height / 3;

      this.winAnimation.visible = false;
      this.container.addChild(this.winAnimation);
    }
  }
}
