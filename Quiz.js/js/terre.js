/* ============================================================
   Fond animé : la Terre vue depuis l'orbite basse, comme sur les photos
   prises depuis l'ISS par les astronautes de l'ESA.

   Tout est calculé en direct par la carte graphique (WebGL), sans image :
   continents avec relief, océans, nuages et leurs ombres, lumières des villes
   côté nuit, atmosphère en couches, aurore, étoiles, et un lever de soleil
   qui revient toutes les ~105 s.

   Si WebGL n'est pas disponible, la photo de nébuleuse (.fond) reste affichée.
   ============================================================ */
(() => {
  "use strict";

  const canvas = document.getElementById("terre");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
    || canvas.getContext("experimental-webgl");
  if (!gl) return;

  const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VERTEX = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAGMENT = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    uniform vec2 uRes;
    uniform float uTime;

    /* ---------- bruit ---------- */
    float hash13(vec3 p3) {
      p3 = fract(p3 * 0.1031);
      p3 += dot(p3, p3.zyx + 31.32);
      return fract((p3.x + p3.y) * p3.z);
    }
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    float vnoise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash13(i);
      float b = hash13(i + vec3(1.0, 0.0, 0.0));
      float c = hash13(i + vec3(0.0, 1.0, 0.0));
      float d = hash13(i + vec3(1.0, 1.0, 0.0));
      float e = hash13(i + vec3(0.0, 0.0, 1.0));
      float g = hash13(i + vec3(1.0, 0.0, 1.0));
      float h = hash13(i + vec3(0.0, 1.0, 1.0));
      float k = hash13(i + vec3(1.0, 1.0, 1.0));
      return mix(mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
                 mix(mix(e, g, f.x), mix(h, k, f.x), f.y), f.z);
    }
    float fbm5(vec3 p) {
      float a = 0.5; float s = 0.0;
      for (int i = 0; i < 5; i++) {
        s += a * vnoise(p);
        p = p * 2.03 + vec3(1.7, 9.2, 3.1);
        a *= 0.5;
      }
      return s / 0.96875;
    }
    float fbm3(vec3 p) {
      float a = 0.5; float s = 0.0;
      for (int i = 0; i < 3; i++) {
        s += a * vnoise(p);
        p = p * 2.03 + vec3(1.7, 9.2, 3.1);
        a *= 0.5;
      }
      return s / 0.875;
    }

    vec3 rotAxis(vec3 v, vec3 k, float a) {
      float c = cos(a);
      float s = sin(a);
      return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
    }

    /* ---------- ciel : voie lactée fine + étoiles de différentes magnitudes ---------- */
    vec3 space(vec2 p, vec2 frag) {
      vec3 c = vec3(0.002, 0.005, 0.014);

      float band = exp(-pow((dot(p, vec2(0.45, 0.89)) - 0.75) * 2.0, 2.0));
      float mw = vnoise(vec3(p * 6.0, 3.0)) * 0.5 + vnoise(vec3(p * 18.0, 8.0)) * 0.3 + vnoise(vec3(p * 55.0, 5.0)) * 0.2;
      c += vec3(0.030, 0.038, 0.060) * band * smoothstep(0.40, 0.85, mw) * 0.7;

      for (int layer = 0; layer < 3; layer++) {
        float size = layer == 0 ? 85.0 : (layer == 1 ? 150.0 : 260.0);
        float seuil = layer == 2 ? 0.93 : 0.962;
        vec2 g = (frag + vec2(uTime * 0.0015, 0.0)) * size;
        vec2 id = floor(g) + float(layer) * 37.0;
        vec2 f = fract(g) - 0.5;
        float rnd = hash12(id);
        vec2 off = (vec2(hash12(id + 7.1), hash12(id + 13.3)) - 0.5) * 0.7;
        float dd = length(f - off);
        float twinkle = 0.75 + 0.25 * sin(uTime * (1.5 + rnd * 2.0) + rnd * 60.0);
        float star = step(seuil, rnd) * smoothstep(0.20, 0.0, dd) * ((rnd - seuil) / (1.0 - seuil) + 0.2) * twinkle;
        vec3 tint = mix(vec3(0.72, 0.84, 1.0), vec3(1.0, 0.86, 0.68), hash12(id + 3.7));
        c += tint * star * (layer == 0 ? 1.0 : (layer == 1 ? 0.7 : 0.35));
      }
      return c;
    }

    void main() {
      float aspect = uRes.x / uRes.y;
      vec2 frag = gl_FragCoord.xy / uRes.y;
      vec2 p = vec2(frag.x - 0.5 * aspect, frag.y);

      // La planète est un très grand disque dont on ne voit que le bord supérieur (l'horizon)
      float R = clamp(1.1 * aspect + 0.35, 1.0, 2.4);
      vec2 c = vec2(0.0, 0.40 - R);
      vec2 d = p - c;
      float r = length(d);

      // Direction du soleil : tourne lentement (cycle jour / terminateur / nuit / lever de soleil)
      float th = 2.4 + uTime * 0.06;
      vec3 S = normalize(vec3(0.16 * sin(th * 0.5), sin(th), cos(th)));

      vec3 col;
      float limb = r - R;

      if (limb > 0.0) {
        /* ----- espace + atmosphère vue de profil ----- */
        col = space(p, frag);
        vec3 nl = vec3(normalize(d), 0.0);
        float sunSide = dot(nl, S);
        float lit = smoothstep(-0.30, 0.45, sunSide);
        float tw = exp(-pow(sunSide * 3.0, 2.0));

        // trois couches : un filet clair au ras du sol, un bleu intense, puis un halo large
        // (au lever du soleil : orange et rouge à la base, comme sur les photos de l'ISS)
        float fin = exp(-limb * 190.0);
        float moyen = exp(-limb * 48.0);
        float large = exp(-limb * 13.0);
        vec3 cFin = mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.38), tw * 0.9);
        vec3 cMoyen = mix(vec3(0.20, 0.50, 1.0), vec3(1.0, 0.38, 0.12), tw * 0.7);
        vec3 cLarge = vec3(0.04, 0.14, 0.45);
        col += (cFin * fin + cMoyen * moyen * 0.55 + cLarge * large * 0.5) * (0.04 + lit);

        // côté nuit : lueur verdâtre de la haute atmosphère (airglow) et aurore
        float nuit = 1.0 - lit;
        float lueur = exp(-pow((limb - 0.010) * 110.0, 2.0));
        col += vec3(0.10, 0.45, 0.20) * lueur * nuit * 0.13;

        float zone = smoothstep(0.40, 0.75, vnoise(vec3(p.x * 2.2 + uTime * 0.02, 1.0, 4.0)));
        float rideau = smoothstep(0.0, 0.012, limb) * exp(-limb * 20.0);
        float stries = 0.5 + 0.5 * vnoise(vec3(p.x * 70.0 + sin(uTime * 0.25 + p.x * 5.0) * 2.0, uTime * 0.25, 2.0));
        vec3 cAurore = mix(vec3(0.20, 1.0, 0.55), vec3(0.55, 0.25, 1.0), smoothstep(0.03, 0.13, limb));
        col += cAurore * rideau * stries * zone * nuit * nuit * 0.5;
      } else {
        /* ----- surface de la Terre ----- */
        vec3 n = vec3(d / R, sqrt(max(1.0 - dot(d, d) / (R * R), 0.0)));
        vec3 k = normalize(vec3(1.0, 0.35, 0.0));      // axe de rotation
        float ang = uTime * 0.014;
        vec3 P  = rotAxis(n, k, -ang);                  // sol : défile de l'horizon vers nous
        vec3 Pc = rotAxis(n, k, -ang * 1.35 - 0.5);     // nuages : un peu plus vite que le sol
        vec3 Sw = rotAxis(S, k, -ang);                  // soleil, dans le repère du sol
        vec3 Lt = Sw - P * dot(P, Sw);
        vec3 Ld = Lt / max(length(Lt), 0.001);          // direction du soleil le long du sol

        // éclairage
        float ndl = dot(n, S);
        float day = smoothstep(-0.10, 0.30, ndl);
        float twil = exp(-pow(ndl * 4.5, 2.0));

        // continents : on ne voit qu'une petite fenêtre de la planète, donc les détails sont fins,
        // et le terrain est déformé pour obtenir des côtes naturelles
        vec3 warp = (vec3(vnoise(P * 2.3 + 3.1), vnoise(P * 2.3 + 9.7), vnoise(P * 2.3 + 15.3)) - 0.5) * 1.1;
        vec3 Pw = P * 3.4 + warp + vec3(7.3, 1.1, 4.2);
        float e = fbm5(Pw) + (vnoise(P * 22.0) - 0.5) * 0.05;   // altitude
        float e2 = fbm5(Pw + Ld * 0.05);                       // un peu plus près du soleil : sert au relief
        float lat = dot(P, k);
        float land = smoothstep(0.535, 0.55, e);
        float shelf = smoothstep(0.40, 0.55, e);

        vec3 ocean = mix(vec3(0.003, 0.022, 0.085), vec3(0.015, 0.20, 0.30), shelf * shelf);

        float m = fbm3(P * 5.0 + vec3(19.0, 3.0, 8.0)); // humidité
        float dry = exp(-pow((abs(lat) - 0.32) * 3.2, 2.0));
        vec3 veg = mix(vec3(0.07, 0.19, 0.06), vec3(0.24, 0.35, 0.11), smoothstep(0.35, 0.65, m));
        float desert = clamp(dry * smoothstep(0.38, 0.62, 1.0 - m) * 1.4, 0.0, 1.0);
        vec3 ground = mix(veg, vec3(0.64, 0.49, 0.27), desert);
        float hgt = smoothstep(0.58, 0.78, e);
        ground = mix(ground, vec3(0.34, 0.31, 0.28), hgt);
        ground = mix(ground, vec3(0.92, 0.95, 1.0), smoothstep(0.76, 0.88, e));
        ground *= 0.85 + 0.3 * vnoise(P * 60.0);               // grain du terrain

        // relief : pentes tournées vers le soleil plus claires, pentes à l'ombre plus sombres
        float relief = clamp((e2 - e) * 14.0, -0.7, 0.7);
        ground *= 1.0 - relief * 0.9;

        float ice = smoothstep(0.80, 0.93, abs(lat) + (vnoise(P * 8.0) - 0.5) * 0.12);
        vec3 surf = mix(ocean, ground, land);
        surf = mix(surf, vec3(0.92, 0.95, 1.0), ice);

        // ombres des nuages sur le sol
        float clS = fbm5((Pc - Ld * 0.018) * 7.0 + vec3(2.0, 5.0, uTime * 0.006));
        surf *= 1.0 - smoothstep(0.55, 0.78, clS) * 0.5 * day;

        // reflet du soleil sur l'océan (un point net et un halo large) + reflet du ciel près du bord
        vec3 refl = reflect(-S, n);
        float rz = max(refl.z, 0.0);
        float eau = (1.0 - land) * (1.0 - ice) * day;
        float spec = (pow(rz, 300.0) * 3.0 + pow(rz, 40.0) * 0.35) * eau;
        vec3 lit = surf * (0.015 + day) + vec3(1.0, 0.9, 0.7) * spec;
        lit += vec3(0.25, 0.45, 0.80) * pow(1.0 - n.z, 3.0) * 0.35 * eau;

        // nuages
        float cl = fbm5(Pc * 7.0 + vec3(2.0, 5.0, uTime * 0.006)) + (vnoise(Pc * 35.0) - 0.5) * 0.12;
        float cloud = smoothstep(0.55, 0.78, cl) * 0.92;
        vec3 cloudCol = vec3(0.95) * (0.02 + day) * (0.86 + 0.14 * vnoise(Pc * 20.0)) + vec3(1.0, 0.45, 0.2) * twil * 0.45;
        lit = mix(lit, cloudCol, cloud);

        // lumières des villes, côté nuit : points fins, regroupés autour des zones peuplées et des côtes
        float nuit = 1.0 - smoothstep(-0.18, 0.04, ndl);
        float pop = smoothstep(0.55, 0.72, fbm3(P * 9.0 + vec3(31.0, 2.0, 9.0)));
        float cote = exp(-pow((e - 0.56) * 18.0, 2.0));
        float densite = max(pop, cote * 0.6) * land * (1.0 - hgt) * (1.0 - ice);
        float sparkle = vnoise(P * 420.0) * vnoise(P * 190.0 + 5.0);
        float points = smoothstep(0.30, 0.62, sparkle) * densite;
        vec3 chaud = vec3(1.0, 0.68, 0.32);
        lit += chaud * (points * 1.1 + pop * land * 0.05) * nuit * (1.0 - cloud * 0.85);

        // atmosphère vue de face, plus épaisse près du bord
        float fres = pow(1.0 - n.z, 4.0);
        vec3 atm = mix(vec3(0.16, 0.42, 1.0), vec3(1.0, 0.5, 0.2), twil * 0.8);
        lit += atm * fres * (0.04 + day * 1.1 + twil * 0.7);

        col = lit;
      }

      /* ----- éblouissement du soleil quand il se lève derrière l'horizon ----- */
      float vis = smoothstep(0.45, -0.25, S.z) * smoothstep(0.0, 0.35, S.y);
      float gx = S.x * aspect * 2.0;
      vec2 gpos = vec2(gx, c.y + sqrt(max(R * R - gx * gx, 0.0)));
      vec2 dg = p - gpos;
      float flare = exp(-length(dg * vec2(1.0, 1.3)) * 8.0) * 0.55
                  + exp(-length(dg) * 40.0) * 1.4
                  + exp(-length(dg) * 140.0) * 2.0;
      float streak = exp(-abs(dg.y) * 55.0) * exp(-abs(dg.x) * 2.2) * 0.35;
      col += vec3(1.0, 0.82, 0.55) * (flare + streak) * vis;

      /* ----- rendu final : tons, gamma, léger voile bleu-vert, vignettage, grain ----- */
      col = 1.0 - exp(-col * 1.2);
      col = pow(col, vec3(1.0 / 2.2));
      col *= vec3(0.94, 1.0, 1.05);
      vec2 q = gl_FragCoord.xy / uRes - 0.5;
      col *= 1.0 - 0.45 * dot(q, q) * 2.0;
      col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.014;   // grain de pellicule

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("Fond animé : erreur de shader\n" + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return; // la photo de nébuleuse reste affichée

  const programme = gl.createProgram();
  gl.attachShader(programme, vs);
  gl.attachShader(programme, fs);
  gl.linkProgram(programme);
  if (!gl.getProgramParameter(programme, gl.LINK_STATUS)) {
    console.warn("Fond animé : erreur d'édition de liens\n" + gl.getProgramInfoLog(programme));
    return;
  }
  gl.useProgram(programme);

  // Un rectangle qui couvre tout l'écran
  const tampon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(programme, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(programme, "uRes");
  const uTime = gl.getUniformLocation(programme, "uTime");

  // On calcule le fond en résolution réduite : il est légèrement flou derrière la carte et ça ménage la batterie.
  // Si l'appareil est trop lent, la résolution baisse toute seule (voir plus bas).
  let echelle = Math.min(window.devicePixelRatio || 1, 1) * 0.75;
  const ECHELLE_MIN = 0.3;

  function redimensionne() {
    const largeur = Math.max(2, Math.floor(window.innerWidth * echelle));
    const hauteur = Math.max(2, Math.floor(window.innerHeight * echelle));
    if (canvas.width !== largeur || canvas.height !== hauteur) {
      canvas.width = largeur;
      canvas.height = hauteur;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  const DEPART = performance.now();
  const TEMPS_FIGE = 4; // image fixe (soleil bas, lumière chaude) si les animations sont réduites

  function dessine(temps) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, temps);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  redimensionne();
  document.documentElement.classList.add("gl"); // masque la photo de repli (voir le CSS)

  // Image fixe : animations réduites, ou adresse terminée par ?terre=<secondes> (pour régler le rendu)
  const imposee = parseFloat(new URLSearchParams(location.search).get("terre"));
  if (reduit || !Number.isNaN(imposee)) {
    const instant = Number.isNaN(imposee) ? TEMPS_FIGE : imposee;
    dessine(instant);
    window.addEventListener("resize", () => { redimensionne(); dessine(instant); });
    return;
  }

  // Animation : 30 images par seconde suffisent pour un mouvement aussi lent
  const INTERVALLE = 1000 / 30;
  let dernier = 0;
  let enPause = false;
  let mesures = 0;
  let cumul = 0;

  function boucle(maintenant) {
    if (enPause) return;
    requestAnimationFrame(boucle);

    const ecart = maintenant - dernier;
    if (ecart < INTERVALLE - 2) return;
    dernier = maintenant;

    dessine((maintenant - DEPART) / 1000);

    // Si l'appareil est trop lent, on baisse la résolution du fond plutôt que de saccader
    if (ecart < 500) {
      cumul += ecart;
      mesures++;
      if (mesures === 45) {
        if (cumul / mesures > 52 && echelle > ECHELLE_MIN) {
          echelle = Math.max(ECHELLE_MIN, echelle * 0.75);
          redimensionne();
        }
        mesures = 0;
        cumul = 0;
      }
    }
  }

  window.addEventListener("resize", redimensionne);
  document.addEventListener("visibilitychange", () => {
    enPause = document.hidden; // onglet caché : on ne calcule plus rien
    if (!enPause) { dernier = 0; requestAnimationFrame(boucle); }
  });

  requestAnimationFrame(boucle);
})();
