const { execSync } = require("child_process");
const fs = require("fs");

const bumpType = process.argv[2]; // patch | minor | major

if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error("Usage: node tag.js [patch|minor|major]");
  process.exit(1);
}

// 1. Get current branch name
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

// 2. Bump version
execSync(`npm version ${bumpType} --no-git-tag-version`);
const version = JSON.parse(fs.readFileSync("package.json", "utf8")).version;

// 3. Construct tag: branchName-version
const tagName = `${branch}-${version}`;
console.log(`Tagging as: ${tagName}`);

// 4. Commit version bump (if needed)
execSync("git add package.json package-lock.json");
execSync(`git commit -m "chore: bump version to ${version}"`);

// 5. Create and push tag
execSync(`git tag ${tagName}`);
execSync("git push");
execSync(`git push origin ${tagName}`);