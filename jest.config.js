module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.(spec|test).ts", "**/?(*.)+(spec|test).ts"],

  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
