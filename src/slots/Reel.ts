import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";

const SYMBOL_TEXTURES = [
  "symbol1.png",
  "symbol2.png",
  "symbol3.png",
  "symbol4.png",
  "symbol5.png",
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down
const SETTLE_EASING = 0.25;
const STOP_SPEED_THRESHOLD = 1;
const SETTLE_THRESHOLD = 0.5;

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
    // Create symbols for the reel, arranged horizontally
    for (let i = 0; i < this.symbolCount; i++) {
      const symbol = this.createRandomSymbol();
      symbol.x = i * this.symbolSize;
      symbol.y = 0;
      this.container.addChild(symbol);
      this.symbols.push(symbol);
    }
  }

  private createRandomSymbol(): PIXI.Sprite {
    // TODO:Get a random symbol texture
    const textureName =
      SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
    const texture = AssetLoader.getTexture(textureName) ?? PIXI.Texture.WHITE;

    // TODO:Create a sprite with the texture
    const sprite = new PIXI.Sprite(texture);
    sprite.width = this.symbolSize;
    sprite.height = this.symbolSize;

    return sprite;
  }

  public update(delta: number): void {
    if (this.isSettling) {
      this.updateSettle(delta);
      return;
    }
    if (!this.isSpinning && this.speed === 0) return;

    // TODO:Move symbols horizontally
    const moveX = this.speed * delta;
    for (const symbol of this.symbols) {
      symbol.x += moveX;
    }

    for (const symbol of this.symbols) {
      if (symbol.x >= this.symbolCount * this.symbolSize) {
        let minX = 940; // Reel edge
        for (const s of this.symbols) {
          if (s.x < minX) minX = s.x;
        }

        symbol.x = minX - this.symbolSize;
        const newSymbol = this.createRandomSymbol();
        symbol.texture = newSymbol.texture;
      }
    }

    // If we're stopping, slow down the reel
    if (!this.isSpinning && this.speed > 0) {
      this.speed *= SLOWDOWN_RATE;

      // If speed is very low, stop recycling and ease into the nearest grid alignment
      if (this.speed < STOP_SPEED_THRESHOLD) {
        this.speed = 0;
        this.beginSettle();
      }
    }
  }

  private beginSettle(): void {
    this.isSettling = true;
    const sorted = [...this.symbols].sort((a, b) => a.x - b.x);
    this.symbols = sorted;

    const leftMostX = sorted[0]?.x ?? 0;
    const baseTarget =
      Math.round(leftMostX / this.symbolSize) * this.symbolSize;

    this.settleTargets = sorted.map((_, i) => baseTarget + i * this.symbolSize);
  }

  private updateSettle(delta: number): void {
    if (!this.settleTargets) {
      this.isSettling = false;
      return;
    }

    const t = Math.min(1, SETTLE_EASING * delta);
    let maxError = 0;

    for (let i = 0; i < this.symbols.length; i++) {
      const target = this.settleTargets[i];
      const symbol = this.symbols[i];
      const diff = target - symbol.x;
      symbol.x += diff * t;
      const abs = Math.abs(diff);
      if (abs > maxError) maxError = abs;
    }

    if (maxError < SETTLE_THRESHOLD) {
      for (let i = 0; i < this.symbols.length; i++) {
        this.symbols[i].x = this.settleTargets[i];
      }

      this.settleTargets = null;
      this.isSettling = false;
    }
  }

  private snapToGrid(): void {
    // TODO: Snap symbols to horizontal grid positions
    const sorted = [...this.symbols].sort((a, b) => a.x - b.x);
    for (let i = 0; i < sorted.length; i++) {
      sorted[i].x = i * this.symbolSize;
    }

    this.symbols = sorted;
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = SPIN_SPEED;
  }

  public stopSpin(): void {
    this.isSpinning = false;
    // The reel will gradually slow down in the update method
  }
}
