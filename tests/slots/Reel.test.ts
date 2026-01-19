import { Reel } from "../../src/slots/Reel";

describe("Reel", () => {
  let reel: Reel;

  beforeEach(() => {
    reel = new Reel(3, 100);
  });

  test("should initialize with correct symbol count and size", () => {
    expect(reel.container).toBeDefined();
    expect(reel["symbolCount"]).toBe(3);
    expect(reel["symbolSize"]).toBe(100);
  });

  test("should start spinning with correct speed", () => {
    reel.startSpin();
    expect(reel["isSpinning"]).toBe(true);
    expect(reel["speed"]).toBe(50);
  });

  test("should stop spinning when stopSpin is called", () => {
    reel.startSpin();
    reel.stopSpin();
    expect(reel["isSpinning"]).toBe(false);
  });
});
