"""Retrieve Job: the app window. Choose what you are looking for, then start the search.

Double-click this file, or run: python app.py
The first start installs what the search needs (about a minute).
"""
import os
import queue
import re
import subprocess
import threading
import tkinter as tk
import venv
from pathlib import Path
from tkinter import messagebox, ttk

import settings as app_settings

HERE = Path(__file__).resolve().parent
VENV = HERE / ".venv"
PYTHON = VENV / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
REQUIREMENTS = HERE / "requirements.txt"
INSTALLED = VENV / "installed_requirements.txt"  # copy of requirements.txt at the last install
EXCEL_FILE = HERE / "results" / "jobs.xlsx"
NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)


def split_list(text: str) -> list[str]:
    return [item.strip() for item in re.split(r"[,\n]", text) if item.strip()]


def join_list(items: list[str]) -> str:
    return ", ".join(items)


class App:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.messages: queue.Queue = queue.Queue()
        self.process: subprocess.Popen | None = None
        root.title("Retrieve Job")
        root.geometry("1040x760")
        root.minsize(820, 600)

        notebook = ttk.Notebook(root)
        notebook.pack(fill="x", padx=10, pady=(10, 0))
        self.types_tab = ttk.Frame(notebook, padding=10)
        filters_tab = ttk.Frame(notebook, padding=10)
        sites_tab = ttk.Frame(notebook, padding=10)
        notebook.add(self.types_tab, text="Types de poste")
        notebook.add(filters_tab, text="Expérience, villes et filtres")
        notebook.add(sites_tab, text="Sites")
        self._build_filters(filters_tab)
        self._build_sites(sites_tab)
        self.type_rows: list[dict] = []
        self._fill_form(app_settings.load())

        bar = ttk.Frame(root, padding=(10, 8))
        bar.pack(fill="x")
        self.search_button = ttk.Button(bar, text="Préparation…", command=self.toggle_search, state="disabled")
        self.search_button.pack(side="left")
        ttk.Button(bar, text="Ouvrir les résultats", command=self.open_results).pack(side="left", padx=6)
        ttk.Button(bar, text="Enregistrer les paramètres", command=self.save_settings).pack(side="left")
        ttk.Button(bar, text="Paramètres par défaut", command=self.reset_settings).pack(side="left", padx=6)
        self.open_when_done = tk.BooleanVar(value=True)
        ttk.Checkbutton(bar, text="Ouvrir les résultats à la fin", variable=self.open_when_done).pack(side="right")

        log_frame = ttk.Frame(root, padding=(10, 0, 10, 10))
        log_frame.pack(fill="both", expand=True)
        self.log = tk.Text(log_frame, height=12, wrap="word", state="disabled", font=("Consolas", 9))
        scrollbar = ttk.Scrollbar(log_frame, command=self.log.yview)
        self.log.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")
        self.log.pack(side="left", fill="both", expand=True)

        root.protocol("WM_DELETE_WINDOW", self.close)
        root.after(100, self._poll)
        threading.Thread(target=self._prepare, daemon=True).start()

    # ---- form ----

    def _build_filters(self, tab: ttk.Frame) -> None:
        self.max_years = tk.IntVar()
        self.max_age = tk.IntVar()
        self.keep_days = tk.IntVar()
        self.max_pages = tk.IntVar()
        self.seniority = tk.StringVar()
        self.languages = tk.StringVar()
        self.cities = tk.StringVar()
        self.exclude = tk.StringVar()
        self.remote = tk.StringVar()
        fields = [
            ("Expérience maximum (années)", ttk.Spinbox(tab, from_=0, to=15, width=6, textvariable=self.max_years),
             "Chaque nouvelle offre est lue : si elle demande plus d'années, elle est écartée. "
             "Les titres « junior », « graduate », « trainee »… sont toujours gardés."),
            ("Exclure les titres de niveau", ttk.Entry(tab, textvariable=self.seniority),
             "Mots séparés par des virgules (senior, lead, director…)."),
            ("Écarter les offres qui exigent", ttk.Entry(tab, textvariable=self.languages),
             "Langues, en anglais, séparées par des virgules (greek, russian…). Une offre est écartée si "
             "elle est écrite dans cette langue ou la demande. « Greek is a plus » ne l'écarte pas."),
            ("Villes", ttk.Entry(tab, textvariable=self.cities),
             "Avec leurs autres orthographes. Les offres qui indiquent seulement « Cyprus » sont gardées. "
             "Pays : les sites proposés ne publient que des offres à Chypre."),
            ("Offres publiées depuis moins de (jours)",
             ttk.Spinbox(tab, from_=1, to=365, width=6, textvariable=self.max_age),
             "31 = un mois. Ergodotisi ne donne pas la date : ses offres sont toujours gardées."),
            ("Retirer du fichier les offres trouvées il y a plus de (jours)",
             ttk.Spinbox(tab, from_=0, to=365, width=6, textvariable=self.keep_days),
             "À chaque recherche. Les offres dont tu as rempli la colonne Statut restent. 0 = ne jamais retirer."),
            ("Autres mots exclus du titre", ttk.Entry(tab, textvariable=self.exclude),
             "Par exemple les langues que tu ne parles pas (« Russian speaking sales »…)."),
            ("Télétravail : zones acceptées", ttk.Entry(tab, textvariable=self.remote),
             "Pour RemoteOK, Jobicy et Remotive. Beaucoup d'offres sont réservées aux États-Unis."),
            ("Pages lues par site et par recherche", ttk.Spinbox(tab, from_=1, to=10, width=6,
                                                                 textvariable=self.max_pages),
             "Plus de pages = plus d'offres, mais une recherche plus longue."),
        ]
        tab.columnconfigure(1, weight=1)
        for row, (label, widget, hint) in enumerate(fields):
            ttk.Label(tab, text=label).grid(row=2 * row, column=0, sticky="w", padx=(0, 10), pady=(6, 0))
            widget.grid(row=2 * row, column=1, sticky="w" if isinstance(widget, ttk.Spinbox) else "ew",
                        pady=(6, 0))
            ttk.Label(tab, text=hint, foreground="#666", wraplength=700).grid(row=2 * row + 1, column=1, sticky="w")

    def _build_sites(self, tab: ttk.Frame) -> None:
        ttk.Label(tab, text="Sites à interroger :").pack(anchor="w", pady=(0, 4))
        sites = ttk.Frame(tab)
        sites.pack(anchor="w", fill="x")
        self.site_vars = {name: tk.BooleanVar() for name in app_settings.SITE_NAMES}
        for index, (name, label) in enumerate(app_settings.SITE_NAMES.items()):
            ttk.Checkbutton(sites, text=label, variable=self.site_vars[name]).grid(
                row=index // 2, column=index % 2, sticky="w", padx=(0, 30), pady=1)
        box = ttk.LabelFrame(tab, text="Catégories lues sur CareerFinders (toutes leurs offres sont prises, "
                                       "puis passent par les mêmes filtres)", padding=6)
        box.pack(anchor="w", fill="x", pady=(8, 0))
        self.careerfinders_vars = {name: tk.BooleanVar() for name in app_settings.CAREERFINDERS_CATEGORIES}
        for index, name in enumerate(app_settings.CAREERFINDERS_CATEGORIES):
            ttk.Checkbutton(box, text=name, variable=self.careerfinders_vars[name]).grid(
                row=index // 4, column=index % 4, sticky="w", padx=(0, 14))

    def _render_types(self, categories: list[dict]) -> None:
        for child in self.types_tab.winfo_children():
            child.destroy()
        tab = self.types_tab
        ttk.Label(tab, foreground="#666", wraplength=900, text=(
            "Chaque type de poste est une catégorie dans les résultats. « Recherches » est ce qui est tapé "
            "sur chaque site ; une offre va dans la catégorie si son titre contient un des « mots du titre ». "
            "Si un titre correspond à plusieurs types, le premier de la liste gagne. Sépare par des virgules."
        )).grid(row=0, column=0, columnspan=4, sticky="w", pady=(0, 8))
        for column, text in enumerate(["Nom", "Recherches", "Mots du titre"]):
            ttk.Label(tab, text=text, font=("Segoe UI", 9, "bold")).grid(row=1, column=column, sticky="w")
        tab.columnconfigure(1, weight=1)
        tab.columnconfigure(2, weight=2)
        self.type_rows = []
        for index, category in enumerate(categories):
            name = ttk.Entry(tab, width=22)
            name.insert(0, category["name"])
            searches = tk.Text(tab, height=3, width=30, wrap="word", font=("Segoe UI", 9))
            searches.insert("1.0", join_list(category["searches"]))
            words = tk.Text(tab, height=3, width=50, wrap="word", font=("Segoe UI", 9))
            words.insert("1.0", join_list(category["title_words"]))
            row = index + 2
            name.grid(row=row, column=0, sticky="nw", padx=(0, 6), pady=3)
            searches.grid(row=row, column=1, sticky="ew", padx=(0, 6), pady=3)
            words.grid(row=row, column=2, sticky="ew", padx=(0, 6), pady=3)
            ttk.Button(tab, text="Supprimer", command=lambda i=index: self._remove_type(i)).grid(
                row=row, column=3, sticky="n", pady=3)
            self.type_rows.append({"name": name, "searches": searches, "words": words})
        ttk.Button(tab, text="+ Ajouter un type de poste", command=self._add_type).grid(
            row=len(categories) + 2, column=0, columnspan=2, sticky="w", pady=(8, 0))

    def _types_from_form(self) -> list[dict]:
        return [{"name": row["name"].get().strip(),
                 "searches": split_list(row["searches"].get("1.0", "end")),
                 "title_words": split_list(row["words"].get("1.0", "end"))} for row in self.type_rows]

    def _add_type(self) -> None:
        self._render_types(self._types_from_form() + [{"name": "", "searches": [], "title_words": []}])

    def _remove_type(self, index: int) -> None:
        categories = self._types_from_form()
        del categories[index]
        self._render_types(categories)

    def _fill_form(self, settings: dict) -> None:
        self._render_types(settings["categories"])
        self.max_years.set(settings["max_experience_years"])
        self.max_age.set(settings["max_age_days"])
        self.keep_days.set(settings["keep_found_days"])
        self.max_pages.set(settings["max_pages"])
        self.seniority.set(join_list(settings["seniority_words"]))
        self.languages.set(join_list(settings["excluded_languages"]))
        self.cities.set(join_list(settings["cities"]))
        self.exclude.set(join_list(settings["exclude_words"]))
        self.remote.set(join_list(settings["remote_locations"]))
        for name, var in self.site_vars.items():
            var.set(settings["sources"].get(name, True))
        for name, var in self.careerfinders_vars.items():
            var.set(name in settings["careerfinders_categories"])

    def _settings_from_form(self) -> dict | None:
        settings = app_settings.load()
        try:
            settings["max_experience_years"] = int(self.max_years.get())
            settings["max_age_days"] = int(self.max_age.get())
            settings["keep_found_days"] = int(self.keep_days.get())
            settings["max_pages"] = int(self.max_pages.get())
        except (tk.TclError, ValueError):
            messagebox.showerror("Retrieve Job", "L'expérience, le nombre de jours et de pages doivent être des nombres.")
            return None
        categories = self._types_from_form()
        unnamed = [c for c in categories if not c["name"] and (c["searches"] or c["title_words"])]
        if unnamed:
            messagebox.showerror("Retrieve Job", "Donne un nom à chaque type de poste.")
            return None
        settings["categories"] = [c for c in categories if c["name"]]
        settings["seniority_words"] = split_list(self.seniority.get())
        settings["excluded_languages"] = split_list(self.languages.get())
        settings["cities"] = split_list(self.cities.get())
        settings["exclude_words"] = split_list(self.exclude.get())
        settings["remote_locations"] = split_list(self.remote.get())
        settings["sources"] = {name: var.get() for name, var in self.site_vars.items()}
        settings["careerfinders_categories"] = [name for name, var in self.careerfinders_vars.items() if var.get()]
        return settings

    def save_settings(self) -> bool:
        settings = self._settings_from_form()
        if settings is None:
            return False
        app_settings.save(settings)
        self._write(f"Paramètres enregistrés dans {app_settings.SETTINGS_FILE.name}.\n")
        return True

    def reset_settings(self) -> None:
        if messagebox.askyesno("Retrieve Job", "Remettre tous les paramètres par défaut ? "
                                               "(Ils seront enregistrés au prochain « Enregistrer » ou à la recherche.)"):
            self._fill_form(app_settings.DEFAULTS)

    # ---- search ----

    def _prepare(self) -> None:
        """Installs what the search needs, the first time and after requirements.txt changes."""
        try:
            if not PYTHON.exists():
                self.messages.put(("log", "Première utilisation : installation (environ une minute)…\n"))
                venv.create(VENV, with_pip=True)
            wanted = REQUIREMENTS.read_text(encoding="utf-8")
            if not INSTALLED.exists() or INSTALLED.read_text(encoding="utf-8") != wanted:
                self.messages.put(("log", "Installation des modules nécessaires…\n"))
                subprocess.run([PYTHON, "-m", "pip", "install", "-q", "--disable-pip-version-check",
                                "-r", REQUIREMENTS], check=True, capture_output=True, creationflags=NO_WINDOW)
                INSTALLED.write_text(wanted, encoding="utf-8")
        except (OSError, subprocess.CalledProcessError) as exc:
            self.messages.put(("log", f"L'installation a échoué ({exc}). Vérifie ta connexion internet "
                                      "et relance l'application.\n"))
            return
        self.messages.put(("ready", None))

    def toggle_search(self) -> None:
        if self.process:
            self.process.terminate()
            self._write("\nRecherche arrêtée.\n")
            return
        if not self.save_settings():
            return
        self.log.configure(state="normal")
        self.log.delete("1.0", "end")
        self.log.configure(state="disabled")
        command = [str(PYTHON), "-u", str(HERE / "retrieve_jobs.py")]
        if self.open_when_done.get():
            command.append("--open")
        self.process = subprocess.Popen(
            command, cwd=HERE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8",
            errors="replace", env={**os.environ, "PYTHONIOENCODING": "utf-8"}, creationflags=NO_WINDOW)
        self.search_button.configure(text="Arrêter la recherche")
        threading.Thread(target=self._read_output, args=(self.process,), daemon=True).start()

    def _read_output(self, process: subprocess.Popen) -> None:
        for line in process.stdout:
            self.messages.put(("log", line))
        self.messages.put(("done", process.wait()))

    def open_results(self) -> None:
        if EXCEL_FILE.exists():
            app_settings.open_file(EXCEL_FILE)
        else:
            messagebox.showinfo("Retrieve Job", "Pas encore de résultats : lance d'abord une recherche.")

    # ---- plumbing ----

    def _poll(self) -> None:
        while not self.messages.empty():
            kind, value = self.messages.get()
            if kind == "log":
                self._write(value)
            elif kind == "ready":
                self.search_button.configure(text="Lancer la recherche", state="normal")
                self._write("Prêt. Règle les paramètres puis clique sur « Lancer la recherche » "
                            "(5 à 15 minutes la première fois).\n")
            elif kind == "done":
                self.process = None
                self.search_button.configure(text="Lancer la recherche")
        self.root.after(100, self._poll)

    def _write(self, text: str) -> None:
        self.log.configure(state="normal")
        self.log.insert("end", text)
        self.log.see("end")
        self.log.configure(state="disabled")

    def close(self) -> None:
        if self.process:
            if not messagebox.askyesno("Retrieve Job", "Une recherche est en cours. L'arrêter et quitter ?"):
                return
            self.process.terminate()
        self.root.destroy()


def hide_own_console() -> None:
    """Hides the black window Windows opens on double-click, but never a terminal you started it from."""
    if os.name != "nt":
        return
    import ctypes
    kernel32 = ctypes.windll.kernel32
    if kernel32.GetConsoleProcessList((ctypes.c_uint * 2)(), 2) == 1:  # we are alone in this console
        ctypes.windll.user32.ShowWindow(kernel32.GetConsoleWindow(), 0)


if __name__ == "__main__":
    hide_own_console()
    window = tk.Tk()
    App(window)
    window.mainloop()
