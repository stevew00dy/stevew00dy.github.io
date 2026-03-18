import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useMaterialInventory } from "./useMaterialInventory";
import { useOwnedBlueprints } from "./useOwnedBlueprints";

describe("patch-state persistence hooks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists material inventory across hook instances for the active patch only", () => {
    const first = renderHook(() => useMaterialInventory("4.7"));

    act(() => {
      first.result.current.set("iron", 1.23456);
      first.result.current.increment("iron", 0.1);
    });

    expect(first.result.current.get("iron")).toBe(1.33456);
    first.unmount();

    const second = renderHook(() => useMaterialInventory("4.7"));
    expect(second.result.current.inventory.iron).toBe(1.33456);

    const otherPatch = renderHook(() => useMaterialInventory("4.8"));
    expect(otherPatch.result.current.inventory).toEqual({});

    act(() => {
      second.result.current.resetAll();
    });

    expect(second.result.current.inventory).toEqual({});
    expect(localStorage.getItem("crafting-tracker-material-inventory")).toBeNull();
  });

  it("preserves small cSCU-sized increments without rounding them away", () => {
    const hook = renderHook(() => useMaterialInventory("4.7"));

    act(() => {
      hook.result.current.set("hadanite", 0.001);
      hook.result.current.increment("hadanite", 0.0001);
      hook.result.current.decrement("hadanite", 0.0001);
    });

    expect(hook.result.current.get("hadanite")).toBe(0.001);

    act(() => {
      hook.result.current.increment("hadanite", 0.0001);
    });

    expect(hook.result.current.get("hadanite")).toBe(0.0011);
  });

  it("persists owned blueprints across hook instances", () => {
    const first = renderHook(() => useOwnedBlueprints());

    act(() => {
      first.result.current.toggle("bp-a03");
      first.result.current.setAll("bp-p6", true);
    });

    expect(first.result.current.isOwned("bp-a03")).toBe(true);
    expect(first.result.current.isOwned("bp-p6")).toBe(true);
    first.unmount();

    const second = renderHook(() => useOwnedBlueprints());
    expect(second.result.current.owned).toMatchObject({
      "bp-a03": true,
      "bp-p6": true,
    });
  });
});
