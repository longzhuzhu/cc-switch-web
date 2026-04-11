import { cargoCmd, checkNodeScriptSyntax, runOrExit } from "./lib/process.mjs";

console.log("[check] validating Node scripts");
checkNodeScriptSyntax("scripts/dev.mjs");
checkNodeScriptSyntax("scripts/build.mjs");
checkNodeScriptSyntax("scripts/check.mjs");
checkNodeScriptSyntax("scripts/lib/process.mjs");

console.log("[check] running TypeScript check");
runOrExit("pnpm", ["exec", "tsc", "--noEmit", "-p", "tsconfig.json"]);

console.log("[check] running Rust check");
runOrExit(cargoCmd, [
  "check",
  "--locked",
  "--manifest-path",
  "backend/Cargo.toml",
  "--bin",
  "cc-switch-web",
]);
