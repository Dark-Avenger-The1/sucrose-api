// Homepage demo: maps a reading to its glucose level, clinical band and food limits.
// Values mirror src/data/sucrose-model-v2.json; the real answer comes from GET /api/glucose-check.
(function () {
  var LEVELS = [
    { label: "Under 80", min: 0, max: 80, tone: "low", sugar: 15, carb: 60, fat: 10 },
    { label: "80–99", min: 80, max: 100, tone: "normal", sugar: 15, carb: 60, fat: 10 },
    { label: "100–119", min: 100, max: 120, tone: "elevated", sugar: 12, carb: 45, fat: 10 },
    { label: "120–139", min: 120, max: 140, tone: "elevated", sugar: 11, carb: 38, fat: 10 },
    { label: "140–159", min: 140, max: 160, tone: "high", sugar: 10, carb: 31, fat: 8 },
    { label: "160–179", min: 160, max: 180, tone: "high", sugar: 9, carb: 24, fat: 8 },
    { label: "180–199", min: 180, max: 200, tone: "high", sugar: 8, carb: 17, fat: 8 },
    { label: "200+", min: 200, max: null, tone: "high", sugar: 7, carb: 10, fat: 8 }
  ];
  var BANDS = [
    { label: "Low (hypoglycemia)", min: 0, tone: "low" },
    { label: "Normal", min: 70, tone: "normal" },
    { label: "Prediabetes", min: 100, tone: "elevated" },
    { label: "Diabetes", min: 126, tone: "high" }
  ];
  var RANGE = [20, 600];
  var MAX = { sugar: 15, carb: 60, fat: 10 };

  var input = document.getElementById("glucose");
  var slider = document.getElementById("glucose-slider");
  var field = document.getElementById("glucose-field");
  var error = document.getElementById("glucose-error");
  var result = document.getElementById("result");
  var bar = document.getElementById("ladder-bar");
  var ticks = document.getElementById("ladder-ticks");
  var marker = document.getElementById("ladder-marker");
  var bandPill = document.getElementById("band-pill");
  var levelText = document.getElementById("level-text");
  var limits = document.getElementById("limits");
  if (!input) return;

  var segs = LEVELS.map(function (lv) {
    var s = document.createElement("span");
    s.className = "ladder__seg";
    s.dataset.tone = lv.tone;
    bar.insertBefore(s, marker);
    var t = document.createElement("span");
    t.textContent = lv.min === 0 ? "" : lv.min;
    ticks.appendChild(t);
    return s;
  });
  var tickEls = ticks.children;

  function levelIndex(g) {
    for (var i = LEVELS.length - 1; i >= 0; i--) if (g >= LEVELS[i].min) return i;
    return 0;
  }
  function band(g) {
    var b = BANDS[0];
    BANDS.forEach(function (x) { if (g >= x.min) b = x; });
    return b;
  }
  function describe(lv) {
    if (lv.min === 0) return "under " + lv.max;
    if (lv.max === null) return lv.min + " and above";
    return lv.min + " to " + (lv.max - 1);
  }

  function render(g) {
    var i = levelIndex(g), lv = LEVELS[i];
    var span = (lv.max === null ? lv.min + 100 : lv.max) - lv.min;
    var frac = Math.min(0.92, Math.max(0.08, (g - lv.min) / span));

    segs.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
    Array.prototype.forEach.call(tickEls, function (t, n) { t.classList.toggle("is-active", n === i); });
    bar.style.setProperty("--pos", i + frac);
    bar.style.setProperty("--i", i);
    bar.setAttribute("aria-label", "Glucose level " + describe(lv) + " milligrams per decilitre, level " + (i + 1) + " of " + LEVELS.length + ".");

    var b = band(g);
    bandPill.textContent = b.label;
    bandPill.dataset.tone = b.tone;
    levelText.textContent = "Glucose level " + lv.label + " mg/dL";

    [["sugar", lv.sugar], ["carb", lv.carb], ["fat", lv.fat]].forEach(function (p) {
      var row = limits.querySelector('[data-k="' + p[0] + '"]');
      row.querySelector(".fill").style.width = (p[1] / MAX[p[0]]) * 100 + "%";
      row.querySelector(".val").textContent = "≤ " + p[1] + " g";
    });
  }

  function update(fromSlider) {
    var g = Number(fromSlider ? slider.value : input.value);
    if (fromSlider) input.value = slider.value;
    var valid = input.value !== "" && isFinite(g) && g >= RANGE[0] && g <= RANGE[1];
    field.dataset.invalid = valid ? "false" : "true";
    error.hidden = valid;
    result.hidden = !valid;
    if (!valid) return;
    slider.value = Math.min(+slider.max, Math.max(+slider.min, g));
    render(g);
  }

  input.addEventListener("input", function () { update(false); });
  slider.addEventListener("input", function () { update(true); });
  update(false);
})();
