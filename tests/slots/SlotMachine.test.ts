import { SlotMachine } from "../../src/slots/SlotMachine";
import * as PIXI from "pixi.js";

describe("SlotMachine", () => {
  let slotMachine: SlotMachine;
  let mockApp: PIXI.Application;

  beforeEach(() => {
    mockApp = new PIXI.Application();
    slotMachine = new SlotMachine(mockApp);
  });

  test("should initialize with correct number of reels", () => {
    expect(slotMachine.container).toBeDefined();
    expect(slotMachine["reels"]).toHaveLength(4);
  });

  test("should not spin if already spinning", () => {
    slotMachine["isSpinning"] = true;
    slotMachine.spin();
    expect(slotMachine["isSpinning"]).toBe(true);
  });
});
