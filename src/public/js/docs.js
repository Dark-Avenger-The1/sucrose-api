(function () {
  // Copy buttons on code blocks
  document.querySelectorAll(".code").forEach(function (box) {
    var btn = box.querySelector(".copy");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var text = box.querySelector("pre").innerText;
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (_) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    });
  });

  // Try it: sends a real request to the API
  var form = document.getElementById("try-form");
  if (!form) return;
  var endpoint = form.elements.endpoint, glucose = form.elements.glucose, age = form.elements.age,
      gender = form.elements.gender, base = form.elements.base;
  var out = document.getElementById("try-out"), status = document.getElementById("try-status"),
      timing = document.getElementById("try-time"), urlEl = document.getElementById("try-url"),
      body = document.getElementById("try-body");

  base.value = location.protocol === "http:" || location.protocol === "https:" ? location.origin : "https://sucrose-api.onrender.com";

  function sync() {
    var needsProfile = endpoint.value !== "glucose-check";
    age.disabled = gender.disabled = !needsProfile;
  }
  endpoint.addEventListener("change", sync);
  sync();

  function tone(code) { return code >= 500 ? "high" : code >= 400 ? "elevated" : "normal"; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = new URLSearchParams({ glucose: glucose.value });
    if (endpoint.value !== "glucose-check") { q.set("age", age.value); q.set("gender", gender.value); }
    var url = base.value.replace(/\/+$/, "") + "/api/" + endpoint.value + "?" + q.toString();
    var t0 = performance.now();
    out.hidden = false;
    urlEl.textContent = "GET " + url;
    status.textContent = "Sending";
    status.dataset.tone = "";
    timing.textContent = "";
    body.textContent = "";
    fetch(url)
      .then(function (res) {
        return res.text().then(function (txt) {
          status.textContent = res.status + " " + (res.statusText || "");
          status.dataset.tone = tone(res.status);
          timing.textContent = Math.round(performance.now() - t0) + " ms";
          try { body.textContent = JSON.stringify(JSON.parse(txt), null, 2); } catch (_) { body.textContent = txt; }
        });
      })
      .catch(function () {
        status.textContent = "No response";
        status.dataset.tone = "high";
        body.textContent = "Could not reach " + base.value + ". Check that the server is running and the address is correct.";
      });
  });
})();
