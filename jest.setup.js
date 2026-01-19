// -------------------- AssetLoader --------------------
jest.mock("./src/utils/AssetLoader", () => ({
  AssetLoader: {
    getTexture: jest.fn().mockReturnValue({}),
    getSpine: jest.fn().mockReturnValue({ spineData: {} }),
  },
}));

// -------------------- GameConfig --------------------
jest.mock("./src/config/GameConfig", () => ({
  SYMBOL_TEXTURES: ["symbol1.png", "symbol2.png", "symbol3.png"],
  GAME_CONFIG: {
    DISPLAY: {
      WIDTH: 1280,
      HEIGHT: 800,
    },
    REELS: {
      COUNT: 4,
      SYMBOLS_PER_REEL: 6,
      SYMBOL_SIZE: 150,
      HEIGHT: 150,
      SPACING: 10,
    },
    ANIMATION: {
      // Reel / spin config
      SPIN_SPEED: 50,
      SLOWDOWN_RATE: 0.25,
      STOP_SPEED_THRESHOLD: 0.95,
      SETTLE_EASING: 0.3,
      SETTLE_THRESHOLD: 0.5,

      // Timing config
      SPIN_DELAY: 200,
      STOP_DELAY: 400,
      FINAL_DELAY: 500,
    },
    WIN: {
      CHANCE: 0.3,
    },
  },
}));

// -------------------- Logger --------------------
jest.mock("./src/utils/Logger", () => ({
  Logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
  GameError: jest.fn(),
}));

// -------------------- pixi.js --------------------
jest.mock("pixi.js", () => ({
  Application: jest.fn().mockImplementation(() => ({
    stage: { addChild: jest.fn() },
    ticker: { add: jest.fn() },
  })),

  Container: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
    x: 0,
    y: 0,
    mask: null,
  })),

  Graphics: jest.fn().mockImplementation(() => ({
    beginFill: jest.fn(),
    drawRect: jest.fn(),
    endFill: jest.fn(),
  })),

  Sprite: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    texture: {},
  })),

  Texture: {
    WHITE: {},
  },
}));

// -------------------- pixi-spine --------------------
jest.mock("pixi-spine", () => ({
  Spine: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    visible: true,
    width: 100,
    height: 100,
    state: {
      hasAnimation: jest.fn().mockReturnValue(true),
      setAnimation: jest.fn(),
    },
  })),
}));

// -------------------- Sound --------------------
jest.mock("./src/utils/sound", () => ({
  sound: {
    play: jest.fn(),
    stop: jest.fn(),
  },
}));

// -------------------- EventBus --------------------
jest.mock("./src/events/EventBus", () => ({
  eventBus: {
    on: jest.fn(),
    emit: jest.fn(),
  },
}));
