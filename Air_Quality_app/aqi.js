/*
 * Pure air-quality logic (no DOM, no network), so it can be unit-tested with
 * `node --test` and also loaded as a classic <script> in the browser, where it
 * exposes a global `AQI`.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AQI = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  // Level ranges for each index. The last level has no upper limit in reality
  // (the US AQI can exceed 500, the EAQI exceeds 100), so values above `max`
  // stay in the last level and the pointer stops at the end of the bar.
  const SCALES = {
    us: {
      max: 500,
      levels: [
        { min: 0, max: 50, color: "#45B649" },
        { min: 51, max: 100, color: "#CAC531" },
        { min: 101, max: 150, color: "#F16529" },
        { min: 151, max: 200, color: "#cb2d3e" },
        { min: 201, max: 300, color: "#8E54E9" },
        { min: 301, max: 500, color: "#7a2828" },
      ],
    },
    // European Air Quality Index (EEA colours).
    eu: {
      max: 120,
      levels: [
        { min: 0, max: 20, color: "#50F0E6" },
        { min: 21, max: 40, color: "#50CCAA" },
        { min: 41, max: 60, color: "#F0E641" },
        { min: 61, max: 80, color: "#FF5050" },
        { min: 81, max: 100, color: "#960032" },
        { min: 101, max: 120, color: "#7D2181" },
      ],
    },
  };

  // The six pollutants. `eu: false` means the European AQI has no sub-index
  // for it (carbon monoxide).
  const POLLUTANTS = [
    { id: "pm2_5", label: "PM2.5", eu: true },
    { id: "pm10", label: "PM10", eu: true },
    { id: "nitrogen_dioxide", label: "NO₂", eu: true },
    { id: "ozone", label: "O₃", eu: true },
    { id: "sulphur_dioxide", label: "SO₂", eu: true },
    { id: "carbon_monoxide", label: "CO", eu: false },
  ];

  function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  /** Index of the level a value belongs to, or -1 if the value is invalid. */
  function levelIndex(scaleId, value) {
    if (!isNumber(value)) return -1;
    const { levels } = SCALES[scaleId];
    const rounded = Math.max(0, Math.round(value));
    const found = levels.findIndex(
      (level) => rounded >= level.min && rounded <= level.max
    );
    return found === -1 ? levels.length - 1 : found; // above the top: last level
  }

  /** Position of the pointer on the bar, in percent (0-100, clamped). */
  function pointerPercent(scaleId, value) {
    if (!isNumber(value)) return 0;
    const { max } = SCALES[scaleId];
    return (Math.min(Math.max(value, 0), max) / max) * 100;
  }

  /** Relative width of each level on the bar. */
  function sectionWeights(scaleId) {
    return SCALES[scaleId].levels.map((level, i) =>
      i === 0 ? level.max : level.max - (level.min - 1)
    );
  }

  /** Ids of the pollutants with the highest sub-index (the "main" ones). */
  function mainPollutants(subIndices) {
    const entries = Object.entries(subIndices).filter(([, v]) => isNumber(v));
    if (!entries.length) return [];
    const max = Math.max(...entries.map(([, v]) => v));
    return entries.filter(([, v]) => v === max).map(([id]) => id);
  }

  /** Normalise an Open-Meteo response: one object, or an array of them. */
  function normalizeResponse(json) {
    if (Array.isArray(json)) return json;
    if (json && typeof json === "object") return [json];
    return [];
  }

  /** Turn one Open-Meteo location entry into the shape the UI uses. */
  function parseEntry(entry) {
    const current = (entry && entry.current) || {};
    const hourly = (entry && entry.hourly) || {};
    const sub = { us: {}, eu: {} };
    POLLUTANTS.forEach((p) => {
      sub.us[p.id] = current["us_aqi_" + p.id];
      if (p.eu) sub.eu[p.id] = current["european_aqi_" + p.id];
    });
    return {
      utcOffset: isNumber(entry && entry.utc_offset_seconds)
        ? entry.utc_offset_seconds
        : 0,
      time: typeof current.time === "string" ? current.time : null,
      us: current.us_aqi,
      eu: current.european_aqi,
      dust: current.dust,
      sub,
      hourly: {
        time: hourly.time || [],
        us: hourly.us_aqi || [],
        eu: hourly.european_aqi || [],
        dust: hourly.dust || [],
      },
    };
  }

  /** Milliseconds since epoch (UTC) of a local "YYYY-MM-DDTHH:mm" string. */
  function toUtcMs(localTime, utcOffsetSeconds) {
    return Date.parse(localTime + "Z") - utcOffsetSeconds * 1000;
  }

  /** Index of the hourly slot that contains "now" (last slot <= now). */
  function currentHourIndex(times, utcOffsetSeconds, nowMs) {
    let found = 0;
    for (let i = 0; i < times.length; i++) {
      if (toUtcMs(times[i], utcOffsetSeconds) <= nowMs) found = i;
      else break;
    }
    return found;
  }

  /** Round up to a "nice" chart maximum (1, 2, 5 x 10^k). */
  function niceCeil(value) {
    if (!isNumber(value) || value <= 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;
    const step = [1, 2, 5, 10].find((s) => normalized <= s);
    return step * magnitude;
  }

  return {
    SCALES,
    POLLUTANTS,
    levelIndex,
    pointerPercent,
    sectionWeights,
    mainPollutants,
    normalizeResponse,
    parseEntry,
    toUtcMs,
    currentHourIndex,
    niceCeil,
  };
});
