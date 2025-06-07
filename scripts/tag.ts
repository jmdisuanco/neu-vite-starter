import { readFileSync } from "fs";

const bumpType = Bun.argv[2];
if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error("Usage: bun tag.ts [patch|minor|major]");
  process.exit(1);
}

const branch = (await $`git rev-parse --abbrev-ref HEAD`).stdout.trim();

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const [major, minor, patch] = pkg.version.split(".").map(Number);

let newVersion = "";
if (bumpType === "patch") newVersion = `${major}.${minor}.${patch + 1}`;
if (bumpType === "minor") newVersion = `${major}.${minor + 1}.0`;
if (bumpType === "major") newVersion = `${major + 1}.0.0`;

pkg.version = newVersion;
await Bun.write("package.json", JSON.stringify(pkg, null, 2) + "\n");

// 4. Construct tag
const tagName = `${branch}-${newVersion}`;
console.log(`📦 Tagging as: ${tagName}`);

// 5. Git add, commit, tag, push
await $`git add package.json`;
await $`git commit -m "chore: bump version to ${newVersion}"`;
await $`git push`;
await $`git tag ${tagName}`;
await $`git push origin ${tagName}`;
