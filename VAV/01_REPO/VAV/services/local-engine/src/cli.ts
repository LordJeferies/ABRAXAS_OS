import {collectHealth} from "./health.ts";

const command = process.argv[2] ?? "health";

if (command === "health") {
  console.log(JSON.stringify(collectHealth(), null, 2));
  process.exit(0);
}

console.error(`Unknown local-engine command: ${command}`);
process.exit(2);
