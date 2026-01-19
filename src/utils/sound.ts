import { Howl } from "howler";
import { Logger } from "./Logger";

const sounds: Record<string, Howl> = {};

export const sound = {
  add: (alias: string, url: string): void => {
    if (sounds[alias]) {
      sounds[alias].unload();
    }

    try {
      sounds[alias] = new Howl({
        src: [url],
        preload: true,
      });
      Logger.debug(`Sound added: ${alias}`);
    } catch (error) {
      Logger.warn(`Failed to add sound: ${alias}`, error);
    }
  },
  play: (alias: string): void => {
    const howl = sounds[alias];
    if (!howl) {
      Logger.warn(`Sound not found: ${alias}`);
      return;
    }

    try {
      howl.play();
      Logger.debug(`Playing sound: ${alias}`);
    } catch (error) {
      Logger.warn(`Failed to play sound: ${alias}`, error);
    }
  },
};
