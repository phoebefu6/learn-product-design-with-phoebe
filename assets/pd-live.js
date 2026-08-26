/* ============================================================
   pd-live.js - "The screen scorer"
   learn-product-design-with-phoebe

   A real, live Daybreak "Manage your subscription" screen that
   re-renders as you toggle design levers. The usability score is
   part model and part measurement:

     - the CONTRAST portion is genuinely measured. It walks the
       rendered mock, reads getComputedStyle on every text node,
       resolves the effective background, and computes the real
       WCAG 2.1 relative-luminance ratio. Nothing is scripted.
     - hierarchy, spacing, copy, states and findability are a
       teaching model, calibrated so the shape of each trade is
       visible. The footer on the widget says so.

   The "brighten it up" lever is an ANTI-lever: it is the change
   people ask for most, it visibly lowers the measured contrast,
   and it makes findability worse. It is not a scold - the
   measurement does the arguing.
   ============================================================ */
(function () {
  "use strict";

  var LEVERS = [
    { id: "hierarchy", name: "One primary action, everything else demoted",
      hint: "Five equal buttons is five decisions. One filled button and four text links is one decision and four escape hatches." },
    { id: "contrast", name: "Text colours that meet WCAG AA",
      hint: "The starting grey is #9AA0A6 on white. It looks tasteful in Figma at 200 percent zoom and it is unreadable on a phone in daylight." },
    { id: "spacing", name: "One spacing scale, not eleven ad-hoc values",
      hint: "A scale makes groups obvious without drawing a single line. Proximity is the cheapest grouping signal there is." },
    { id: "copy", name: "Buttons named after the task, not the screen",
      hint: "\"Manage\" and \"Options\" describe your information architecture. \"Pause deliveries\" describes what the person came to do." },
    { id: "states", name: "Empty, loading and error states designed",
      hint: "The happy path is the state your users see least often on the day they are annoyed enough to visit this screen." },
    { id: "surface", name: "Pause is on the screen, not behind a menu",
      hint: "Every level of nesting costs you people. The action that prevents a cancellation should never be two taps deeper than the one that causes it." }
  ];

  var ANTI = { id: "brighten", name: "Brighten it up, make it feel more friendly",
    hint: "The most requested change in design history. Watch the measured contrast ratio, not the vibe: pastel text on white is a real accessibility failure, and four competing button colours is no hierarchy at all." };

  /* palettes actually applied to the mock, so the measurement is real */
  var PAL = {
    bad:      { text: "#9AA0A6", head: "#6E7378", bg: "#FFFFFF", btn: "#EDEDF0", btnText: "#6E7378" },
    good:     { text: "#4A4458", head: "#1E1B29", bg: "#FFFFFF", btn: "#EDEBF5", btnText: "#3D2C8D" },
    brighten: { text: "#C7A6FF", head: "#9B8CE8", bg: "#FFFFFF", btn: "#FFE9D6", btnText: "#FFB07A" }
  };

  /* ---------- real WCAG 2.1 contrast ------------------------ */
  function srgbToLin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(rgb) { return 0.2126 * srgbToLin(rgb[0]) + 0.7152 * srgbToLin(rgb[1]) + 0.0722 * srgbToLin(rgb[2]); }
  function ratio(a, b) {
    var la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function parseRGB(s) {
    var m = /rgba?\(([^)]+)\)/.exec(s || "");
    if (!m) return null;
    var p = m[1].split(",").map(function (x) { return parseFloat(x); });
    if (p.length > 3 && p[3] === 0) return null;   /* transparent */
    return [p[0], p[1], p[2]];
  }
  function effectiveBG(el, root) {
    var n = el;
    while (n && n !== root.parentNode) {
      var c = parseRGB(getComputedStyle(n).backgroundColor);
      if (c) return c;
      n = n.parentNode;
    }
    return [255, 255, 255];
  }
  /* walk every text-bearing node in the mock and return the worst real ratio */
  /* The fake browser chrome is not part of the product surface being designed,
     so it is excluded - otherwise it caps the score at a number the learner
     cannot move with any lever, which teaches nothing. */
  function measureContrast(root) {
    var worst = 21, worstOn = "";
    root.querySelectorAll("*").forEach(function (el) {
      if (el.closest("[data-nocontrast]")) return;
      var hasText = false;
      for (var i = 0; i < el.childNodes.length; i++) {
        var n = el.childNodes[i];
        if (n.nodeType === 3 && n.textContent.trim()) { hasText = true; break; }
      }
      if (!hasText) return;
      var cs = getComputedStyle(el);
      var fg = parseRGB(cs.color);
      if (!fg) return;
      var r = ratio(fg, effectiveBG(el, root));
      if (r < worst) { worst = r; worstOn = el.textContent.trim().slice(0, 34); }
    });
    return { ratio: worst, on: worstOn };
  }

  /* ---------- the model ------------------------------------ */
  function findability(on) {
    var s = 41;
    if (on.surface) s -= 22;
    if (on.copy) s -= 9;
    if (on.hierarchy) s -= 5;
    if (on.brighten) s += 6;
    return Math.max(4, s);
  }

  function score(on, contrast) {
    var pts = 0, parts = [];
    var c = contrast.ratio;
    var cp = c >= 7 ? 30 : c >= 4.5 ? 24 : c >= 3 ? 12 : 0;
    pts += cp; parts.push(["Contrast, measured", cp, 30]);

    var hp = on.hierarchy ? (on.brighten ? 8 : 20) : 0;
    pts += hp; parts.push(["Visual hierarchy", hp, 20]);

    var sp = on.spacing ? 12 : 0;
    pts += sp; parts.push(["Spacing scale", sp, 12]);

    var kp = on.copy ? 14 : 0;
    pts += kp; parts.push(["Task-named copy", kp, 14]);

    var tp = on.states ? 12 : 0;
    pts += tp; parts.push(["States designed", tp, 12]);

    var fp = on.surface ? 12 : 0;
    pts += fp; parts.push(["Findability", fp, 12]);

    return { total: pts, parts: parts };
  }

  /* ---------- UI ------------------------------------------- */
  var CSS = [
    "#pd-live{margin:1.6rem 0}",
    ".pd{border:1px solid var(--hairline);border-radius:var(--radius);background:#fff;overflow:hidden}",
    ".pd-head{background:var(--indigo-deep);color:#fff;padding:.85rem 1.1rem;display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}",
    ".pd-head h4{font-size:.95rem;font-weight:800;margin:0;flex:1;min-width:12rem}",
    ".pd-head .pd-task{font-size:.78rem;opacity:.85}",
    ".pd-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr)}",
    "@media(max-width:820px){.pd-body{grid-template-columns:1fr}}",
    ".pd-left{padding:.9rem 1.1rem;border-right:1px solid var(--hairline)}",
    "@media(max-width:820px){.pd-left{border-right:0;border-bottom:1px solid var(--hairline)}}",
    ".pd-left h5,.pd-right h5{font-size:.72rem;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);margin:0 0 .5rem}",
    ".pd-lv{display:block;padding:.42rem .5rem;border-radius:9px;cursor:pointer;font-size:.85rem;line-height:1.45}",
    ".pd-lv:hover{background:var(--indigo-50)}",
    ".pd-lv.on{background:var(--indigo-50)}",
    ".pd-lv.anti.on{background:#FEF2F2}",
    ".pd-lv input{margin-right:.5rem;accent-color:var(--indigo)}",
    ".pd-why{margin:.15rem 0 .5rem 1.45rem;padding:.5rem .65rem;border-left:3px solid var(--indigo-soft);background:var(--paper);font-size:.79rem;color:var(--muted);border-radius:0 8px 8px 0}",
    ".pd-lv.anti.on + .pd-why{border-left-color:#FCA5A5}",
    ".pd-btns{display:flex;gap:.4rem;margin-top:.7rem;flex-wrap:wrap}",
    ".pd-btns button{border:1px solid var(--hairline);background:#fff;border-radius:999px;padding:.3rem .8rem;font:700 .74rem Inter,sans-serif;color:var(--ink);cursor:pointer}",
    ".pd-btns button:hover{border-color:var(--indigo);color:var(--indigo)}",
    ".pd-right{padding:.9rem 1.1rem;background:var(--paper)}",
    /* the mock */
    ".pd-mock{border:1px solid var(--hairline);border-radius:12px;background:#fff;overflow:hidden;font-family:Inter,sans-serif}",
    ".pd-mock .m-bar{background:#F4F4F7;padding:8px 12px;font-size:11px;color:#6E7378;border-bottom:1px solid #E7E3F0}",
    ".pd-mock .m-body{padding:16px}",
    ".pd-mock h6{font-size:15px;font-weight:800;margin:0}",
    ".pd-mock p{font-size:12.5px;line-height:1.6;margin:0}",
    ".pd-mock .m-btn{display:inline-block;border-radius:8px;font-size:12.5px;font-weight:700;text-align:center;border:1px solid transparent}",
    ".pd-mock .m-link{font-size:12.5px;font-weight:600;text-decoration:underline}",
    ".pd-mock .m-state{border:1px dashed #CFC9E0;border-radius:8px;font-size:11.5px;color:#6B6480}",
    /* meters */
    ".pd-score{display:flex;align-items:baseline;gap:.6rem;margin-bottom:.5rem}",
    ".pd-score b{font:800 2.1rem Inter,sans-serif;font-variant-numeric:tabular-nums;line-height:1}",
    ".pd-score span{font-size:.78rem;color:var(--muted);font-weight:600}",
    ".pd-part{display:grid;grid-template-columns:9.4rem 1fr 2.6rem;gap:.5rem;align-items:center;font-size:.76rem;margin-bottom:.24rem;color:var(--muted)}",
    ".pd-part .pbar{height:7px;border-radius:999px;background:var(--hairline);overflow:hidden}",
    ".pd-part .pfill{height:100%;background:var(--indigo);transition:width .28s ease}",
    ".pd-part.zero .pfill{background:#DC2626}",
    ".pd-part b{color:var(--ink);text-align:right;font-variant-numeric:tabular-nums}",
    ".pd-facts{margin-top:.7rem;padding:.6rem .75rem;border-radius:9px;background:#fff;border:1px solid var(--hairline);font-size:.8rem;line-height:1.6}",
    ".pd-facts .f{display:flex;justify-content:space-between;gap:.6rem}",
    ".pd-facts .bad{color:#991B1B;font-weight:700}",
    ".pd-facts .good{color:var(--indigo-deep);font-weight:700}",
    ".pd-foot{border-top:1px solid var(--hairline);padding:.6rem 1.1rem;font-size:.74rem;color:var(--muted);background:var(--paper)}"
  ].join("");

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function mount(host) {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

    var on = {};
    LEVERS.forEach(function (l) { on[l.id] = false; });
    on[ANTI.id] = false;

    var shell = el("div", "pd");
    var head = el("div", "pd-head");
    head.appendChild(el("h4", null, "The screen scorer · Daybreak, Manage your subscription"));
    head.appendChild(el("span", "pd-task", "The task: pause deliveries for three weeks"));
    shell.appendChild(head);

    var body = el("div", "pd-body");
    var left = el("div", "pd-left");
    left.appendChild(el("h5", null, "Design levers"));
    var rows = {};
    LEVERS.concat([ANTI]).forEach(function (l) {
      var lab = el("label", "pd-lv" + (l === ANTI ? " anti" : ""));
      var cb = document.createElement("input"); cb.type = "checkbox";
      lab.appendChild(cb); lab.appendChild(document.createTextNode(l.name));
      var why = el("div", "pd-why", l.hint); why.style.display = "none";
      left.appendChild(lab); left.appendChild(why);
      rows[l.id] = { lab: lab, cb: cb, why: why };
      cb.addEventListener("change", function () { on[l.id] = cb.checked; paint(); });
    });
    var btns = el("div", "pd-btns");
    var bAll = el("button", null, "Switch every design lever on");
    var bNone = el("button", null, "Back to the screen we inherited");
    btns.appendChild(bAll); btns.appendChild(bNone);
    left.appendChild(btns);
    body.appendChild(left);

    var right = el("div", "pd-right");
    right.appendChild(el("h5", null, "The screen, live"));
    var mock = el("div", "pd-mock");
    right.appendChild(mock);
    var scoreWrap = el("div"); scoreWrap.style.marginTop = ".8rem";
    right.appendChild(scoreWrap);
    body.appendChild(right);
    shell.appendChild(body);

    shell.appendChild(el("div", "pd-foot",
      "The contrast row is really measured - it reads the rendered pixels' colours and computes the WCAG 2.1 ratio. The other rows are a teaching model. Both are described in materials/official-course-map.md."));

    host.appendChild(shell);

    function renderMock() {
      var p = on.brighten ? PAL.brighten : (on.contrast ? PAL.good : PAL.bad);
      var gap = on.spacing ? 16 : 9;
      var pad = on.spacing ? 16 : 11;

      mock.innerHTML = "";
      mock.style.background = p.bg;

      var bar = el("div", "m-bar", "daybreak.example / account / subscription");
      bar.setAttribute("data-nocontrast", "1");
      mock.appendChild(bar);

      var mb = el("div", "m-body");
      mb.style.padding = pad + "px";
      mb.style.background = p.bg;

      var h = el("h6", null, "Your Daybreak subscription");
      h.style.color = p.head;
      h.style.marginBottom = (gap * 0.5) + "px";
      mb.appendChild(h);

      var sub = el("p", null, "Ethiopia Guji, whole bean, 500g. Next delivery Tuesday 1 September.");
      sub.style.color = p.text;
      sub.style.marginBottom = gap + "px";
      mb.appendChild(sub);

      /* the actions */
      var acts = el("div");
      acts.style.display = "flex";
      acts.style.flexWrap = "wrap";
      acts.style.gap = (on.spacing ? 8 : 5) + "px";
      acts.style.alignItems = "center";

      var labels = on.copy
        ? ["Pause deliveries", "Skip next box", "Change grind", "Change frequency", "Cancel subscription"]
        : ["Manage", "Options", "Settings", "More", "Account"];

      /* where does pause live? */
      var visible = on.surface ? labels.slice(0, 4) : (on.copy ? ["Options", "Change grind", "Change frequency", "Cancel subscription"] : labels);

      visible.forEach(function (t, i) {
        var primary = on.hierarchy && i === 0 && on.surface;
        if (on.hierarchy && !primary) {
          var a = el("span", "m-link", t);
          a.style.color = on.brighten ? p.btnText : (on.contrast ? "#3D2C8D" : "#6E7378");
          a.style.padding = "5px 2px";
          acts.appendChild(a);
        } else {
          var b = el("span", "m-btn", t);
          b.style.padding = (on.spacing ? "9px 14px" : "6px 10px");
          if (primary) {
            b.style.background = on.brighten ? "#FFB07A" : "#3D2C8D";
            b.style.color = on.brighten ? "#FFF6EE" : "#FFFFFF";
          } else if (on.brighten) {
            /* four competing colours - the actual thing that was asked for */
            var friendly = ["#FFE9D6", "#E7DDFF", "#D9F5EC", "#FFE1EC"];
            b.style.background = friendly[i % 4];
            b.style.color = p.btnText;
          } else {
            b.style.background = p.btn;
            b.style.color = p.btnText;
          }
          acts.appendChild(b);
        }
      });
      mb.appendChild(acts);

      if (!on.surface) {
        var buried = el("p", null, on.copy
          ? "Pause deliveries lives inside Options, two taps from here."
          : "Pause is somewhere inside one of these. Probably Options.");
        buried.style.color = p.text;
        buried.style.marginTop = gap + "px";
        buried.style.fontStyle = "italic";
        mb.appendChild(buried);
      }

      if (on.states) {
        var s = el("div", "m-state");
        s.style.marginTop = gap + "px";
        s.style.padding = (on.spacing ? "12px" : "8px");
        s.textContent = "Empty · \"No deliveries paused yet. Pausing keeps your price and your place in the roast queue.\"   Loading · skeleton rows, no spinner.   Error · \"We could not reach your subscription. Nothing has changed. Try again.\"";
        s.style.color = p.text;
        mb.appendChild(s);
      }

      mock.appendChild(mb);
    }

    function paint() {
      LEVERS.concat([ANTI]).forEach(function (l) {
        rows[l.id].lab.classList.toggle("on", !!on[l.id]);
        rows[l.id].why.style.display = on[l.id] ? "block" : "none";
      });

      renderMock();

      var contrast = measureContrast(mock);
      var sc = score(on, contrast);
      var secs = findability(on);

      scoreWrap.innerHTML = "";
      var top = el("div", "pd-score");
      var b = el("b", null, String(sc.total));
      b.style.color = sc.total >= 80 ? "var(--indigo-deep)" : sc.total >= 50 ? "var(--ink)" : "#991B1B";
      top.appendChild(b);
      top.appendChild(el("span", null, "usability and accessibility, out of 100"));
      scoreWrap.appendChild(top);

      sc.parts.forEach(function (p) {
        var row = el("div", "pd-part" + (p[1] === 0 ? " zero" : ""));
        row.appendChild(el("span", null, p[0]));
        var bar = el("div", "pbar"); var fill = el("div", "pfill");
        fill.style.width = (p[1] / p[2] * 100) + "%";
        bar.appendChild(fill); row.appendChild(bar);
        row.appendChild(el("b", null, p[1] + "/" + p[2]));
        scoreWrap.appendChild(row);
      });

      var facts = el("div", "pd-facts");
      var f1 = el("div", "f");
      f1.appendChild(el("span", null, "Worst real contrast ratio on this screen"));
      var v1 = el("span", contrast.ratio >= 4.5 ? "good" : "bad",
        contrast.ratio.toFixed(2) + ":1 · " + (contrast.ratio >= 7 ? "AAA" : contrast.ratio >= 4.5 ? "AA" : "fails AA"));
      f1.appendChild(v1); facts.appendChild(f1);

      var f2 = el("div", "f");
      f2.appendChild(el("span", null, "Measured on"));
      f2.appendChild(el("span", null, "“" + contrast.on + "”"));
      facts.appendChild(f2);

      var f3 = el("div", "f");
      f3.appendChild(el("span", null, "Modelled time to find pause"));
      f3.appendChild(el("span", secs <= 12 ? "good" : "bad", secs + " s"));
      facts.appendChild(f3);

      if (on.brighten) {
        var note = el("div", null, "The brighten lever is on. Contrast is measured, not guessed - the pastel text really is failing, and four button colours means the screen no longer says which action matters.");
        note.style.cssText = "margin-top:.4rem;color:#991B1B;font-size:.78rem;line-height:1.55";
        facts.appendChild(note);
      }
      scoreWrap.appendChild(facts);

      api.state = on; api.score = sc.total; api.contrast = contrast; api.seconds = secs; api.parts = sc.parts;
    }

    bAll.addEventListener("click", function () {
      LEVERS.forEach(function (l) { on[l.id] = true; rows[l.id].cb.checked = true; });
      on[ANTI.id] = false; rows[ANTI.id].cb.checked = false;
      paint();
    });
    bNone.addEventListener("click", function () {
      LEVERS.concat([ANTI]).forEach(function (l) { on[l.id] = false; rows[l.id].cb.checked = false; });
      paint();
    });

    var api = {
      state: on, score: 0, contrast: null, seconds: 0, parts: null,
      set: function (id, v) { on[id] = v; if (rows[id]) rows[id].cb.checked = !!v; paint(); },
      setAll: function () { bAll.click(); },
      reset: function () { bNone.click(); },
      LEVERS: LEVERS, ANTI: ANTI, ratio: ratio
    };
    window.PD_LIVE = api;

    paint();
  }

  if (typeof document !== "undefined") {
    var host = document.getElementById("pd-live");
    if (host) mount(host);
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { score: score, findability: findability, ratio: ratio, LEVERS: LEVERS };
  }
})();
