import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const versionFile = path.join(rootDir, ".version");
const serverEnvFile = path.join(rootDir, "server", ".env");
const clientEnvFile = path.join(rootDir, "client", ".env");

// Parse CLI flags
const args = process.argv.slice(2);
const shouldUp = args.includes("--up");
const noBump = args.includes("--no-bump");
const explicitVersionIdx = args.indexOf("--version");
const explicitVersion = explicitVersionIdx !== -1 ? args[explicitVersionIdx + 1] : null;

// Validate .env existence
if (!fs.existsSync(serverEnvFile)) {
  console.error("Error: File server/.env tidak ditemukan!");
  process.exit(1);
}
if (!fs.existsSync(clientEnvFile)) {
  console.error("Error: File client/.env tidak ditemukan!");
  process.exit(1);
}

// Version management
let currentVersion = "1.0";
if (fs.existsSync(versionFile)) {
  const content = fs.readFileSync(versionFile, "utf8").trim();
  if (content) {
    currentVersion = content;
  }
}

let nextVersion = currentVersion;

if (explicitVersion) {
  nextVersion = explicitVersion;
} else if (!noBump) {
  // Auto-increment logic: 1.0 -> 1.1 -> 1.2
  const parts = currentVersion.split(".");
  if (parts.length >= 2) {
    const major = parseInt(parts[0], 10) || 1;
    const minor = parseInt(parts[1], 10) || 0;
    nextVersion = `${major}.${minor + 1}`;
  } else {
    nextVersion = `${currentVersion}.1`;
  }
}

console.log(`\n[RESUMIX DOCKER BUILD] Target Version Tag: ${nextVersion}`);
console.log(`Loading environment from: server/.env and client/.env (No global .env)\n`);

const composeEnv = {
  ...process.env,
  APP_VERSION: nextVersion,
};

const composeArgs = [
  "compose",
  "--env-file",
  path.relative(rootDir, serverEnvFile),
  "--env-file",
  path.relative(rootDir, clientEnvFile),
  "build",
];

// Execute docker compose build
console.log(`Running: docker ${composeArgs.join(" ")}`);
const buildResult = spawnSync("docker", composeArgs, {
  cwd: rootDir,
  env: composeEnv,
  stdio: "inherit",
});

if (buildResult.status !== 0) {
  console.error(`Docker build failed with exit code ${buildResult.status}`);
  process.exit(buildResult.status || 1);
}

// Save incremented version to .version upon successful build
fs.writeFileSync(versionFile, `${nextVersion}\n`, "utf8");

// Sync APP_VERSION in server/.env
if (fs.existsSync(serverEnvFile)) {
  let serverEnvContent = fs.readFileSync(serverEnvFile, "utf8");
  if (serverEnvContent.includes("APP_VERSION=")) {
    serverEnvContent = serverEnvContent.replace(/APP_VERSION=.*/, `APP_VERSION=${nextVersion}`);
  } else {
    serverEnvContent = `APP_VERSION=${nextVersion}\n` + serverEnvContent;
  }
  fs.writeFileSync(serverEnvFile, serverEnvContent, "utf8");
}
console.log(`\nBuild completed successfully for version ${nextVersion}! Saved to .version and server/.env`);

// If --up flag provided, start the containers
if (shouldUp) {
  const upArgs = [
    "compose",
    "--env-file",
    path.relative(rootDir, serverEnvFile),
    "--env-file",
    path.relative(rootDir, clientEnvFile),
    "up",
    "-d",
    "--remove-orphans",
  ];
  console.log(`\nRunning: docker ${upArgs.join(" ")}`);
  const upResult = spawnSync("docker", upArgs, {
    cwd: rootDir,
    env: composeEnv,
    stdio: "inherit",
  });

  if (upResult.status !== 0) {
    console.error(`Docker compose up failed with exit code ${upResult.status}`);
    process.exit(upResult.status || 1);
  }
  console.log(`\nServices deployed and running with tag ${nextVersion}!`);
}

