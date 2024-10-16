import { test, expect } from "vitest";
import { version } from ".";

test("smoke test", () => {
  expect(version).toMatch(/^[\d.]+$/);
});
