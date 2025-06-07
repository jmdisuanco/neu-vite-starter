import { readFileSync, writeFileSync } from "fs";

function exec(cmd: string[], silent = false) {
  const proc = Bun.spawnSync(cmd);
  const stdout = (proc.stdout ?? "").toString().trim();
  const stderr = (proc.stderr ?? "").toString().trim();

  if (proc.exitCode !== 0) {
    console.error(`❌ Command failed: ${cmd.join(" ")}`);
    if (stderr) console.error(stderr);
    process.exit(proc.exitCode ?? 1);
  }

  if (!silent) {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  }

  return stdout;
}

// Get bump type
const bumpType = Bun.argv[2];
if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error("Usage: bun tag.ts [patch|minor|major]");
  process.exit(1);
}

// Get current branch
const branch = exec(["git", "rev-parse", "--abbrev-ref", "HEAD"], true);

// Read and bump version from package.json
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
let [major, minor, patch] = pkg.version.split(".").map(Number);

if (bumpType === "patch") patch += 1;
if (bumpType === "minor") {
  minor += 1;
  patch = 0;
}
if (bumpType === "major") {
  major += 1;
  minor = 0;
  patch = 0;
}

const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

const tagName = `${branch}-${newVersion}`;
console.log(`🏷️  Creating tag: ${tagName}`);

// Git operations
exec(["git", "add", "package.json"]);
exec(["git", "commit", "-m", `chore: bump version to ${newVersion}`]);
exec(["git", "push"]);
exec(["git", "tag", tagName]);
exec(["git", "push", "origin", tagName]);

console.log(`✅ Tagged and pushed as ${tagName}`);
