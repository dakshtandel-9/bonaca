import assert from "node:assert/strict";
import { test } from "node:test";
import { cloneDefaults } from "../src/lib/cms/merge";
import { applyContentEdits, contentVersion } from "../src/lib/cms/mcp-content";
import { collectFieldRefs, SITE_WIDE } from "../src/lib/cms/fields";
import { getAtPath } from "../src/lib/cms/path";

test("every existing CRM field can be round-tripped through the MCP validator", () => {
  const current = cloneDefaults();
  for (const { path } of collectFieldRefs(SITE_WIDE)) {
    const { next } = applyContentEdits(current, [{ path, value: getAtPath(current, path) }]);
    assert.deepEqual(next, current, path);
  }
});

test("hero and number batch preserves other content and does not mutate input", () => {
  const current = cloneDefaults();
  const version = contentVersion(current);
  const { next, changes } = applyContentEdits(current, [
    { path: "home.hero.titleLines", value: ["A slower", "kind of stay"] },
    { path: "accommodation.rates.leadAmount", value: 18000 },
    { path: "home.overview.stats.0.value", value: 8 },
  ]);
  assert.deepEqual(next.home.hero.titleLines, ["A slower", "kind of stay"]);
  assert.equal(next.accommodation.rates.leadAmount, 18000);
  assert.equal(next.home.overview.stats[0].value, 8);
  assert.deepEqual(next.experiences, current.experiences);
  assert.equal(contentVersion(current), version);
  assert.equal(changes.length, 3);
});

test("invalid edits reject the whole batch", () => {
  const current = cloneDefaults();
  for (const edit of [
    { path: "home.hero.titleLines", value: "wrong type" },
    { path: "accommodation.rates.leadAmount", value: "18000" },
    { path: "home.reviews.items.0.rating", value: 6 },
    { path: "home.hero.__proto__.polluted", value: "yes" },
    { path: "constructor.prototype.polluted", value: true },
    { path: "home.unknown", value: "oops" },
    { path: "home.overview.stats.999.value", value: 5 },
    { path: "home.overview.stats.00.value", value: 5 },
    { path: "navigation.main.0.href", value: "javascript:alert(1)" },
    { path: "home.hero.imageWide", value: "//evil.example/image.jpg" },
    { path: "home.hero.imageTall", value: "data:image/svg+xml,evil" },
    { path: "home.rooms.items", value: [] },
  ]) {
    assert.throws(() => applyContentEdits(current, [{ path: "home.hero.eyebrow", value: "Updated" }, edit]), edit.path);
  }
  assert.notEqual(current.home.hero.eyebrow, "Updated");
});

test("lists preserve omitted row fields by id and reject duplicates and overlaps", () => {
  const current = cloneDefaults();
  const rows = current.home.rooms.items;
  const { next } = applyContentEdits(current, [{ path: "home.rooms.items", value: rows.map((row) => ({ id: row.id, name: "New room name" })).reverse() }]);
  assert.equal(next.home.rooms.items[0].image, rows.at(-1)!.image);
  assert.equal(next.home.rooms.items[0].name, "New room name");
  assert.throws(() => applyContentEdits(current, [{ path: "home.rooms.items", value: [rows[0], rows[0]] }]));
  assert.throws(() => applyContentEdits(current, [
    { path: "home.hero.titleLines", value: ["New"] }, { path: "home.hero.titleLines.0", value: "Other" },
  ]));
  assert.throws(() => applyContentEdits(current, [{ path: "home.rooms.items.0.id", value: "new-id" }]));
});
