export const GAME_CONFIG = {
  // Display settings
  DISPLAY: {
    WIDTH: 1280,
    HEIGHT: 800,
    BACKGROUND_COLOR: 0x1099bb,
  },

  // Reel configuration
  REELS: {
    COUNT: 4,
    SYMBOLS_PER_REEL: 6,
    SYMBOL_SIZE: 150,
    HEIGHT: 150,
    SPACING: 10,
  },

  // Animation settings
  ANIMATION: {
    SPIN_SPEED: 50,
    SLOWDOWN_RATE: 0.25,
    STOP_SPEED_THRESHOLD: 0.95,
    SPIN_DELAY: 200,
    STOP_DELAY: 400,
    FINAL_DELAY: 500,
    SETTLE_EASING: 0.3,
    SETTLE_THRESHOLD: 0.5,
  },

  // Win settings
  WIN: {
    CHANCE: 0.3,
  },

  // Asset paths
  ASSETS: {
    IMAGES_PATH: "assets/images/",
    SPINES_PATH: "assets/spines/",
    SOUNDS_PATH: "assets/sounds/",
  },
} as const;

export const SYMBOL_TEXTURES = [
  "symbol1.png",
  "symbol2.png",
  "symbol3.png",
  "symbol4.png",
  "symbol5.png",
] as const;

export const ASSET_LISTS = {
  IMAGES: [
    ...SYMBOL_TEXTURES,
    "background.png",
    "button_spin.png",
    "button_spin_disabled.png",
  ],
  SPINES: ["big-boom-h.json", "base-feature-frame.json"],
  SOUNDS: ["Reel spin.webm", "win.webm", "Spin button.webm"],
} as const;
