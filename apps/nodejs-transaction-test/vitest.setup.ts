import { expect, vi } from "vitest";

// Extend Jest matchers
// This makes TypeScript understand that mocked functions have methods like mockImplementation
// @ts-ignore - ignore potential import errors
global.expect = expect;
// @ts-ignore
global.vi = vi;
