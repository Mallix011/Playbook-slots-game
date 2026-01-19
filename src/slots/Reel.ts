import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";
import { SYMBOL_TEXTURES, GAME_CONFIG } from "../config/GameConfig";
import { Logger, GameError } from "../utils/Logger";

export class Reel {
  public container: PIXI.Container;
  private symbols: PIXI.Sprite[];
  private symbolSize: number;
  private symbolCount: number;
  private speed: number = 0;
  private isSpinning: boolean = false;
  private isSettling: boolean = false;
  private settleTargets: number[] | null = null;

  constructor(symbolCount: number, symbolSize: number) {
    this.container = new PIXI.Container();
    this.symbols = [];
    this.symbolSize = symbolSize;
    this.symbolCount = symbolCount;

    this.createSymbols();
  }

  private createSymbols(): void {
    for (let i = 0; i < this.symbolCount; i++) {
      const symbol = this.createRandomSymbol();
      symbol.x = i * this.symbolSize;
      this.container.addChild(symbol);
      this.symbols.push(symbol);
    }
  }

  private getRandomTexture(): PIXI.Texture {
    const name =
      SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
    return AssetLoader.getTexture(name) ?? PIXI.Texture.WHITE;
  }

  private createRandomSymbol(): PIXI.Sprite {
    const sprite = new PIXI.Sprite(this.getRandomTexture());
    sprite.width = this.symbolSize;
    sprite.height = this.symbolSize;
    return sprite;
  }

  private wrapSymbol(symbol: PIXI.Sprite): void {
    const minX = Math.min(...this.symbols.map((s) => s.x));
    symbol.x = minX - this.symbolSize;
    symbol.texture = this.getRandomTexture();
  }

  public update(delta: number): void {
    if (this.isSettling) {
      this.updateSettle(delta);
      return;
    }
    if (!this.isSpinning && this.speed === 0) return;

    for (const symbol of this.symbols) {
      symbol.x += this.speed * delta;
      if (symbol.x >= this.symbolCount * this.symbolSize) {
        this.wrapSymbol(symbol);
      }
    }

    if (!this.isSpinning && this.speed > 0) {
      this.speed *= GAME_CONFIG.ANIMATION.SLOWDOWN_RATE;
      if (this.speed < GAME_CONFIG.ANIMATION.STOP_SPEED_THRESHOLD) {
        this.speed = 0;
        this.beginSettle();
      }
    }
  }

  private beginSettle(): void {
    this.isSettling = true;
    this.symbols.sort((a, b) => a.x - b.x);
    this.settleTargets = this.symbols.map((_, i) => i * this.symbolSize);
  }

  private updateSettle(delta: number): void {
    if (!this.settleTargets) {
      this.isSettling = false;
      return;
    }

    const t = Math.min(1, GAME_CONFIG.ANIMATION.SETTLE_EASING * delta);
    let maxError = 0;

    for (let i = 0; i < this.symbols.length; i++) {
      const target = this.settleTargets[i];
      const symbol = this.symbols[i];
      const diff = target - symbol.x;
      symbol.x += diff * t;
      maxError = Math.max(maxError, Math.abs(diff));
    }

    if (maxError < GAME_CONFIG.ANIMATION.SETTLE_THRESHOLD) {
      for (let i = 0; i < this.symbols.length; i++) {
        this.symbols[i].x = this.settleTargets[i];
      }
      this.settleTargets = null;
      this.isSettling = false;
    }
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = GAME_CONFIG.ANIMATION.SPIN_SPEED;
    Logger.debug(`Reel started spinning with speed ${this.speed}`);
  }

  public stopSpin(): void {
    this.isSpinning = false;
    Logger.debug("Reel stopping - will slow down gradually");
  }
}
