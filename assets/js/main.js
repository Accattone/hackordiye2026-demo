(function () {
  "use strict";

  var root = document.documentElement;

  var stored = null;
  try {
    stored = localStorage.getItem("hod-theme");
  } catch (e) {}

  if (stored === "dark") {
    root.classList.add("dark");
  } else if (stored === "light") {
    root.classList.remove("dark");
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.classList.add("dark");
  }

  function bindTheme() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var dark = root.classList.toggle("dark");
      try {
        localStorage.setItem("hod-theme", dark ? "dark" : "light");
      } catch (e) {}
      btn.setAttribute("aria-label", dark ? "Attiva tema chiaro" : "Attiva tema scuro");
    });
  }

  function bindMenu() {
    var btn = document.getElementById("menu-toggle");
    var nav = document.getElementById("nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function decodeEmail(encoded) {
    return encoded
      .replace("[chiocciolina]", "@")
      .replace("[at]", "@")
      .replace("[dot]", ".");
  }

  function bindEmails() {
    var nodes = document.querySelectorAll(".email[data-email]");
    Array.prototype.forEach.call(nodes, function (node) {
      var email = decodeEmail(node.getAttribute("data-email"));
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
      node.setAttribute("title", "Copia " + email);

      function copy() {
        var done = function () {
          var tip = node.querySelector(".email_tooltip");
          var original = tip ? tip.textContent : "";
          node.classList.add("copied");
          if (tip) tip.textContent = "Copiato!";
          window.setTimeout(function () {
            node.classList.remove("copied");
            if (tip) tip.textContent = original || "Clicca per copiare!";
          }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(done, function () {
            fallbackCopy(email, done);
          });
        } else {
          fallbackCopy(email, done);
        }
      }

      node.addEventListener("click", copy);
      node.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          copy();
        }
      });
    });
  }

  function fallbackCopy(text, done) {
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
    } catch (e) {}
    document.body.removeChild(area);
  }

  function bindReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    Array.prototype.forEach.call(items, function (el) {
      observer.observe(el);
    });
  }

  function bindTalkTools() {
    var openAll = document.getElementById("talks-open");
    var closeAll = document.getElementById("talks-close");
    var talks = document.querySelectorAll("details.talk");

    if (openAll) {
      openAll.addEventListener("click", function () {
        Array.prototype.forEach.call(talks, function (t) {
          t.open = true;
        });
      });
    }
    if (closeAll) {
      closeAll.addEventListener("click", function () {
        Array.prototype.forEach.call(talks, function (t) {
          t.open = false;
        });
      });
    }
  }

  function bindTerminal() {
    var toggle = document.getElementById("term-toggle");
    var term = document.getElementById("term");
    if (!toggle || !term) return;

    var body = term.querySelector(".term-body");
    var input = term.querySelector("input");
    var history = [];
    var cursor = -1;

    function print(text, cls) {
      var line = document.createElement("p");
      line.className = "term-line" + (cls ? " " + cls : "");
      line.textContent = text;
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }

    var commands = {
      help: function () {
        print("comandi disponibili:");
        print("  help       questo messaggio");
        print("  ls         elenca le pagine");
        print("  open <p>   apri una pagina (home, cft, programma, come-arrivare)");
        print("  whoami     chi sei?");
        print("  date       data e ora");
        print("  sudo       tentativo di privilegi");
        print("  clear      pulisci il terminale");
        print("  exit       chiudi il terminale");
      },
      ls: function () {
        print("index.html   cft.html   programma.html   come-arrivare.html");
        print("assets/      README.md  .gitignore");
      },
      whoami: function () {
        print("hacker@vag61 — ospite di Hack or d(A/I) 2026");
      },
      date: function () {
        print(new Date().toString());
      },
      sudo: function () {
        print("hacker non è nel file sudoers. L'evento verrà segnalato.", "err");
      },
      clear: function () {
        body.innerHTML = "";
      },
      exit: function () {
        term.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      },
      open: function (args) {
        var pages = {
          home: "index.html",
          index: "index.html",
          cft: "cft.html",
          talk: "cft.html",
          programma: "programma.html",
          program: "programma.html",
          "come-arrivare": "come-arrivare.html",
          arrive: "come-arrivare.html",
          map: "come-arrivare.html"
        };
        var page = pages[(args[0] || "").toLowerCase()];
        if (page) {
          print("apro " + page + " ...");
          window.location.href = page;
        } else {
          print("pagina sconosciuta. usa: open home | cft | programma | come-arrivare", "err");
        }
      }
    };

    function run(raw) {
      var value = raw.trim();
      print("hacker@vag61:~$ " + value, "cmd");
      if (!value) return;
      history.push(value);
      cursor = history.length;
      var parts = value.split(/\s+/);
      var name = parts[0].toLowerCase();
      var args = parts.slice(1);
      if (commands[name]) {
        commands[name](args);
      } else {
        print("comando non trovato: " + name + " — prova 'help'", "err");
      }
    }

    toggle.addEventListener("click", function () {
      var open = term.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        if (!body.children.length) {
          print("Hack or d(A/I) 2026 :: terminale di bordo");
          print("scrivi 'help' per iniziare.");
        }
        window.setTimeout(function () {
          input.focus();
        }, 50);
      }
    });

    term.addEventListener("click", function (event) {
      if (event.target.closest(".term-body")) input.focus();
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        run(input.value);
        input.value = "";
      } else if (event.key === "ArrowUp") {
        if (cursor > 0) {
          cursor -= 1;
          input.value = history[cursor];
        }
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        if (cursor < history.length - 1) {
          cursor += 1;
          input.value = history[cursor];
        } else {
          cursor = history.length;
          input.value = "";
        }
        event.preventDefault();
      } else if (event.key === "Escape") {
        term.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function bindYear() {
    var nodes = document.querySelectorAll("[data-year]");
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  function init() {
    bindTheme();
    bindMenu();
    bindEmails();
    bindReveal();
    bindTalkTools();
    bindTerminal();
    bindYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
