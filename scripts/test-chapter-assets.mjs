/**
 * S3 biology packs must keep one copy of each teaching file.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packsRoot = path.join(repoRoot, "content-packs");
const expected = [
  "bb02-molecules-of-life",
  "bb03-cellular-organization",
  "bb04-membrane-transport",
  "bb05-metabolism-and-enzymes",
];

const directories = fs
  .readdirSync(packsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .toSorted();

assert.deepEqual(directories, expected);

const scopes = new Set();
const slugs = new Set();

for (const directory of directories) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(packsRoot, directory, "manifest.json"), "utf8"),
  );
  assert.equal(manifest.subject, "BIO");
  assert.equal(manifest.published, true);
  assert.equal(scopes.has(manifest.scope), false, manifest.scope);
  scopes.add(manifest.scope);
  assert.ok((manifest.tools ?? []).length > 0, directory);
  for (const tool of manifest.tools ?? []) {
    assert.match(tool.slug, /^[a-z0-9-]+$/);
    assert.equal(slugs.has(tool.slug), false, tool.slug);
    slugs.add(tool.slug);
    assert.equal(
      fs.existsSync(path.join(repoRoot, tool.path, "index.html")),
      true,
      tool.path,
    );
  }
}

assert.equal(scopes.size, expected.length);
assert.ok(slugs.has("s3-mc"));
assert.ok(slugs.has("food-nutrition"));
assert.equal(
  fs.existsSync(path.join(packsRoot, "bb02-molecules-of-life/tools/shared/embed.js")),
  true,
);
assert.equal(
  fs.existsSync(path.join(packsRoot, "bb02-molecules-of-life/tools/s3-mc/js/quizData.js")),
  true,
);

const syllabus = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "content/topics/bio-topics.json"), "utf8"),
);
assert.equal(syllabus.topics.length, 41);
assert.equal(syllabus.topics[0].symbol, "BB01");
assert.equal(syllabus.topics.at(-1).symbol, "SB35");

const blue = syllabus.sharedGroups.find((group) => group.id === "biomolecules");
const green = syllabus.sharedGroups.find((group) => group.id === "food-tests");
assert.deepEqual(blue.symbols, ["BB02", "SB01"]);
assert.deepEqual(
  blue.subTopics.map((topic) => `${topic.symbol} ${topic.code}`),
  ["BB02 2.1", "BB02 2.2", "BB02 2.3", "BB02 2.4", "BB02 2.5", "BB02 2.6", "BB02 2.7", "SB01 1.1"],
);
assert.deepEqual(
  green.subTopics.map((topic) => `${topic.symbol} ${topic.code} ${topic.name}`),
  ["BB02 2.8 Tests for biomolecules", "SB01 1.2 Summary of food tests"],
);

function walk(dir, hits) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, hits);
    else if (entry.name === "food-lab.html" || entry.name === "quizData.js") hits.push(full);
  }
}
const hits = [];
walk(packsRoot, hits);
assert.equal(hits.filter((file) => file.endsWith("food-lab.html")).length, 1);
assert.equal(hits.filter((file) => file.endsWith("quizData.js")).length, 1);
