"use strict";
// Everything the visitor owns (settings, offers, statuses, offers already seen) lives in this browser.
// Scraped text is untrusted: it is only ever put on the page with textContent, never as HTML.
// The texts of the page are in i18n.js (French and English).

const HEADERS = ["Trouvée le", "Catégorie", "Titre", "Entreprise", "Ville", "Publiée", "Expérience", "Site", "Lien", "Statut"];
const HEADER_KEYS = ["found", "category", "title", "company", "city", "posted", "experience", "site", "link", "status"];
const MAX_CHECKED = 20000;

const $ = (selector) => document.querySelector(selector);

function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else if (value !== false && value !== null && value !== undefined) node.setAttribute(key, value === true ? "" : value);
  }
  node.append(...children);
  return node;
}

const store = {
  get(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: nothing is kept */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
};

let cfg, settings, rows, checked, runId = null, timer = null, busy = false, lastLog = "";

const splitList = (text) => text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
const joinList = (items) => (items || []).join(", ");
const apiUrl = (path, extra = "") => `${path}?lang=${LANG}${extra}`;

// ---- language ----

function detectLanguage() {
  const saved = store.get("rj.lang", null);
  if (saved === "fr" || saved === "en") return saved;
  return (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
}

function applyStatic() {
  document.documentElement.lang = LANG;
  document.title = t("page_title");
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.lang === LANG ? "true" : "false");
  });
  setBusy(busy);
}

function setLanguage(lang) {
  if (lang === LANG) return;
  save();                      // keep what is typed in the form before it is drawn again
  LANG = lang;
  store.set("rj.lang", lang);
  applyStatic();
  renderForm();
  renderTable();
  notice("");
  if (cfg.contact) $("#contact-link").href = mailtoLink();
}

// ---- form ----

const FIELDS = [
  ["max_experience_years", "number", 0, 15],
  ["seniority_words", "list"],
  ["excluded_languages", "list"],
  ["cities", "list"],
  ["max_age_days", "number", 1, 365],
  ["keep_found_days", "number", 0, 365],
  ["exclude_words", "list"],
  ["remote_locations", "list"],
  ["max_pages", "number", 1, 5],
];

function renderTypes(categories) {
  const box = $("#tab-types");
  box.replaceChildren(h("p", { class: "hint", text: t("types_hint") }));
  categories.forEach((cat, index) => {
    box.append(h("div", { class: "type", "data-type": "" },
      h("input", { type: "text", class: "t-name", placeholder: t("ph_name"), value: cat.name, "aria-label": t("ph_name") }),
      h("textarea", { class: "t-searches", placeholder: t("ph_searches"), "aria-label": t("ph_searches"), text: joinList(cat.searches) }),
      h("textarea", { class: "t-words", placeholder: t("ph_words"), "aria-label": t("ph_words"), text: joinList(cat.title_words) }),
      h("button", { type: "button", text: t("remove"), onclick: () => { removeType(index); } })));
  });
  box.append(h("p", {}, h("button", { type: "button", text: t("add_type"), onclick: addType })));
}

function typesFromForm() {
  return [...document.querySelectorAll("[data-type]")].map((row) => ({
    name: row.querySelector(".t-name").value.trim(),
    searches: splitList(row.querySelector(".t-searches").value),
    title_words: splitList(row.querySelector(".t-words").value),
  }));
}
function addType() { renderTypes([...typesFromForm(), { name: "", searches: [], title_words: [] }]); }
function removeType(index) { const list = typesFromForm(); list.splice(index, 1); renderTypes(list); save(); }

function renderFilters() {
  const box = $("#tab-filters");
  box.replaceChildren();
  for (const [key, kind, low, high] of FIELDS) {
    const input = kind === "number"
      ? h("input", { type: "number", id: `f-${key}`, min: low, max: high, value: settings[key] })
      : h("input", { type: "text", id: `f-${key}`, value: joinList(settings[key]) });
    box.append(h("label", { for: `f-${key}`, text: t(`f_${key}_label`) }), input,
      h("div", { class: "hint", text: t(`f_${key}_hint`) }));
  }
}

function renderSites() {
  const box = $("#tab-sites");
  const sites = h("div", { class: "checks" });
  for (const [name, label] of Object.entries(cfg.sites)) {
    const text = I18N.fr[`site_${name}`] ? t(`site_${name}`) : label;
    sites.append(h("label", {}, h("input", { type: "checkbox", "data-site": name, checked: settings.sources[name] !== false }), text));
  }
  const categories = h("div", { class: "checks" });
  for (const name of cfg.careerfinders) {
    categories.append(h("label", {}, h("input", { type: "checkbox", "data-cf": name,
      checked: settings.careerfinders_categories.includes(name) }), name));
  }
  box.replaceChildren(h("div", { class: "hint", text: t("sites_intro") }), sites,
    h("fieldset", {}, h("legend", { text: t("cf_legend") }), categories));
}

function readForm() {
  const next = { ...settings, categories: typesFromForm().filter((c) => c.name) };
  for (const [key, kind, low, high] of FIELDS) {
    const raw = $(`#f-${key}`).value;
    if (kind === "number") {
      const value = parseInt(raw, 10);
      next[key] = Number.isNaN(value) ? cfg.defaults[key] : Math.min(high, Math.max(low, value));
    } else {
      next[key] = splitList(raw);
    }
  }
  next.sources = {};
  document.querySelectorAll("[data-site]").forEach((box) => { next.sources[box.dataset.site] = box.checked; });
  next.careerfinders_categories = [...document.querySelectorAll("[data-cf]")].filter((b) => b.checked).map((b) => b.dataset.cf);
  return next;
}

function renderForm() { renderTypes(settings.categories); renderFilters(); renderSites(); }
function save() { settings = readForm(); store.set("rj.settings", settings); }

// ---- messages ----

function notice(text, isError = false) {
  const box = $("#notice");
  box.hidden = !text;
  box.textContent = text ? (isError && cfg && cfg.contact ? `${text} ${t("contact_hint")}` : text) : "";
  box.classList.toggle("error", isError);
}

function log(text, reset = false) {
  const box = $("#log");
  box.hidden = false;
  box.textContent = reset ? text : box.textContent + text;
  box.scrollTop = box.scrollHeight;
  lastLog = box.textContent;
}

// ---- contact ----

function mailtoLink() {
  const lines = lastLog.trim().split("\n").filter(Boolean).slice(-8).join("\n");
  const body = t("mail_body", {
    lang: LANG,
    browser: (navigator.userAgent || "").slice(0, 150),
    log: (lines || t("mail_no_log")).slice(-700),
  });
  return `mailto:${cfg.contact}?subject=${encodeURIComponent(t("mail_subject"))}&body=${encodeURIComponent(body)}`;
}

function setupContact() {
  if (!cfg.contact) return;  // no address configured on the server: no Contact section
  $("#contact").hidden = false;
  $("#nav-contact").hidden = false;
  const link = $("#contact-link");
  link.href = mailtoLink();
  link.addEventListener("click", () => { link.href = mailtoLink(); });  // with the latest journal lines
}

// ---- results ----

function saveRows() { store.set("rj.rows", rows); store.set("rj.checked", checked); }

function renderTable() {
  $("#results").hidden = rows.length === 0;
  $("#download").disabled = rows.length === 0;
  if (!rows.length) return;
  const select = $("#filter-category");
  const wanted = select.value;
  const categories = [...new Set(rows.map((r) => r["Catégorie"]).filter(Boolean))].sort();
  select.replaceChildren(h("option", { value: "", text: t("all_categories") }),
    ...categories.map((c) => h("option", { value: c, text: c })));
  select.value = categories.includes(wanted) ? wanted : "";

  const text = $("#filter-text").value.trim().toLowerCase();
  const category = select.value;
  const shown = rows.filter((r) => (!category || r["Catégorie"] === category)
    && (!text || ["Titre", "Entreprise", "Ville", "Site"].some((k) => (r[k] || "").toLowerCase().includes(text))));
  $("#count").textContent = shown.length === rows.length ? `(${rows.length})` : t("count_of", { shown: shown.length, total: rows.length });

  const table = $("#table");
  table.replaceChildren(h("thead", {}, h("tr", {}, ...HEADER_KEYS.map((key) => h("th", { text: t(`th_${key}`) })))));
  const body = h("tbody");
  for (const row of shown) {
    const tr = h("tr", { class: row._new ? "new" : "" });
    for (const name of HEADERS) {
      const td = h("td");
      if (name === "Lien") {
        if (/^https?:\/\//i.test(row[name] || "")) td.append(h("a", { href: row[name], target: "_blank", rel: "noopener noreferrer", text: t("open_link") }));
      } else if (name === "Statut") {
        td.append(h("input", { type: "text", value: row[name] || "", maxlength: 60, "aria-label": t("aria_status"),
          onchange: (event) => { row["Statut"] = event.target.value.trim(); saveRows(); } }));
      } else {
        td.textContent = displayValue(name, row[name] || "");
      }
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(body);
}

// ---- search ----

function setBusy(value) {
  busy = value;
  const button = $("#search");
  button.textContent = busy ? t("btn_stop") : t("btn_search");
  button.dataset.busy = busy ? "1" : "";
}

async function startSearch() {
  save();
  notice("");
  const response = await fetch(apiUrl("/api/search"), {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings, rows, checked }),
  }).catch(() => null);
  if (!response) return notice(t("n_server_down"), true);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) return notice(body.error || t("n_cannot_start"), response.status !== 429);  // 429: just wait
  runId = body.id;
  sessionStorage.setItem("rj.run", runId);
  log("", true);
  follow(0);
}

function follow(since, failures = 0) {
  setBusy(true);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    let body;
    try {
      const response = await fetch(apiUrl(`/api/runs/${runId}`, `&since=${since}`));
      if (response.status === 404) { finish(); return notice(t("n_expired"), true); }
      body = await response.json();
    } catch {
      if (failures >= 5) { finish(); return notice(t("n_lost"), true); }
      return follow(since, failures + 1);
    }
    if (body.lines.length) log(body.lines.join("\n") + "\n");
    if (body.status === "running") return follow(body.next);
    finish();
    if (body.status === "done") return applyResult(body.result);
    if (body.status === "error") return notice(body.error || t("n_failed"), true);
    notice(t("n_stopped"));
  }, 1500);
}

function finish() {
  setBusy(false);
  runId = null;
  sessionStorage.removeItem("rj.run");
}

function applyResult(result) {
  rows = result.rows;
  checked = [...new Set([...checked, ...result.checked])].slice(-MAX_CHECKED);
  saveRows();
  renderTable();
  let message = t("n_summary", { new: result.new_count, total: rows.length });
  if (result.expired) message += t("n_old_removed", { count: result.expired });
  if (result.failed.length) message += t("n_failed_searches", { count: result.failed.length, list: result.failed.join(", ") });
  notice(message);
  $("#results").scrollIntoView({ behavior: "smooth" });
}

async function stopSearch() {
  if (runId) await fetch(apiUrl(`/api/runs/${runId}/cancel`), { method: "POST" }).catch(() => {});
}

// ---- file ----

async function download() {
  const response = await fetch(apiUrl("/api/xlsx"), {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows }),
  }).catch(() => null);
  if (!response || !response.ok) return notice(t("n_file_failed"), true);
  const url = URL.createObjectURL(await response.blob());
  const link = h("a", { href: url, download: "jobs.xlsx" });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

async function importFile(file) {
  if (!file) return;
  const data = new FormData();
  data.append("file", file);
  const response = await fetch(apiUrl("/api/import"), { method: "POST", body: data }).catch(() => null);
  const body = response ? await response.json().catch(() => ({})) : {};
  if (!response || !response.ok) return notice(body.error || t("n_import_failed"), true);
  const known = new Map(rows.map((r) => [r["Lien"], r]));
  let added = 0;
  for (const row of body.rows) {
    const mine = known.get(row["Lien"]);
    if (!mine) { rows.push({ ...row, _new: false }); added++; }
    else if (!mine["Statut"] && row["Statut"]) mine["Statut"] = row["Statut"];
  }
  checked = [...new Set([...checked, ...body.rows.map((r) => r["Lien"]).filter(Boolean)])].slice(-MAX_CHECKED);
  rows.sort((a, b) => (b["Trouvée le"] || "").localeCompare(a["Trouvée le"] || ""));
  saveRows();
  renderTable();
  notice(t("n_imported", { count: added }));
}

// ---- start ----

async function main() {
  LANG = detectLanguage();
  cfg = await (await fetch("/api/config")).json();
  settings = { ...cfg.defaults, ...store.get("rj.settings", {}) };
  rows = store.get("rj.rows", []);
  checked = store.get("rj.checked", []);
  applyStatic();
  renderForm();
  renderTable();
  setupContact();

  document.querySelectorAll(".lang-btn").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((other) => other.classList.toggle("active", other === tab));
    for (const name of ["types", "filters", "sites"]) $(`#tab-${name}`).hidden = name !== tab.dataset.tab;
  }));
  $("#form").addEventListener("submit", (event) => event.preventDefault());
  $("#form").addEventListener("change", save);
  $("#form").addEventListener("input", save);
  $("#search").addEventListener("click", () => (busy ? stopSearch() : startSearch()));
  $("#download").addEventListener("click", download);
  $("#import-button").addEventListener("click", () => $("#import").click());
  $("#import").addEventListener("change", (event) => { importFile(event.target.files[0]); event.target.value = ""; });
  $("#reset").addEventListener("click", () => {
    if (!confirm(t("confirm_reset"))) return;
    settings = JSON.parse(JSON.stringify(cfg.defaults));
    store.set("rj.settings", settings);
    renderForm();
  });
  $("#wipe").addEventListener("click", () => {
    if (!confirm(t("confirm_wipe"))) return;
    ["rj.settings", "rj.rows", "rj.checked"].forEach((key) => store.remove(key));
    settings = JSON.parse(JSON.stringify(cfg.defaults));
    rows = []; checked = [];
    renderForm(); renderTable(); notice(t("n_wiped"));
  });
  $("#filter-text").addEventListener("input", renderTable);
  $("#filter-category").addEventListener("change", renderTable);

  const resumed = sessionStorage.getItem("rj.run");
  if (resumed) { runId = resumed; log("", true); follow(0); }
}

main().catch(() => {
  document.body.prepend(h("p", { class: "notice error", text: t("n_start_failed") }));
});
