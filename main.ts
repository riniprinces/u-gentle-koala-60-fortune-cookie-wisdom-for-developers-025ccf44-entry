// Fortune Cookie Wisdom for Developers — make.fun entry.
//
// main.ts is the entrypoint. It writes a single original fortune-cookie
// line, aimed at a software developer, to entry.txt next to this file and,
// when the grader's output directory exists, to /output/entry.txt as well.
// The line never changes between runs, so the output is deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The fortune. Fortune-cookie voice ("Your future self..."), a truth every
// tired senior engineer recognises (today's shortcut is tomorrow's debug
// session), with a twist nobody has heard: the debugger is you, later.
const FORTUNE =
  "Your future self is already debugging the shortcut you are about to take.";

const LIMIT = 120;
const TARGETS = ["entry.txt", "/output/entry.txt"];

function validate(line: string): string {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    throw new Error("fortune must not be blank");
  }
  if (line.length > LIMIT) {
    throw new Error(`fortune is ${line.length} chars, over the ${LIMIT} limit`);
  }
  if (line !== trimmed) {
    throw new Error("fortune must not start or end with whitespace");
  }
  return line;
}

function emit(line: string): void {
  const checked = validate(line);
  for (const target of TARGETS) {
    const path = target.startsWith("/")
      ? target
      : join(dirname(fileURLToPath(import.meta.url)), target);
    try {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, checked, "utf8");
    } catch (err) {
      if (target === "entry.txt") throw err;
      // /output is only present inside the grader; skip it elsewhere.
      console.warn(`Could not write ${target}: ${(err as Error).message}`);
    }
  }
}

function verify(line: string): void {
  const again = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "entry.txt"),
    "utf8",
  );
  if (again !== line) {
    throw new Error("read-back mismatch: entry.txt does not match the fortune");
  }
}

emit(FORTUNE);
verify(FORTUNE);
console.log(`entry.txt written and verified (${FORTUNE.length} characters)`);
