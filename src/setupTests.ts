import '@testing-library/jest-dom';  // Extends Jest with custom matchers
import { TextEncoder, TextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
  // global.TextDecoder = TextDecoder;
}
