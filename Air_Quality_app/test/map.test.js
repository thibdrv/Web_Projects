const test = require("node:test");
const assert = require("node:assert/strict");
const CyprusMap = require("../map.js");

test("size keeps the geographic aspect ratio", () => {
  const { width, height } = CyprusMap.size(400);
  assert.equal(width, 400);
  assert.ok(height > 200 && height < 300, "height " + height);
});

test("project: north-west corner is the origin, south-east the far corner", () => {
  const { minLon, maxLat, maxLon, minLat } = CyprusMap.BOUNDS;
  const nw = CyprusMap.project(minLon, maxLat, 400);
  assert.ok(Math.abs(nw.x) < 1e-9 && Math.abs(nw.y) < 1e-9);
  const se = CyprusMap.project(maxLon, minLat, 400);
  const size = CyprusMap.size(400);
  assert.ok(Math.abs(se.x - 400) < 1e-6);
  assert.ok(Math.abs(se.y - size.height) < 1);
});

test("invert is the inverse of project", () => {
  const p = CyprusMap.project(33.3823, 35.1856, 450);
  const back = CyprusMap.invert(p.x, p.y, 450);
  assert.ok(Math.abs(back.lon - 33.3823) < 1e-9);
  assert.ok(Math.abs(back.lat - 35.1856) < 1e-9);
});

test("north is up and east is right", () => {
  const nicosia = CyprusMap.project(33.38, 35.19, 400);
  const paphos = CyprusMap.project(32.42, 34.77, 400);
  assert.ok(nicosia.y < paphos.y);
  assert.ok(nicosia.x > paphos.x);
});

test("insideIsland: inland places yes, open sea and mainland no", () => {
  assert.equal(CyprusMap.insideIsland(33.38, 35.19), true); // Nicosia
  assert.equal(CyprusMap.insideIsland(32.87, 34.93), true); // Troodos
  assert.equal(CyprusMap.insideIsland(33.0, 34.1), false); // sea south of the island
  assert.equal(CyprusMap.insideIsland(33.4, 36.2), false); // Turkish coast
  assert.equal(CyprusMap.insideIsland(31.0, 35.0), false); // sea west
});

test("outlinePath is a closed SVG path", () => {
  const path = CyprusMap.outlinePath(400);
  assert.ok(path.startsWith("M"));
  assert.ok(path.endsWith("Z"));
  assert.equal((path.match(/L/g) || []).length, CyprusMap.OUTLINE.length - 1);
});
