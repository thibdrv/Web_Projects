"use strict";
// Everything the visitor owns (settings, offers, statuses, offers already seen) lives in this browser.
// Scraped text is untrusted: it is only ever put on the page with textContent, never as HTML.

const HEADERS = ["Trouvée le", "Catégorie", "Titre", "Entreprise", "Ville", "Publiée", "Expérience", "Site", "Lien", "Statut"];
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

let cfg, settings, rows, checked, runId = null, timer = null;

const splitList = (text) => text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
const joinList = (items) => (items || []).join(", ");

// ---- form ----

const FIELDS = [
  ["max_experience_years", "Expérience maximum (années)", "number", 0, 15,
    "Chaque nouvelle offre est lue : si elle demande plus d'années, elle est écartée. Les titres « junior », « graduate », « trainee »… sont toujours gardés."],
  ["seniority_words", "Exclure les titres de niveau", "list", 0, 0, "Mots séparés par des virgules (senior, lead, director…)."],
  ["excluded_languages", "Écarter les offres qui exigent", "list", 0, 0,
    "Langues, en anglais, séparées par des virgules (greek, russian…). « Greek is a plus » ne l'écarte pas."],
  ["cities", "Villes", "list", 0, 0,
    "Avec leurs autres orthographes. Les offres qui indiquent seulement « Cyprus » sont gardées."],
  ["max_age_days", "Offres publiées depuis moins de (jours)", "number", 1, 365,
    "31 = un mois. Ergodotisi ne donne pas la date : ses offres sont toujours gardées."],
  ["keep_found_days", "Retirer les offres trouvées il y a plus de (jours)", "number", 0, 365,
    "Les offres dont tu as rempli la colonne Statut restent. 0 = ne jamais retirer."],
  ["exclude_words", "Autres mots exclus du titre", "list", 0, 0, "Par exemple les langues que tu ne parles pas."],
  ["remote_locations", "Télétravail : zones acceptées", "list", 0, 0, "Pour RemoteOK, Jobicy et Remotive."],
  ["max_pages", "Pages lues par site et par recherche (1 à 5)", "number", 1, 5,
    "Plus de pages = plus d'offres, mais une recherche plus longue."],
];

function renderTypes(categories) {
  const box = $("#tab-types");
  box.replaceChildren(
    h("p", { class: "hint", text: "Chaque type de poste est une catégorie dans les résultats. « Recherches » est ce qui est tapé sur chaque site ; " +
      "une offre va dans la catégorie si son titre contient un des « mots du titre ». Si un titre correspond à plusieurs types, " +
      "le premier gagne. Sépare par des virgules. 12 recherches au maximum en tout." }));
  categories.forEach((cat, index) => {
    box.append(h("div", { class: "type", "data-type": "" },
      h("input", { type: "text", class: "t-name", placeholder: "Nom", value: cat.name, "aria-label": "Nom" }),
      h("textarea", { class: "t-searches", placeholder: "Recherches", "aria-label": "Recherches", text: joinList(cat.searches) }),
      h("textarea", { class: "t-words", placeholder: "Mots du titre", "aria-label": "Mots du titre", text: joinList(cat.title_words) }),
      h("button", { type: "button", text: "Supprimer", onclick: () => { removeType(index); } })));
  });
  box.append(h("p", {}, h("button", { type: "button", text: "+ Ajouter un type de poste", onclick: addType })));
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
  for (const [key, label, kind, low, high, hint] of FIELDS) {
    const input = kind === "number"
      ? h("input", { type: "number", id: `f-${key}`, min: low, max: high, value: settings[key] })
      : h("input", { type: "text", id: `f-${key}`, value: joinList(settings[key]) });
    box.append(h("label", { for: `f-${key}`, text: label }), input, h("div", { class: "hint", text: hint }));
  }
}

function renderSites() {
  const box = $("#tab-sites");
  const sites = h("div", { class: "checks" });
  for (const [name, label] of Object.entries(cfg.sites)) {
    sites.append(h("label", {}, h("input", { type: "checkbox", "data-site": name, checked: settings.sources[name] !== false }), label));
  }
  const categories = h("div", { class: "checks" });
  for (const name of cfg.careerfinders) {
    categories.append(h("label", {}, h("input", { type: "checkbox", "data-cf": name,
      checked: settings.careerfinders_categories.includes(name) }), name));
  }
  box.replaceChildren(h("div", { class: "hint", text: "Sites à interroger :" }), sites,
    h("fieldset", {}, h("legend", { text: "Catégories lues sur CareerFinders (toutes leurs offres, puis les mêmes filtres)" }), categories));
}

function readForm() {
  const next = { ...settings, categories: typesFromForm().filter((c) => c.name) };
  for (const [key, , kind, low, high] of FIELDS) {
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
  box.textContent = text || "";
  box.classList.toggle("error", isError);
}

function log(text, reset = false) {
  const box = $("#log");
  box.hidden = false;
  box.textContent = reset ? text : box.textContent + text;
  box.scrollTop = box.scrollHeight;
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
  select.replaceChildren(h("option", { value: "", text: "Toutes les catégories" }),
    ...categories.map((c) => h("option", { value: c, text: c })));
  select.value = categories.includes(wanted) ? wanted : "";

  const text = $("#filter-text").value.trim().toLowerCase();
  const category = select.value;
  const shown = rows.filter((r) => (!category || r["Catégorie"] === category)
    && (!text || ["Titre", "Entreprise", "Ville", "Site"].some((k) => (r[k] || "").toLowerCase().includes(text))));
  $("#count").textContent = shown.length === rows.length ? `(${rows.length})` : `(${shown.length} sur ${rows.length})`;

  const table = $("#table");
  table.replaceChildren(h("thead", {}, h("tr", {}, ...HEADERS.map((name) => h("th", { text: name })))));
  const body = h("tbody");
  for (const row of shown) {
    const tr = h("tr", { class: row._new ? "new" : "" });
    for (const name of HEADERS) {
      const td = h("td");
      if (name === "Lien") {
        if (/^https?:\/\//i.test(row[name] || "")) td.append(h("a", { href: row[name], target: "_blank", rel: "noopener noreferrer", text: "Ouvrir" }));
      } else if (name === "Statut") {
        td.append(h("input", { type: "text", value: row[name] || "", maxlength: 60, "aria-label": "Statut",
          onchange: (event) => { row["Statut"] = event.target.value.trim(); saveRows(); } }));
      } else {
        td.textContent = row[name] || "";
      }
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(body);
}

// ---- search ----

function setBusy(busy) {
  const button = $("#search");
  button.textContent = busy ? "Arrêter la recherche" : "Lancer la recherche";
  button.dataset.busy = busy ? "1" : "";
}

async function startSearch() {
  save();
  notice("");
  const response = await fetch("/api/search", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings, rows, checked }),
  }).catch(() => null);
  if (!response) return notice("Le serveur ne répond pas. S'il était en veille, réessaie dans une minute.", true);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) return notice(body.error || "La recherche n'a pas pu démarrer.", true);
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
      const response = await fetch(`/api/runs/${runId}?since=${since}`);
      if (response.status === 404) { finish(); return notice("Cette recherche a expiré : relance-la.", true); }
      body = await response.json();
    } catch {
      if (failures >= 5) { finish(); return notice("Connexion perdue avec le serveur. Relance la recherche.", true); }
      return follow(since, failures + 1);
    }
    if (body.lines.length) log(body.lines.join("\n") + "\n");
    if (body.status === "running") return follow(body.next);
    finish();
    if (body.status === "done") return applyResult(body.result);
    if (body.status === "error") return notice(body.error || "La recherche a échoué.", true);
    notice("Recherche arrêtée. Rien n'a été ajouté.");
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
  let message = `${result.new_count} nouvelle(s) offre(s) ajoutée(s), ${rows.length} au total.`;
  if (result.expired) message += ` ${result.expired} ancienne(s) retirée(s).`;
  if (result.failed.length) message += ` ${result.failed.length} recherche(s) en erreur : ${result.failed.join(", ")}.`;
  notice(message);
  $("#results").scrollIntoView({ behavior: "smooth" });
}

async function stopSearch() {
  if (runId) await fetch(`/api/runs/${runId}/cancel`, { method: "POST" }).catch(() => {});
}

// ---- file ----

async function download() {
  const response = await fetch("/api/xlsx", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows }),
  }).catch(() => null);
  if (!response || !response.ok) return notice("Le fichier n'a pas pu être créé.", true);
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
  const response = await fetch("/api/import", { method: "POST", body: data }).catch(() => null);
  const body = response ? await response.json().catch(() => ({})) : {};
  if (!response || !response.ok) return notice(body.error || "Import impossible.", true);
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
  notice(`${added} offre(s) importée(s).`);
}

// ---- start ----

async function main() {
  cfg = await (await fetch("/api/config")).json();
  settings = { ...cfg.defaults, ...store.get("rj.settings", {}) };
  rows = store.get("rj.rows", []);
  checked = store.get("rj.checked", []);
  renderForm();
  renderTable();

  document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    for (const name of ["types", "filters", "sites"]) $(`#tab-${name}`).hidden = name !== tab.dataset.tab;
  }));
  $("#form").addEventListener("submit", (event) => event.preventDefault());
  $("#form").addEventListener("change", save);
  $("#form").addEventListener("input", save);
  $("#search").addEventListener("click", () => ($("#search").dataset.busy ? stopSearch() : startSearch()));
  $("#download").addEventListener("click", download);
  $("#import-button").addEventListener("click", () => $("#import").click());
  $("#import").addEventListener("change", (event) => { importFile(event.target.files[0]); event.target.value = ""; });
  $("#reset").addEventListener("click", () => {
    if (!confirm("Remettre tous les paramètres par défaut ?")) return;
    settings = JSON.parse(JSON.stringify(cfg.defaults));
    store.set("rj.settings", settings);
    renderForm();
  });
  $("#wipe").addEventListener("click", () => {
    if (!confirm("Effacer les réglages, les offres et les statuts gardés dans ce navigateur ? (Télécharge d'abord le fichier si tu veux le garder.)")) return;
    ["rj.settings", "rj.rows", "rj.checked"].forEach((key) => store.remove(key));
    settings = JSON.parse(JSON.stringify(cfg.defaults));
    rows = []; checked = [];
    renderForm(); renderTable(); notice("Données effacées.");
  });
  $("#filter-text").addEventListener("input", renderTable);
  $("#filter-category").addEventListener("change", renderTable);

  const resumed = sessionStorage.getItem("rj.run");
  if (resumed) { runId = resumed; log("", true); follow(0); }
}

main().catch(() => notice("L'application n'a pas pu démarrer. Recharge la page.", true));
