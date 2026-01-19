// TODO: Implement sound player using the "howler" package
import { Howl } from "howler";

const sounds: Record<string, Howl> = {};

export const sound = {
  add: (alias: string, url: string): void => {
    if (sounds[alias]) {
      sounds[alias].unload();
    }

    sounds[alias] = new Howl({
      src: [url],
      preload: true,
    });
  },
  play: (alias: string): void => {
    const howl = sounds[alias];
    if (!howl) {
      console.warn(`Sound not found: ${alias}`);
      return;
    }

    howl.play();
  },
};
