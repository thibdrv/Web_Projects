/*
 * Simplified outline of Cyprus plus the projection helpers used by the
 * interactive map. Pure functions (no DOM), unit-tested with `node --test`;
 * in the browser they are exposed as the global `CyprusMap`.
 *
 * Outline: Natural Earth 1:50m land polygon (public domain), [lon, lat].
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CyprusMap = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const OUTLINE = [
    [34.463, 35.594], [33.942, 35.292], [33.908, 35.202], [33.931, 35.14],
    [34.004, 35.065], [34.024, 35.046], [34.05, 34.988], [33.937, 34.971],
    [33.822, 34.966], [33.759, 34.973], [33.699, 34.97], [33.514, 34.806],
    [33.415, 34.751], [33.297, 34.718], [33.176, 34.698], [33.116, 34.696],
    [33.062, 34.675], [33.025, 34.637], [33.024, 34.6], [33.008, 34.57],
    [32.942, 34.576], [32.914, 34.635], [32.867, 34.661], [32.75, 34.648],
    [32.693, 34.649], [32.506, 34.706], [32.449, 34.729], [32.414, 34.778],
    [32.317, 34.953], [32.301, 35.083], [32.391, 35.05], [32.475, 35.09],
    [32.556, 35.156], [32.652, 35.183], [32.713, 35.171], [32.772, 35.16],
    [32.88, 35.181], [32.926, 35.278], [32.942, 35.39], [33.123, 35.358],
    [33.308, 35.342], [33.459, 35.336], [33.608, 35.354], [34.063, 35.474],
    [34.192, 35.546], [34.272, 35.57], [34.411, 35.629], [34.556, 35.662],
  ];

  // Map frame (a little margin around the island).
  const BOUNDS = { minLon: 32.2, maxLon: 34.65, minLat: 34.5, maxLat: 35.72 };
  // Longitude shrinks with latitude: correct for it at the island's latitude.
  const LON_SCALE = Math.cos((35.1 * Math.PI) / 180);

  function pixelsPerDegree(width) {
    return width / ((BOUNDS.maxLon - BOUNDS.minLon) * LON_SCALE);
  }

  /** Pixel size of the map for a given width. */
  function size(width) {
    return {
      width,
      height: Math.round((BOUNDS.maxLat - BOUNDS.minLat) * pixelsPerDegree(width)),
    };
  }

  /** lon/lat -> pixel position {x, y}. */
  function project(lon, lat, width) {
    const k = pixelsPerDegree(width);
    return {
      x: (lon - BOUNDS.minLon) * LON_SCALE * k,
      y: (BOUNDS.maxLat - lat) * k,
    };
  }

  /** Pixel position -> {lon, lat} (inverse of project). */
  function invert(x, y, width) {
    const k = pixelsPerDegree(width);
    return {
      lon: BOUNDS.minLon + x / (LON_SCALE * k),
      lat: BOUNDS.maxLat - y / k,
    };
  }

  /** SVG path of the island for a given width. */
  function outlinePath(width) {
    return (
      OUTLINE.map(([lon, lat], i) => {
        const p = project(lon, lat, width);
        return (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1);
      }).join("") + "Z"
    );
  }

  /** Is a point on the island? (ray casting on the simplified outline) */
  function insideIsland(lon, lat) {
    let inside = false;
    for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
      const [xi, yi] = OUTLINE[i];
      const [xj, yj] = OUTLINE[j];
      const crosses =
        yi > lat !== yj > lat &&
        lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
      if (crosses) inside = !inside;
    }
    return inside;
  }

  return { OUTLINE, BOUNDS, size, project, invert, outlinePath, insideIsland };
});
