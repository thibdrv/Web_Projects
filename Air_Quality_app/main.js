(function () {
  "use strict";

  // -------------------------------------------------------------------------
  // Configuration
  // -------------------------------------------------------------------------

  // Open-Meteo Air Quality API: free for non-commercial use, HTTPS, no key.
  const API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
  const TIMEOUT_MS = 10000;
  const CACHE_KEY = "aq:v1";
  const CACHE_TTL_MS = 30 * 60 * 1000; // the model is updated far less often
  const REFRESH_CHECK_MS = 10 * 60 * 1000;
  const LANGS = ["en", "fr", "el"];

  // `label` is where the name goes next to the dot on the map (r/b/l/t).
  const CITIES = [
    { id: "nicosia", lat: 35.1856, lon: 33.3823, label: "r" },
    { id: "larnaca", lat: 34.9229, lon: 33.6233, label: "b" },
    { id: "limassol", lat: 34.6841, lon: 33.0379, label: "b" },
    { id: "ayia-napa", lat: 34.9823, lon: 34.0012, label: "r" },
    { id: "paphos", lat: 34.7754, lon: 32.4218, label: "r" },
    { id: "famagusta", lat: 35.1264, lon: 33.9419, label: "r" },
    { id: "troodos", lat: 34.9356, lon: 32.8667, label: "r" }, // Mount Olympus
  ];
  // Free points: "me" (geolocation) and "pin" (a spot picked on the map).
  const ME_ID = "me";
  const PIN_ID = "pin";
  const POINT_IDS = [ME_ID, PIN_ID];

  const POLLUTANTS = AQI.POLLUTANTS;
  const CURRENT_VARS = [
    "us_aqi",
    "european_aqi",
    "dust",
    ...POLLUTANTS.map((p) => "us_aqi_" + p.id),
    ...POLLUTANTS.filter((p) => p.eu).map((p) => "european_aqi_" + p.id),
  ];
  const HOURLY_VARS = ["us_aqi", "european_aqi", "dust"];

  // US EPA concentration at which a pollutant's sub-index reaches 100.
  const POLLUTANT_LIMITS = {
    pm2_5: { value: "35.4 µg/m³", avg: "24h" },
    pm10: { value: "154 µg/m³", avg: "24h" },
    nitrogen_dioxide: { value: "100 ppb", avg: "1h" },
    ozone: { value: "70 ppb", avg: "8h" },
    sulphur_dioxide: { value: "75 ppb", avg: "1h" },
    carbon_monoxide: { value: "9.4 ppm", avg: "8h" },
  };

  // -------------------------------------------------------------------------
  // Storage helpers (localStorage can throw in private mode: always guard it)
  // -------------------------------------------------------------------------

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* the preference simply won't persist */
    }
  }

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  const params = new URLSearchParams(location.search);

  function pickLang() {
    const wanted = [
      params.get("lang"),
      storageGet("lang"),
      ...(navigator.languages || [navigator.language]).map((l) =>
        String(l || "").slice(0, 2)
      ),
    ];
    return wanted.find((l) => LANGS.includes(l)) || "en";
  }
  function pickIndex() {
    const wanted = [params.get("index"), storageGet("index")];
    return wanted.find((i) => i === "us" || i === "eu") || "us";
  }
  function pickCity() {
    const wanted = [params.get("city"), storageGet("city")];
    return wanted.find((id) => CITIES.some((c) => c.id === id)) || CITIES[0].id;
  }

  const state = {
    lang: pickLang(),
    index: pickIndex(),
    cityId: pickCity(),
    dustOn: storageGet("dust") !== "off",
    chart: "aqi", // "aqi" | "dust"
    tab: "now", // phone layout only: "now" | "map" | "learn"
    results: {}, // id -> AQI.parseEntry(...)
    points: {}, // me / pin -> { lat, lon }, kept in memory only
    loading: true,
    fromCache: false,
    error: null, // { key, vars, retry }
    pollutantChosenByUser: false,
    levelChosenByUser: false,
  };

  // -------------------------------------------------------------------------
  // DOM references
  // -------------------------------------------------------------------------

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const els = {
    loader: $(".loader"),
    status: $(".user-information"),
    refresh: $(".refresh-button"),
    value: $(".pollution-value"),
    quality: $(".pollution-info"),
    cityName: $(".city-name"),
    advice: $(".level-advice"),
    pointer: $(".location-pointer"),
    scale: $(".scale-container"),
    legend: $(".level-legend"),
    grid: $(".pollutants"),
    list: $(".pollutant-list"),
    pollutantsPanel: $(".panel-pollutants"),
    levelList: $(".level-list"),
    dustPanel: $(".panel-dust"),
    indexPanel: $(".panel-index"),
    indexNow: $(".index-now"),
    indexHelp: $(".index-help"),
    dustBlock: $(".dust"),
    dustSwitch: $(".dust-switch"),
    dustValue: $(".dust-value"),
    dustLinks: $$(".dust-how-link, .dust-how-icon"),
    pickerWrap: $(".picker-wrap"),
    dustTab: $(".dust-tab"),
    chart: $(".chart"),
    readout: $(".chart-readout"),
    picker: $(".city-picker"),
    map: $(".map"),
    layout: $(".layout"),
    share: $(".share-button"),
    themeSwitch: $(".theme-switch"),
    formula: $(".formula"),
  };

  // -------------------------------------------------------------------------
  // Translations
  // -------------------------------------------------------------------------

  function t(key, vars) {
    const dict = I18N[state.lang] || I18N.en;
    let text = dict[key];
    if (text === undefined) text = I18N.en[key];
    if (text === undefined) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, (m, name) =>
        name in vars ? vars[name] : m
      );
    }
    return text;
  }

  function resolveKey(el, key) {
    // data-i18n-var: use the variant for the selected index ("key.us"/"key.eu")
    return "i18nVar" in el.dataset ? key + "." + state.index : key;
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.title = t("doc.title");
    $$("[data-i18n]").forEach((el) => {
      el.textContent = t(resolveKey(el, el.dataset.i18n));
    });
    $$("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(resolveKey(el, el.dataset.i18nHtml)); // trusted strings
    });
    $$("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    $$("[data-i18n-title]").forEach((el) => {
      el.title = t(el.dataset.i18nTitle);
    });
    $$(".lang-group .opt").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === state.lang));
    });
    $$(".index-group .opt").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.index === state.index));
    });
    els.formula.hidden = state.index !== "us";
  }

  // -------------------------------------------------------------------------
  // URL (shareable link) and small helpers
  // -------------------------------------------------------------------------

  function syncUrl() {
    try {
      const next = new URLSearchParams();
      if (!POINT_IDS.includes(state.cityId)) next.set("city", state.cityId);
      next.set("lang", state.lang);
      next.set("index", state.index);
      history.replaceState(null, "", "?" + next.toString());
    } catch (e) {
      /* e.g. file:// pages: sharing the URL is optional */
    }
  }

  function cityLabel(id) {
    return t("city." + id);
  }
  function currentCity() {
    return state.results[state.cityId];
  }
  function round(value) {
    return Number.isFinite(value) ? Math.round(value) : "–";
  }
  function formatDust(value) {
    if (!Number.isFinite(value)) return "–";
    return value < 10 ? value.toFixed(1) : String(Math.round(value));
  }
  function levelOf(value) {
    const idx = AQI.levelIndex(state.index, value);
    return { idx, level: idx < 0 ? null : AQI.SCALES[state.index].levels[idx] };
  }

  let hourFormatter = null;
  let hourFormatterLang = null;
  function formatHour(localTime) {
    if (!hourFormatter || hourFormatterLang !== state.lang) {
      hourFormatter = new Intl.DateTimeFormat(state.lang, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "UTC", // the string is already local wall-clock time
      });
      hourFormatterLang = state.lang;
    }
    return hourFormatter.format(new Date(localTime + "Z"));
  }

  // -------------------------------------------------------------------------
  // Static UI built from the configuration
  // -------------------------------------------------------------------------

  function buildPicker() {
    els.picker.textContent = "";
    [{ id: ME_ID }].concat(CITIES, [{ id: PIN_ID }]).forEach((city) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "city-button" + (city.id === ME_ID ? " me" : "");
      button.dataset.id = city.id;
      if (city.id === ME_ID) {
        // Small target icon: makes the geolocation chip easy to recognise.
        button.insertAdjacentHTML(
          "beforeend",
          '<svg class="pin-icon" viewBox="0 0 24 24" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>' +
            '<path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/></svg>'
        );
      }
      const name = document.createElement("span");
      name.className = "city-label";
      name.textContent = cityLabel(city.id);
      button.appendChild(name);
      if (city.id === ME_ID) button.title = t("picker.me.title");
      button.addEventListener("click", () => selectCity(city.id));
      els.picker.appendChild(button);
    });
  }

  let lastCenteredId = null;

  // On phones the picker is a horizontal strip: keep the chosen place in view.
  function centerSelectedChip() {
    const selected = els.picker.querySelector('[aria-pressed="true"]');
    if (!selected || state.cityId === lastCenteredId) return;
    lastCenteredId = state.cityId;
    if (els.picker.scrollWidth <= els.picker.clientWidth) return;
    els.picker.scrollTo({
      left: selected.offsetLeft - (els.picker.clientWidth - selected.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  function renderPicker() {
    $$(".city-button").forEach((button) => {
      const id = button.dataset.id;
      // The pinned-point button only exists once a spot has been picked.
      button.hidden = id === PIN_ID && !state.results[PIN_ID];
      button.setAttribute("aria-pressed", String(id === state.cityId));
      button.querySelector(".city-label").textContent = cityLabel(id);
      if (id === ME_ID) button.title = t("picker.me.title");

      let badge = button.querySelector(".city-aqi");
      const data = state.results[id];
      const { level } = data ? levelOf(data[state.index]) : { level: null };
      if (!level) {
        if (badge) badge.remove();
        return;
      }
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "city-aqi";
        badge.innerHTML = '<span class="city-dot"></span><span class="v"></span>';
        button.appendChild(badge);
      }
      badge.querySelector(".city-dot").style.backgroundColor = level.color;
      badge.querySelector(".v").textContent = round(data[state.index]);
    });
    centerSelectedChip();
    updatePickerHints();
  }

  function buildScale() {
    const scale = AQI.SCALES[state.index];
    const weights = AQI.sectionWeights(state.index);
    els.scale.querySelectorAll(".scale-section").forEach((el) => el.remove());
    els.legend.textContent = "";

    scale.levels.forEach((level, i) => {
      const name = t(state.index + ".level." + i);
      const last = i === scale.levels.length - 1;
      const range = last
        ? t("level.last." + state.index)
        : level.min + "–" + level.max;

      const section = document.createElement("div");
      section.className = "scale-section";
      section.style.flexGrow = String(weights[i]);
      section.style.backgroundColor = level.color;
      section.title = name + " (" + range + ")";
      els.scale.appendChild(section);

      const item = document.createElement("li");
      item.className = "level-item";
      item.innerHTML =
        '<span class="level-dot" aria-hidden="true"></span>' +
        '<span class="level-name"></span><span class="level-range"></span>';
      item.querySelector(".level-dot").style.backgroundColor = level.color;
      item.querySelector(".level-name").textContent = name;
      item.querySelector(".level-range").textContent = range;
      els.legend.appendChild(item);
    });
  }

  function setActiveLevel(activeIndex) {
    els.scale.querySelectorAll(".scale-section").forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
    });
    els.legend.querySelectorAll(".level-item").forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
    });
  }

  function buildPollutantGrid() {
    els.grid.textContent = "";
    POLLUTANTS.forEach((p) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "pollutant";
      cell.dataset.key = p.id;
      cell.innerHTML =
        '<span class="pollutant-label"></span><span class="pollutant-value">–</span>';
      cell.querySelector(".pollutant-label").textContent = p.label;
      cell.addEventListener("click", () => showPollutant(p.id));
      els.grid.appendChild(cell);
    });
  }

  function buildPollutantList() {
    const openKey = (els.list.querySelector(".pollutant-row[open]") || {})
      .dataset;
    els.list.textContent = "";

    POLLUTANTS.forEach((p) => {
      const limit = POLLUTANT_LIMITS[p.id];
      const row = document.createElement("details");
      row.className = "pollutant-row";
      row.setAttribute("name", "pollutant-row"); // only one open at a time
      row.dataset.key = p.id;
      row.innerHTML =
        "<summary>" +
        '<span class="row-label"></span><span class="row-name"></span>' +
        '<span class="row-value">–</span></summary>' +
        '<dl class="row-body">' +
        "<div><dt></dt><dd></dd></div><div><dt></dt><dd></dd></div>" +
        "<div><dt></dt><dd></dd></div>" +
        '<div class="row-limit"><dt></dt><dd></dd></div></dl>';

      row.querySelector(".row-label").textContent = p.label;
      row.querySelector(".row-name").textContent = t("pol." + p.id + ".name");
      const labels = ["row.what", "row.sources", "row.health", "row.limit"];
      const texts = [
        t("pol." + p.id + ".what"),
        t("pol." + p.id + ".source"),
        t("pol." + p.id + ".health"),
        limit.value + " · " + t("avg." + limit.avg),
      ];
      row.querySelectorAll("div").forEach((div, i) => {
        div.querySelector("dt").textContent = t(labels[i]);
        div.querySelector("dd").textContent = texts[i];
      });

      row.querySelector("summary").addEventListener("click", () => {
        state.pollutantChosenByUser = true;
      });
      row.addEventListener("toggle", () => {
        if (row.open) highlightGridCell(p.id);
      });
      els.list.appendChild(row);
    });

    if (openKey && openKey.key) openPollutantRow(openKey.key);
  }

  // "What each level means": one dropdown row per level of the chosen index.
  function buildLevelList() {
    const scale = AQI.SCALES[state.index];
    els.levelList.textContent = "";
    scale.levels.forEach((level, i) => {
      const last = i === scale.levels.length - 1;
      const range = last
        ? t("level.last." + state.index)
        : level.min + "\u2013" + level.max;
      const row = document.createElement("details");
      row.className = "level-row";
      row.setAttribute("name", "level-row"); // only one open at a time
      row.innerHTML =
        '<summary><span class="level-dot" aria-hidden="true"></span>' +
        '<span class="row-name"></span><span class="row-range"></span></summary>' +
        '<dl class="row-body"><div><dt></dt><dd></dd></div>' +
        "<div><dt></dt><dd></dd></div></dl>";
      row.querySelector(".level-dot").style.backgroundColor = level.color;
      row.querySelector(".row-name").textContent = t(state.index + ".level." + i);
      row.querySelector(".row-range").textContent = range;
      const terms = row.querySelectorAll("dt");
      const texts = row.querySelectorAll("dd");
      terms[0].textContent = t("lvl.dt.means");
      terms[1].textContent = t("lvl.dt.care");
      texts[0].textContent = t(state.index + ".lvl." + i + ".means");
      texts[1].textContent = t(state.index + ".lvl." + i + ".care");
      row.querySelector("summary").addEventListener("click", () => {
        state.levelChosenByUser = true;
      });
      els.levelList.appendChild(row);
    });
  }

  // Mark the current level and, until the visitor picks another, open it.
  function renderLevelList(city) {
    const idx = AQI.levelIndex(state.index, city ? city[state.index] : undefined);
    els.levelList.querySelectorAll(".level-row").forEach((row, i) => {
      row.classList.toggle("current", i === idx);
      if (idx >= 0 && !state.levelChosenByUser) row.open = i === idx;
    });
  }

  function highlightGridCell(key) {
    $$(".pollutant").forEach((cell) => {
      cell.setAttribute("aria-pressed", String(cell.dataset.key === key));
    });
  }

  function openPollutantRow(key) {
    $$(".pollutant-row").forEach((row) => {
      row.open = row.dataset.key === key;
    });
    highlightGridCell(key);
  }

  // Click on the left grid: open the panel and the matching row.
  function showPollutant(key) {
    state.pollutantChosenByUser = true;
    els.pollutantsPanel.open = true;
    openPollutantRow(key);
  }

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  function render() {
    const city = currentCity();
    els.loader.classList.toggle("active", !city && !state.error);
    renderPicker();
    renderMap();
    renderIndexInfo(city);
    renderHero(city);
    renderLevelList(city);
    renderPollutants(city);
    renderDust(city);
    renderChart();
    renderStatus(city);
  }

  // "US AQI or EU AQI?" panel: highlight the chosen index and show what both
  // indices say about the current place.
  function renderIndexInfo(city) {
    $$(".index-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.index === state.index);
    });
    if (!city || !Number.isFinite(city.us) || !Number.isFinite(city.eu)) {
      els.indexNow.textContent = "";
      return;
    }
    const part = (index, value) =>
      t("idx.value", {
        label: t("index." + index),
        value: Math.round(value),
        level: t(index + ".level." + AQI.levelIndex(index, value)),
      });
    els.indexNow.textContent = t("idx.now", {
      city: cityLabel(state.cityId),
      us: part("us", city.us),
      eu: part("eu", city.eu),
    });
  }

  function renderHero(city) {
    const value = city ? city[state.index] : undefined;
    const { idx, level } = levelOf(value);
    els.cityName.textContent = cityLabel(state.cityId);

    if (!level) {
      els.value.textContent = "–";
      els.quality.textContent = "–";
      els.advice.textContent = "";
      els.pointer.style.opacity = "0";
      document.documentElement.style.removeProperty("--level-color");
      setActiveLevel(-1);
      return;
    }
    els.value.textContent = round(value);
    els.quality.textContent = t(state.index + ".level." + idx);
    els.advice.textContent = t(state.index + ".advice." + idx);
    els.pointer.style.opacity = "1";
    els.pointer.style.left = AQI.pointerPercent(state.index, value) + "%";
    document.documentElement.style.setProperty("--level-color", level.color);
    setActiveLevel(idx);
  }

  function renderPollutants(city) {
    const sub = city ? city.sub[state.index] : {};
    const visible = POLLUTANTS.filter((p) => state.index === "us" || p.eu);
    els.grid.style.setProperty("--cols", String(visible.length));
    const mainIds = AQI.mainPollutants(sub);

    POLLUTANTS.forEach((p) => {
      const shown = visible.includes(p);
      const cell = els.grid.querySelector('[data-key="' + p.id + '"]');
      const row = els.list.querySelector('[data-key="' + p.id + '"]');
      const value = sub[p.id];
      cell.hidden = !shown;
      row.hidden = !shown;
      cell.querySelector(".pollutant-value").textContent = round(value);
      row.querySelector(".row-value").textContent = round(value);
      cell.classList.toggle("main", shown && mainIds.includes(p.id));
      row.classList.toggle("main", shown && mainIds.includes(p.id));
      // The EPA reference concentration only applies to the US index.
      row.querySelector(".row-limit").hidden = state.index !== "us";
    });

    // Until the visitor picks one, the open row follows the main pollutant;
    // also never leave a hidden row open (e.g. CO after switching to EU).
    const openRow = els.list.querySelector(".pollutant-row[open]");
    if (mainIds.length && (!state.pollutantChosenByUser || (openRow && openRow.hidden))) {
      openPollutantRow(mainIds[0]);
    }
  }

  function renderDust(city) {
    els.dustBlock.classList.toggle("on", state.dustOn);
    els.dustSwitch.setAttribute("aria-checked", String(state.dustOn));
    els.dustTab.hidden = !state.dustOn;
    if (!state.dustOn && state.chart === "dust") state.chart = "aqi";
    $$(".chart-tabs .opt").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.chart === state.chart));
    });
    els.dustValue.textContent = formatDust(city ? city.dust : undefined);
  }

  function renderStatus(city) {
    let text = "";
    let showRefresh = false;
    let refreshKey = "status.refresh";

    if (state.error) {
      text = t(state.error.key, state.error.vars);
      showRefresh = true;
      refreshKey = "status.retry";
    } else if (!city) {
      text = t("status.initial");
    } else if (!Number.isFinite(city[state.index])) {
      text = t("err.nodata");
      showRefresh = true;
      refreshKey = "status.retry";
    } else {
      const time = city.time ? city.time.slice(11, 16) : "";
      text = time
        ? t("status.updated", { city: cityLabel(state.cityId), time })
        : cityLabel(state.cityId);
      if (state.fromCache) text += " · " + t("status.cached");
      showRefresh = !state.loading;
    }
    if (state.loading && city) {
      text = t("status.loading", { city: cityLabel(state.cityId) });
      showRefresh = false;
    }
    els.status.textContent = text;
    els.refresh.hidden = !showRefresh;
    els.refresh.textContent = t(refreshKey);
    // Share only a named place (a shared link can't carry a free point).
    els.share.hidden = !(
      navigator.share &&
      city &&
      !state.error &&
      !state.loading &&
      !POINT_IDS.includes(state.cityId) &&
      Number.isFinite(city[state.index])
    );
  }

  // -------------------------------------------------------------------------
  // Phone layout: bottom tabs show one section at a time
  // -------------------------------------------------------------------------

  const phoneQuery = window.matchMedia("(max-width: 900px)");

  function setTab(tab) {
    state.tab = tab;
    els.layout.dataset.tab = tab;
    $$(".tab").forEach((btn) => {
      btn.setAttribute("aria-current", String(btn.dataset.tab === tab));
    });
    els.layout.scrollTop = 0;
    // The map and the chart are sized from their container, which has no size
    // while its section is hidden: redraw them now that it is visible.
    renderMap();
    renderChart();
  }

  // Arrows at the edges of the place strip show that it can be swiped, and
  // they scroll it a few places at a time when tapped.
  function updatePickerHints() {
    const p = els.picker;
    const max = p.scrollWidth - p.clientWidth;
    els.pickerWrap.classList.toggle("can-left", p.scrollLeft > 4);
    els.pickerWrap.classList.toggle("can-right", p.scrollLeft < max - 4);
  }

  function initPickerHints() {
    els.picker.addEventListener("scroll", updatePickerHints, { passive: true });
    $$(".picker-arrow").forEach((arrow) =>
      arrow.addEventListener("click", () => {
        const dir = arrow.classList.contains("picker-arrow-left") ? -1 : 1;
        els.picker.scrollBy({ left: dir * els.picker.clientWidth * 0.6, behavior: "smooth" });
      })
    );
    updatePickerHints();
  }

  // After choosing a place on the map, go back to the air quality view.
  function showResultOnPhone() {
    if (phoneQuery.matches && state.tab !== "now") {
      setTab("now");
      window.scrollTo(0, 0);
    }
  }

  function initTabs() {
    $$(".tab").forEach((btn) =>
      btn.addEventListener("click", () => {
        setTab(btn.dataset.tab);
        window.scrollTo(0, 0);
      })
    );
    setTab(state.tab);

    // Swipe left / right to move between the sections, like a native app.
    // Ignored on things that scroll or react sideways themselves.
    const order = ["now", "map", "learn"];
    let start = null;
    document.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];
        start =
          event.touches.length === 1 &&
          phoneQuery.matches &&
          !event.target.closest(".city-picker, .chart, .map, .tabbar, .opt-group")
            ? { x: touch.clientX, y: touch.clientY }
            : null;
      },
      { passive: true }
    );
    document.addEventListener(
      "touchend",
      (event) => {
        if (!start) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        start = null;
        if (Math.abs(dx) < 70 || Math.abs(dx) < 1.8 * Math.abs(dy)) return;
        const next = order.indexOf(state.tab) + (dx < 0 ? 1 : -1);
        if (next >= 0 && next < order.length) {
          setTab(order[next]);
          window.scrollTo(0, 0);
        }
      },
      { passive: true }
    );
  }

  // -------------------------------------------------------------------------
  // Map of Cyprus: pick a place, or tap anywhere on the island
  // -------------------------------------------------------------------------

  let mapWidth = 0;
  let lastMapClientWidth = 0;

  function esc(text) {
    return String(text).replace(/[&<>"]/g, (c) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderMap() {
    let W = Math.max(Math.round(els.map.clientWidth), 260);
    if (phoneQuery.matches) {
      // On phones the map must fit the screen's height too (label + hint ~ 70 px).
      const aspect = CyprusMap.size(1000).height / 1000;
      const room = els.layout.clientHeight - 70;
      if (room > 0) W = Math.max(180, Math.min(W, Math.floor(room / aspect)));
    }
    const H = CyprusMap.size(W).height;
    mapWidth = W;
    lastMapClientWidth = els.map.clientWidth;
    const { BOUNDS } = CyprusMap;

    const marker = (id, lat, lon, side, isPoint) => {
      const data = state.results[id];
      const value = data ? data[state.index] : undefined;
      const { level } = levelOf(value);
      const p = CyprusMap.project(lon, lat, W);
      const name = isPoint ? t(id === ME_ID ? "map.you" : "map.pin") : cityLabel(id);
      const text = name + (Number.isFinite(value) ? " " + Math.round(value) : "");
      const spot = {
        r: { x: p.x + 11, y: p.y + 4, a: "start" },
        l: { x: p.x - 11, y: p.y + 4, a: "end" },
        b: { x: p.x, y: p.y + 21, a: "middle" },
        t: { x: p.x, y: p.y - 14, a: "middle" },
      }[side || "r"];
      return (
        '<g class="' + (isPoint ? "map-point" : "map-place") + '" data-id="' + id +
        '" tabindex="0" role="button" aria-pressed="' + (id === state.cityId) +
        '" aria-label="' + esc(text) + '">' +
        '<circle class="map-ring" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="9"/>' +
        '<circle class="map-dot" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5" fill="' +
        (level ? level.color : "var(--muted)") + '"/>' +
        '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="21" fill="transparent"/>' +
        '<text class="map-name" x="' + spot.x.toFixed(1) + '" y="' + spot.y.toFixed(1) +
        '" text-anchor="' + spot.a + '">' + esc(text) + "</text></g>"
      );
    };

    let body = '<path class="map-land" d="' + CyprusMap.outlinePath(W) + '"/>';
    CITIES.forEach((c) => {
      body += marker(c.id, c.lat, c.lon, c.label, false);
    });
    POINT_IDS.forEach((id) => {
      const pt = state.points[id];
      const inFrame =
        pt &&
        state.results[id] &&
        pt.lon >= BOUNDS.minLon && pt.lon <= BOUNDS.maxLon &&
        pt.lat >= BOUNDS.minLat && pt.lat <= BOUNDS.maxLat;
      if (inFrame) body += marker(id, pt.lat, pt.lon, "t", true);
    });

    els.map.innerHTML =
      '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H +
      '" role="presentation">' + body + "</svg>";
  }

  function initMap() {
    els.map.addEventListener("click", (event) => {
      const marked = event.target.closest(".map-place, .map-point");
      if (marked) {
        selectCity(marked.dataset.id);
        showResultOnPhone();
        return;
      }
      if (!event.target.closest(".map-land")) return;
      // Tap on the island itself: check that exact spot.
      const rect = els.map.querySelector("svg").getBoundingClientRect();
      const ratio = mapWidth / rect.width;
      const spot = CyprusMap.invert(
        (event.clientX - rect.left) * ratio,
        (event.clientY - rect.top) * ratio,
        mapWidth
      );
      if (CyprusMap.insideIsland(spot.lon, spot.lat)) {
        pinPoint(spot.lat, spot.lon);
        showResultOnPhone();
      }
    });
    els.map.addEventListener("keydown", (event) => {
      const marked = event.target.closest(".map-place, .map-point");
      if (marked && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        selectCity(marked.dataset.id);
        showResultOnPhone();
      }
    });
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        if (els.map.clientWidth !== lastMapClientWidth) renderMap();
      }).observe(els.map);
    }
  }

  // -------------------------------------------------------------------------
  // Forecast chart (hand-drawn SVG, no library)
  // -------------------------------------------------------------------------

  let lastChartWidth = 0;
  let lastChartHeight = 0;

  function renderChart() {
    const box = els.chart;
    const city = currentCity();
    const key = state.chart === "dust" && state.dustOn ? "dust" : state.index;
    const unit = key === "dust" ? " µg/m³" : "";

    const points = [];
    if (city) {
      const times = city.hourly.time;
      const start = AQI.currentHourIndex(times, city.utcOffset, Date.now());
      for (let i = start; i < times.length; i++) {
        const v = city.hourly[key][i];
        if (Number.isFinite(v)) points.push({ time: times[i], v });
      }
    }
    if (points.length < 2) {
      box.textContent = city ? t("forecast.none") : "";
      box.removeAttribute("role");
      els.readout.textContent = "";
      return;
    }

    const W = Math.max(box.clientWidth, 260);
    // Height follows the container (shorter on small screens).
    const H = Math.max(56, Math.min(200, box.clientHeight || 130));
    const m = { l: 34, r: 8, t: 10, b: 24 };
    lastChartWidth = box.clientWidth;
    lastChartHeight = box.clientHeight;

    const values = points.map((p) => p.v);
    const floor = key === "dust" ? 10 : key === "us" ? 50 : 20;
    const ymax = AQI.niceCeil(Math.max(Math.max.apply(null, values), floor));
    const n = points.length;
    const x = (i) => m.l + (i / (n - 1)) * (W - m.l - m.r);
    const y = (v) => m.t + (1 - v / ymax) * (H - m.t - m.b);
    const pointColor = (v) => {
      if (key === "dust") return "var(--ink)";
      const { level } = levelOf(v);
      return level ? level.color : "var(--ink)";
    };

    const path = points
      .map((p, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.v).toFixed(1))
      .join("");
    const mid = Math.floor((n - 1) / 2);

    let peak = points[0];
    points.forEach((p) => {
      if (p.v > peak.v) peak = p;
    });
    const fmtValue = (v) => (key === "dust" ? formatDust(v) : String(Math.round(v)));
    const defaultReadout = t("forecast.peak", {
      value: fmtValue(peak.v) + unit,
      at: formatHour(peak.time),
    });

    box.innerHTML =
      '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="presentation">' +
      '<line class="chart-axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + (H - m.b) + '" y2="' + (H - m.b) + '"/>' +
      '<line class="chart-axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + m.t + '" y2="' + m.t + '"/>' +
      '<text x="' + (m.l - 6) + '" y="' + (m.t + 4) + '" text-anchor="end">' + ymax + "</text>" +
      '<text x="' + (m.l - 6) + '" y="' + (H - m.b + 4) + '" text-anchor="end">0</text>' +
      '<path class="chart-line" d="' + path + '"/>' +
      '<text x="' + m.l + '" y="' + (H - 6) + '">' + t("forecast.now") + "</text>" +
      '<text x="' + x(mid).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + formatHour(points[mid].time) + "</text>" +
      '<text x="' + (W - m.r) + '" y="' + (H - 6) + '" text-anchor="end">' + formatHour(points[n - 1].time) + "</text>" +
      '<circle class="chart-point" cx="' + x(0).toFixed(1) + '" cy="' + y(points[0].v).toFixed(1) + '" r="4" fill="' + pointColor(points[0].v) + '"/>' +
      '<line class="chart-cursor" visibility="hidden" y1="' + m.t + '" y2="' + (H - m.b) + '"/>' +
      '<circle class="chart-point hover" visibility="hidden" r="4"/>' +
      '<rect class="chart-hit" x="' + m.l + '" y="0" width="' + (W - m.l - m.r) + '" height="' + H + '" fill="transparent"/>' +
      "</svg>";

    box.setAttribute("role", "img");
    box.setAttribute("aria-label", t("forecast.chart") + ": " + defaultReadout);
    els.readout.textContent = defaultReadout;

    const cursor = box.querySelector(".chart-cursor");
    const dot = box.querySelector(".chart-point.hover");
    const hit = box.querySelector(".chart-hit");
    const rectLeft = () => hit.getBoundingClientRect();

    function show(event) {
      const rect = rectLeft();
      const fraction = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const i = Math.round(fraction * (n - 1));
      const p = points[i];
      const cx = x(i).toFixed(1);
      cursor.setAttribute("x1", cx);
      cursor.setAttribute("x2", cx);
      cursor.setAttribute("visibility", "visible");
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", y(p.v).toFixed(1));
      dot.setAttribute("fill", pointColor(p.v));
      dot.setAttribute("visibility", "visible");
      let text = formatHour(p.time) + " — " + fmtValue(p.v) + unit;
      if (key !== "dust") {
        const { idx } = levelOf(p.v);
        if (idx >= 0) text += " · " + t(state.index + ".level." + idx);
      }
      els.readout.textContent = text;
    }
    function hide() {
      cursor.setAttribute("visibility", "hidden");
      dot.setAttribute("visibility", "hidden");
      els.readout.textContent = defaultReadout;
    }
    hit.addEventListener("pointermove", show);
    hit.addEventListener("pointerdown", show);
    hit.addEventListener("pointerleave", hide);
  }

  // Redraw when the available width changes (window resize, layout change).
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      if (
        els.chart.clientWidth !== lastChartWidth ||
        els.chart.clientHeight !== lastChartHeight
      ) {
        renderChart();
      }
    }).observe(els.chart);
  }

  // -------------------------------------------------------------------------
  // Data: fetch, cache, refresh
  // -------------------------------------------------------------------------

  function buildUrl(locations) {
    const query = new URLSearchParams({
      latitude: locations.map((l) => l.lat).join(","),
      longitude: locations.map((l) => l.lon).join(","),
      timezone: "auto",
      forecast_days: "2",
      current: CURRENT_VARS.join(","),
      hourly: HOURLY_VARS.join(","),
    });
    return API_URL + "?" + query.toString();
  }

  async function fetchEntries(locations, controller) {
    const timer = setTimeout(() => controller.abort(new Error("timeout")), TIMEOUT_MS);
    try {
      const response = await fetch(buildUrl(locations), { signal: controller.signal });
      if (!response.ok) {
        const error = new Error("http");
        error.status = response.status;
        throw error;
      }
      const entries = AQI.normalizeResponse(await response.json());
      if (entries.length !== locations.length) {
        const error = new Error("nodata");
        error.code = "nodata";
        throw error;
      }
      return entries;
    } finally {
      clearTimeout(timer);
    }
  }

  function errorInfo(error, retry) {
    if (error && error.message === "timeout") return { key: "err.timeout", retry };
    if (error && error.status) return { key: "err.http", vars: { status: error.status }, retry };
    if (error && error.code === "nodata") return { key: "err.nodata", retry };
    return { key: "err.network", retry };
  }

  function readCache() {
    try {
      const cache = JSON.parse(storageGet(CACHE_KEY));
      const complete =
        cache &&
        typeof cache.t === "number" &&
        cache.results &&
        CITIES.every((c) => cache.results[c.id]);
      return complete ? cache : null;
    } catch (e) {
      return null;
    }
  }
  function writeCache() {
    const results = {};
    CITIES.forEach((c) => {
      results[c.id] = state.results[c.id];
    });
    storageSet(CACHE_KEY, JSON.stringify({ t: Date.now(), results }));
  }

  let citiesController = null;

  async function loadCities(force) {
    const cache = readCache();
    if (!force && cache && Date.now() - cache.t < CACHE_TTL_MS) {
      Object.assign(state.results, cache.results);
      state.fromCache = false;
      state.error = null;
      state.loading = false;
      render();
      return;
    }

    if (citiesController) citiesController.abort();
    const controller = new AbortController();
    citiesController = controller;
    state.loading = true;
    state.error = null;
    render();

    try {
      const entries = await fetchEntries(CITIES, controller);
      CITIES.forEach((c, i) => {
        state.results[c.id] = AQI.parseEntry(entries[i]);
      });
      writeCache();
      state.fromCache = false;
      state.error = null;
    } catch (error) {
      if (error && error.name === "AbortError") return; // superseded
      if (cache) {
        // Network problem: keep showing the last copy we have.
        Object.assign(state.results, cache.results);
        state.fromCache = true;
        state.error = null;
      } else {
        state.error = errorInfo(error, "cities");
      }
    } finally {
      if (citiesController === controller) {
        citiesController = null;
        state.loading = false;
        render();
      }
    }
  }

  // Geolocation: ask the browser, then load that exact point.
  function useMyLocation() {
    if (!navigator.geolocation) {
      state.error = { key: "err.geo.unsupported", retry: "geo" };
      render();
      return;
    }
    state.loading = true;
    state.error = null;
    render();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.points[ME_ID] = roundPoint(
          position.coords.latitude,
          position.coords.longitude
        );
        loadPoint(ME_ID);
      },
      (failure) => {
        state.loading = false;
        state.error = {
          key: failure.code === 1 ? "err.geo.denied" : "err.geo.failed",
          retry: "geo",
        };
        render();
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  }

  // Rounded to ~1 km: no need for more precision on an 11-45 km grid.
  function roundPoint(lat, lon) {
    return {
      lat: Math.round(lat * 100) / 100,
      lon: Math.round(lon * 100) / 100,
    };
  }

  // Pick any spot on the island with a tap on the map.
  function pinPoint(lat, lon) {
    state.points[PIN_ID] = roundPoint(lat, lon);
    loadPoint(PIN_ID);
  }

  let pointController = null;

  async function loadPoint(id) {
    if (pointController) pointController.abort();
    const controller = new AbortController();
    pointController = controller;
    state.loading = true;
    state.error = null;
    render();

    try {
      const entries = await fetchEntries([state.points[id]], controller);
      state.results[id] = AQI.parseEntry(entries[0]);
      state.cityId = id;
      state.fromCache = false;
      syncUrl();
    } catch (error) {
      if (error && error.name === "AbortError") return; // superseded
      state.error = errorInfo(error, "point");
    } finally {
      if (pointController === controller) {
        pointController = null;
        state.loading = false;
        render();
      }
    }
  }

  function refresh() {
    const retry = state.error && state.error.retry;
    if (retry === "geo") {
      useMyLocation();
    } else if (retry === "point" || (!retry && POINT_IDS.includes(state.cityId))) {
      if (state.points[state.cityId]) loadPoint(state.cityId);
      else useMyLocation();
    } else {
      loadCities(true);
    }
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  function selectCity(id) {
    if (id === ME_ID && !state.results[ME_ID]) {
      useMyLocation();
      return;
    }
    state.cityId = id;
    state.error = null;
    if (id !== ME_ID) storageSet("city", id);
    syncUrl();
    render();
  }

  function setLang(lang) {
    state.lang = lang;
    storageSet("lang", lang);
    applyI18n();
    buildPicker();
    buildScale();
    buildPollutantList();
    buildLevelList();
    syncUrl();
    render();
  }

  function setIndex(index) {
    state.index = index;
    storageSet("index", index);
    state.levelChosenByUser = false;
    applyI18n();
    buildScale();
    buildLevelList();
    syncUrl();
    render();
  }

  function initControls() {
    $$(".lang-group .opt").forEach((btn) =>
      btn.addEventListener("click", () => setLang(btn.dataset.lang))
    );
    $$(".index-group .opt").forEach((btn) =>
      btn.addEventListener("click", () => setIndex(btn.dataset.index))
    );
    $$(".chart-tabs .opt").forEach((btn) =>
      btn.addEventListener("click", () => {
        state.chart = btn.dataset.chart;
        renderDust(currentCity());
        renderChart();
      })
    );

    // Dark mode: the <head> script already set data-theme before first paint.
    const isDark = () => document.documentElement.dataset.theme === "dark";
    els.themeSwitch.setAttribute("aria-checked", String(isDark()));
    els.themeSwitch.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      els.themeSwitch.setAttribute("aria-checked", String(next === "dark"));
      const bar = document.querySelector('meta[name="theme-color"]');
      if (bar) bar.setAttribute("content", next === "dark" ? "#0b0b0b" : "#ffffff");
      storageSet("theme", next);
    });

    // Saharan dust: on by default, the choice is remembered.
    els.dustSwitch.addEventListener("click", () => {
      state.dustOn = !state.dustOn;
      storageSet("dust", state.dustOn ? "on" : "off");
      renderDust(currentCity());
      renderChart();
    });
    // "How is it calculated?" opens the matching section on the right.
    els.dustLinks.forEach((link) =>
      link.addEventListener("click", () => {
        els.dustPanel.open = true;
        if (phoneQuery.matches) {
          setTab("learn");
        }
      })
    );
    // "What does this mean?" opens the US AQI / EU AQI explanation.
    els.indexHelp.addEventListener("click", () => {
      els.indexPanel.open = true;
      if (phoneQuery.matches) {
        setTab("learn");
        window.scrollTo(0, 0);
      }
      els.indexPanel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    els.refresh.addEventListener("click", refresh);

    // Native share sheet on phones (only offered when the browser has one).
    els.share.addEventListener("click", async () => {
      const city = currentCity();
      if (!city || !navigator.share) return;
      const { idx } = levelOf(city[state.index]);
      try {
        await navigator.share({
          title: document.title,
          text: t("share.text", {
            city: cityLabel(state.cityId),
            label: t("index." + state.index),
            value: round(city[state.index]),
            level: idx >= 0 ? t(state.index + ".level." + idx) : "",
          }),
          url: location.href,
        });
      } catch (e) {
        /* cancelled by the user */
      }
    });
  }

  // The layout depends on the screen's size and orientation: redraw the parts
  // that are drawn from it (map, chart, picker arrows) when it changes.
  function initScreenFit() {
    let queued = false;
    const refit = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        renderMap();
        renderChart();
        updatePickerHints();
      });
    };
    window.addEventListener("resize", refit);
    window.addEventListener("orientationchange", refit);
  }

  // -------------------------------------------------------------------------
  // PWA: offline app shell (service worker)
  // -------------------------------------------------------------------------

  function initPwa() {
    const secure =
      location.protocol === "https:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1";
    if ("serviceWorker" in navigator && secure) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {
          /* the app works without it, just not offline */
        });
      });
    }

  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------

  applyI18n();
  buildPicker();
  buildScale();
  buildPollutantGrid();
  buildPollutantList();
  buildLevelList();
  initControls();
  initMap();
  initTabs();
  initPickerHints();
  initScreenFit();
  initPwa();
  syncUrl();
  render();
  loadCities(false);

  // Hourly values change slowly: re-check now and then and when the tab
  // becomes visible again (loadCities honours the cache lifetime).
  setInterval(() => {
    if (!document.hidden) loadCities(false);
  }, REFRESH_CHECK_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) loadCities(false);
  });
})();
