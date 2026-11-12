const test = require("node:test");
const assert = require("node:assert/strict");
const AQI = require("../aqi.js");

test("levelIndex: US band edges", () => {
  assert.equal(AQI.levelIndex("us", 0), 0);
  assert.equal(AQI.levelIndex("us", 50), 0);
  assert.equal(AQI.levelIndex("us", 51), 1);
  assert.equal(AQI.levelIndex("us", 100), 1);
  assert.equal(AQI.levelIndex("us", 101), 2);
  assert.equal(AQI.levelIndex("us", 300), 4);
  assert.equal(AQI.levelIndex("us", 301), 5);
});

test("levelIndex: rounds, clamps and rejects bad input", () => {
  assert.equal(AQI.levelIndex("us", 50.4), 0);
  assert.equal(AQI.levelIndex("us", 50.6), 1);
  assert.equal(AQI.levelIndex("us", -5), 0);
  assert.equal(AQI.levelIndex("us", 750), 5); // above 500 stays in the last level
  assert.equal(AQI.levelIndex("us", NaN), -1);
  assert.equal(AQI.levelIndex("us", null), -1);
  assert.equal(AQI.levelIndex("us", undefined), -1);
});

test("levelIndex: European bands", () => {
  assert.equal(AQI.levelIndex("eu", 20), 0);
  assert.equal(AQI.levelIndex("eu", 21), 1);
  assert.equal(AQI.levelIndex("eu", 100), 4);
  assert.equal(AQI.levelIndex("eu", 101), 5);
  assert.equal(AQI.levelIndex("eu", 180), 5);
});

test("pointerPercent: proportional and clamped", () => {
  assert.equal(AQI.pointerPercent("us", 0), 0);
  assert.equal(AQI.pointerPercent("us", 250), 50);
  assert.equal(AQI.pointerPercent("us", 500), 100);
  assert.equal(AQI.pointerPercent("us", 900), 100);
  assert.equal(AQI.pointerPercent("us", -3), 0);
  assert.equal(AQI.pointerPercent("eu", 60), 50);
  assert.equal(AQI.pointerPercent("us", NaN), 0);
});

test("sectionWeights add up to the scale maximum", () => {
  for (const id of ["us", "eu"]) {
    const total = AQI.sectionWeights(id).reduce((a, b) => a + b, 0);
    assert.equal(total, AQI.SCALES[id].max);
  }
});

test("mainPollutants: highest sub-index, ties and missing values", () => {
  assert.deepEqual(AQI.mainPollutants({ pm10: 5, ozone: 21, pm2_5: 20 }), [
    "ozone",
  ]);
  assert.deepEqual(AQI.mainPollutants({ a: 7, b: 7, c: 1 }), ["a", "b"]);
  assert.deepEqual(AQI.mainPollutants({ a: null, b: undefined }), []);
  assert.deepEqual(AQI.mainPollutants({}), []);
});

test("normalizeResponse: object, array and junk", () => {
  assert.deepEqual(AQI.normalizeResponse({ a: 1 }), [{ a: 1 }]);
  assert.deepEqual(AQI.normalizeResponse([{ a: 1 }, { b: 2 }]), [
    { a: 1 },
    { b: 2 },
  ]);
  assert.deepEqual(AQI.normalizeResponse(null), []);
});

test("parseEntry: maps current and hourly values", () => {
  const entry = {
    utc_offset_seconds: 7200,
    current: {
      time: "2026-11-12T10:00",
      us_aqi: 27,
      european_aqi: 28,
      dust: 0,
      us_aqi_ozone: 27,
      european_aqi_ozone: 28,
      us_aqi_carbon_monoxide: 1,
    },
    hourly: { time: ["2026-11-12T10:00"], us_aqi: [27], european_aqi: [28], dust: [0] },
  };
  const parsed = AQI.parseEntry(entry);
  assert.equal(parsed.us, 27);
  assert.equal(parsed.eu, 28);
  assert.equal(parsed.sub.us.ozone, 27);
  assert.equal(parsed.sub.eu.ozone, 28);
  assert.equal(parsed.sub.us.carbon_monoxide, 1);
  assert.equal("carbon_monoxide" in parsed.sub.eu, false);
  assert.equal(parsed.utcOffset, 7200);
  assert.deepEqual(parsed.hourly.us, [27]);
});

test("parseEntry: tolerates an empty entry", () => {
  const parsed = AQI.parseEntry({});
  assert.equal(parsed.us, undefined);
  assert.equal(parsed.time, null);
  assert.deepEqual(parsed.hourly.time, []);
});

test("currentHourIndex: picks the slot containing now", () => {
  const times = ["2026-11-12T08:00", "2026-11-12T09:00", "2026-11-12T10:00"];
  const offset = 7200; // local = UTC+2
  const at = (iso) => Date.parse(iso);
  assert.equal(AQI.currentHourIndex(times, offset, at("2026-11-12T06:30:00Z")), 0); // 08:30 local
  assert.equal(AQI.currentHourIndex(times, offset, at("2026-11-12T07:59:00Z")), 1); // 09:59 local
  assert.equal(AQI.currentHourIndex(times, offset, at("2026-11-12T08:30:00Z")), 2); // 10:30 local
  assert.equal(AQI.currentHourIndex(times, offset, at("2026-11-13T00:00:00Z")), 2); // after the last slot
  assert.equal(AQI.currentHourIndex(times, offset, at("2026-01-01T00:00:00Z")), 0); // before the first slot
});

test("niceCeil", () => {
  assert.equal(AQI.niceCeil(0), 1);
  assert.equal(AQI.niceCeil(23), 50);
  assert.equal(AQI.niceCeil(50), 50);
  assert.equal(AQI.niceCeil(51), 100);
  assert.equal(AQI.niceCeil(0.3), 0.5);
  assert.equal(AQI.niceCeil(NaN), 1);
});
