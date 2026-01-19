import * as PIXI from "pixi.js";
import { sound } from "./sound";
import { GAME_CONFIG, ASSET_LISTS } from "../config/GameConfig";
import { Logger, GameError } from "./Logger";

const textureCache: Record<string, PIXI.Texture> = {};
const spineCache: Record<string, any> = {};

export class AssetLoader {
  constructor() {
    PIXI.Assets.init({ basePath: "" });
  }

  public async loadAssets(): Promise<void> {
    try {
      Logger.info("Starting asset loading...");

      await this.loadImages();
      await this.loadSpines();
      await this.loadSounds();

      Logger.info("All assets loaded successfully");
    } catch (error) {
      Logger.error("Failed to load assets", error);
      throw new GameError(
        "Asset loading failed",
        "AssetLoader.loadAssets",
        error as Error,
      );
    }
  }

  private async loadImages(): Promise<void> {
    PIXI.Assets.addBundle(
      "images",
      ASSET_LISTS.IMAGES.map((image) => ({
        name: image,
        srcs: GAME_CONFIG.ASSETS.IMAGES_PATH + image,
      })),
    );

    const imageAssets = await PIXI.Assets.loadBundle("images");
    Logger.info("Images loaded successfully");

    for (const [key, texture] of Object.entries(imageAssets)) {
      textureCache[key] = texture as PIXI.Texture;
    }
  }

  private async loadSpines(): Promise<void> {
    PIXI.Assets.addBundle(
      "spines",
      ASSET_LISTS.SPINES.map((spine) => ({
        name: spine,
        srcs: GAME_CONFIG.ASSETS.SPINES_PATH + spine,
      })),
    );

    try {
      const spineAssets = await PIXI.Assets.loadBundle("spines");
      Logger.info("Spine animations loaded successfully");

      for (const [key, spine] of Object.entries(spineAssets)) {
        spineCache[key] = spine;
      }
    } catch (error) {
      Logger.warn("Some spine animations failed to load", error);
    }
  }

  private async loadSounds(): Promise<void> {
    try {
      ASSET_LISTS.SOUNDS.forEach((soundFile) => {
        sound.add(
          soundFile.split(".")[0],
          GAME_CONFIG.ASSETS.SOUNDS_PATH + soundFile,
        );
      });
      Logger.info("Sounds loaded successfully");
    } catch (error) {
      Logger.warn("Some sounds failed to load", error);
    }
  }

  public static getTexture(name: string): PIXI.Texture {
    return textureCache[name];
  }

  public static getSpine(name: string): any {
    return spineCache[name];
  }
}
