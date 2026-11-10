(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var menuToggle = document.getElementById("menu-toggle");
  var nvToggle = document.getElementById("nv-toggle");
  var progress = document.getElementById("scroll-progress");
  var root = document.documentElement;

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /* ---------- Mobile navigation ------------------------------------------ */

  function setMenu(open) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenu(false);
    });

    var desktopQuery = window.matchMedia("(min-width: 921px)");
    var onDesktop = function (event) {
      if (event.matches) setMenu(false);
    };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onDesktop);
    else if (desktopQuery.addListener) desktopQuery.addListener(onDesktop);
  }

  /* ---------- Night vision ------------------------------------------------ */

  function syncNightVision() {
    if (!nvToggle) return;
    var on = root.classList.contains("nv");
    nvToggle.setAttribute("aria-pressed", String(on));
    nvToggle.setAttribute("aria-label", on ? "Disattiva visione notturna" : "Attiva visione notturna");
    nvToggle.setAttribute("title", on ? "Disattiva visione notturna" : "Visione notturna");
  }

  if (nvToggle) {
    syncNightVision();
    nvToggle.addEventListener("click", function () {
      root.classList.toggle("nv");
      try {
        localStorage.setItem("wc-theme", root.classList.contains("nv") ? "nv" : "day");
      } catch (error) {
        /* storage may be unavailable */
      }
      syncNightVision();
    });
  }

  /* ---------- Countdown --------------------------------------------------- */

  var countdown = document.getElementById("countdown");
  var target = new Date("2026-11-20T09:00:00+09:00").getTime();
  var cd = {
    d: document.getElementById("cd-d"),
    h: document.getElementById("cd-h"),
    m: document.getElementById("cd-m"),
    s: document.getElementById("cd-s")
  };

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function tickCountdown() {
    if (!cd.d || !cd.h || !cd.m || !cd.s) return;
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    cd.d.textContent = pad(days);
    cd.h.textContent = pad(hours);
    cd.m.textContent = pad(minutes);
    cd.s.textContent = pad(seconds);

    if (countdown) {
      countdown.setAttribute(
        "aria-label",
        "Mancano " + days + " giorni, " + hours + " ore, " + minutes + " minuti e " + seconds + " secondi all'inizio di WHISKERCON 26"
      );
    }
  }

  if (countdown) {
    tickCountdown();
    window.setInterval(tickCountdown, 1000);
  }

  /* ---------- Star field -------------------------------------------------- */

  var starsCanvas = document.getElementById("stars");

  if (starsCanvas && starsCanvas.getContext) {
    var ctx = starsCanvas.getContext("2d");
    var stars = [];
    var width = 0;
    var height = 0;
    var dpr = 1;
    var frame = 0;
    var lastTime = 0;
    var starColors = ["rgba(237,241,255,", "rgba(46,242,255,", "rgba(200,255,46,", "rgba(255,46,136,"];

    function buildStars() {
      var count = clamp(Math.round((width * height) / 14000), 36, 150);
      stars = [];
      for (var i = 0; i < count; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.15 + 0.35,
          alpha: Math.random() * 0.5 + 0.25,
          speed: Math.random() * 0.0015 + 0.0004,
          phase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.06,
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
    }

    function resizeStars() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      starsCanvas.width = Math.floor(width * dpr);
      starsCanvas.height = Math.floor(height * dpr);
      starsCanvas.style.width = width + "px";
      starsCanvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      if (reduceMotion) drawStars(0);
    }

    function drawStars(time) {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < stars.length; i += 1) {
        var star = stars[i];
        var twinkle = reduceMotion ? 0.8 : 0.55 + Math.sin(time * star.speed + star.phase) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = star.color + (star.alpha * twinkle).toFixed(3) + ")";
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animateStars(time) {
      if (!lastTime) lastTime = time;
      var delta = Math.min(time - lastTime, 48);
      lastTime = time;

      for (var i = 0; i < stars.length; i += 1) {
        var star = stars[i];
        star.x += star.vx * delta * 0.06;
        star.y += star.vy * delta * 0.06;
        if (star.x < -4) star.x = width + 4;
        if (star.x > width + 4) star.x = -4;
        if (star.y < -4) star.y = height + 4;
        if (star.y > height + 4) star.y = -4;
      }

      drawStars(time);
      frame = window.requestAnimationFrame(animateStars);
    }

    function startStars() {
      if (reduceMotion || frame) return;
      lastTime = 0;
      frame = window.requestAnimationFrame(animateStars);
    }

    function stopStars() {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    }

    resizeStars();
    if (!reduceMotion) startStars();

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        stopStars();
        resizeStars();
        if (!reduceMotion) startStars();
      }, 160);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopStars();
      else if (!reduceMotion) startStars();
    });
  }

  /* ---------- Cursor glow ------------------------------------------------ */

  var glow = document.getElementById("cursor-glow");

  if (glow && finePointer && !reduceMotion) {
    var glowX = 0;
    var glowY = 0;
    var glowFrame = 0;

    document.addEventListener(
      "pointermove",
      function (event) {
        glowX = event.clientX;
        glowY = event.clientY;
        document.body.classList.add("has-pointer");
        if (!glowFrame) {
          glowFrame = window.requestAnimationFrame(function () {
            glow.style.transform = "translate3d(" + glowX + "px," + glowY + "px,0)";
            glowFrame = 0;
          });
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", function () {
      document.body.classList.remove("has-pointer");
    });
  }

  /* ---------- Scroll progress + active nav -------------------------------- */

  var navLinks = $$('.nav a[href^="#"]');
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  var scrollFrame = 0;

  function updateScrollState() {
    scrollFrame = 0;
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? scrollTop / max : 0;

    if (progress) progress.style.setProperty("--scroll", (clamp(ratio, 0, 1) * 100).toFixed(2) + "%");

    if (header) header.classList.toggle("scrolled", scrollTop > 24);

    var headerHeight = header ? header.offsetHeight : 72;
    var current = "";
    for (var i = 0; i < sections.length; i += 1) {
      if (sections[i].getBoundingClientRect().top <= headerHeight + 120) current = sections[i].id;
    }
    if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }

    for (var j = 0; j < navLinks.length; j += 1) {
      var link = navLinks[j];
      if (current && link.getAttribute("href") === "#" + current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  }

  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollState();

  /* ---------- Reveal on scroll ------------------------------------------- */

  var revealItems = $$(".reveal");

  function revealAll() {
    revealItems.forEach(function (item) {
      item.classList.add("in");
    });
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });

    window.setTimeout(revealAll, 3000);
  } else {
    revealAll();
  }

  /* ---------- Program tabs ------------------------------------------------ */

  var dayTabs = $$(".day-tab");
  var dayPanels = $$(".day-panel");

  function selectDay(day, focusTab) {
    dayTabs.forEach(function (tab) {
      var active = tab.getAttribute("data-day") === String(day);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });

    dayPanels.forEach(function (panel) {
      panel.hidden = panel.id !== "day-" + day;
    });
  }

  if (dayTabs.length) {
    selectDay(1, false);

    dayTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectDay(tab.getAttribute("data-day"), false);
      });

      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (index + 1) % dayTabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + dayTabs.length) % dayTabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = dayTabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        selectDay(dayTabs[next].getAttribute("data-day"), true);
      });
    });
  }

  /* ---------- ICS download ------------------------------------------------ */

  var icsButton = document.getElementById("ics-btn");

  function buildIcs() {
    var stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Whiskercon 26//Secret Ninja Cats//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:whiskercon-26-" + stamp + "@whiskercon.nya",
      "DTSTAMP:" + stamp,
      "DTSTART:20261120T000000Z",
      "DTEND:20261122T080000Z",
      "SUMMARY:WHISKERCON 26 — Secret International Conference of Ninja Cats",
      "DESCRIPTION:Nine lives. Zero traces. Tre giorni di furtività felina, pawformatica quantistica e sonnellini coperti. Accesso solo su invito.",
      "LOCATION:Dojo Orbitale Mochi — coordinate redatte",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
  }

  if (icsButton) {
    icsButton.addEventListener("click", function () {
      var label = $(".btn-label", icsButton);
      var blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "whiskercon26.ics";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1500);

      if (label) {
        label.textContent = "Scaricato";
        window.setTimeout(function () {
          label.textContent = "Scarica .ics";
        }, 1800);
      }
    });
  }

  /* ---------- Redacted text ---------------------------------------------- */

  $$(".redacted").forEach(function (item) {
    var secret = item.getAttribute("data-secret");
    var blocks = item.textContent;
    item.setAttribute("aria-pressed", "false");
    item.setAttribute("aria-label", "Rivela testo redatto");

    item.addEventListener("click", function () {
      var revealed = item.classList.toggle("revealed");
      item.textContent = revealed && secret ? secret : blocks;
      item.setAttribute("aria-pressed", String(revealed));
      item.setAttribute("aria-label", revealed ? "Nascondi testo redatto" : "Rivela testo redatto");
    });
  });

  /* ---------- Registration form ------------------------------------------ */

  var form = document.getElementById("reg-form");
  var success = document.getElementById("reg-success");
  var codeOutput = document.getElementById("agent-code");
  var copyButton = document.getElementById("copy-code");
  var resetButton = document.getElementById("reg-reset");
  var livesInput = document.getElementById("lives");
  var livesOutput = document.getElementById("lives-out");
  var codeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function updateLives() {
    if (livesInput && livesOutput) livesOutput.textContent = livesInput.value;
  }

  if (livesInput && livesOutput) {
    livesInput.addEventListener("input", updateLives);
    updateLives();
  }

  function randomCode(length) {
    var output = "";
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(length);
      window.crypto.getRandomValues(values);
      for (var i = 0; i < length; i += 1) output += codeAlphabet[values[i] % codeAlphabet.length];
    } else {
      for (var j = 0; j < length; j += 1) output += codeAlphabet[Math.floor(Math.random() * codeAlphabet.length)];
    }
    return output;
  }

  function showSuccess() {
    if (!form || !success) return;
    var lives = livesInput ? livesInput.value : "9";
    if (codeOutput) codeOutput.textContent = "W26-" + randomCode(4) + "-" + lives + "L";
    form.hidden = true;
    success.classList.add("visible");
    success.setAttribute("tabindex", "-1");
    success.focus({ preventScroll: true });
  }

  if (form && success) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      showSuccess();
    });
  }

  if (resetButton && form && success) {
    resetButton.addEventListener("click", function () {
      form.reset();
      updateLives();
      success.classList.remove("visible");
      form.hidden = false;
      var firstField = document.getElementById("codename");
      if (firstField) firstField.focus();
    });
  }

  if (copyButton && codeOutput) {
    copyButton.addEventListener("click", function () {
      var text = codeOutput.textContent || "";
      var done = function () {
        copyButton.textContent = "copiato";
        window.setTimeout(function () {
          copyButton.textContent = "copia";
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          copyButton.textContent = "errore";
        });
        return;
      }

      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (error) {
        copyButton.textContent = "errore";
      }
      area.remove();
    });
  }

  /* ---------- Footer year ------------------------------------------------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
