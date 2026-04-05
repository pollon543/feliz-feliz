/**
 * Experiencia principal: estrellas, bienvenida, interacciones.
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Canvas starfield ---------- */
  function initStarfield() {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    function drawStaticStars() {
      ctx.fillStyle = "#06040c";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 250, 255, 0.55)";
        ctx.fill();
      }
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: 0.015 + Math.random() * 0.04,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
      if (prefersReducedMotion) drawStaticStars();
    }

    function tick() {
      ctx.fillStyle = "#06040c";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.tw += s.sp;
        const alpha = 0.35 + Math.sin(s.tw) * 0.35;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 255, ${alpha})`;
        ctx.fill();
        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!prefersReducedMotion) tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }

  /* ---------- Background petals ---------- */
  function spawnBackgroundPetal() {
    const container = document.getElementById("petals-container");
    if (!container || prefersReducedMotion) return;
    const el = document.createElement("div");
    el.className = "petal-fall";
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${8 + Math.random() * 10}s`;
    el.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 20000);
  }

  function startBackgroundPetals() {
    if (prefersReducedMotion) return;
    setInterval(spawnBackgroundPetal, 2800);
    spawnBackgroundPetal();
  }

  /* ---------- Hero decorative flowers ---------- */
  function initHeroFlowers() {
    const wrap = document.querySelector(".hero__flowers");
    if (!wrap) return;
    const symbols = ["✿", "❀", "✾", "❁"];
    const positions = [
      { t: "8%", l: "6%" },
      { t: "15%", r: "8%" },
      { t: "55%", l: "4%" },
      { t: "70%", r: "12%" },
      { t: "25%", l: "45%" },
    ];
    positions.forEach((pos, i) => {
      const span = document.createElement("span");
      span.className = "hero-flower";
      span.textContent = symbols[i % symbols.length];
      span.style.top = pos.t;
      if (pos.l) span.style.left = pos.l;
      if (pos.r) span.style.right = pos.r;
      span.style.animationDelay = `${i * 0.7}s`;
      wrap.appendChild(span);
    });
  }

  /* ---------- Toast ---------- */
  function showToast(message, duration = 4200) {
    const toast = document.getElementById("toast-secret");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.hidden = true;
      }, 500);
    }, duration);
  }

  function revealCinematicStatic(cinematic) {
    cinematic
      .querySelectorAll(
        ".cinematic__hint, .cinematic__title, .cinematic__subtitle, .cinematic__tag, .cinematic .glass-btn"
      )
      .forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
  }

  /* ---------- Cinematic welcome ---------- */
  function initWelcome() {
    const cinematic = document.getElementById("cinematic-welcome");
    const btn = document.getElementById("enter-experience");
    const main = document.getElementById("main-content");
    const header = document.getElementById("site-header");

    if (!cinematic || !btn) return;

    if (typeof gsap === "undefined" || prefersReducedMotion) {
      revealCinematicStatic(cinematic);
    } else {
      gsap.set(".cinematic__hint", { opacity: 0 });
      gsap.set(".cinematic__title", { opacity: 0, y: 24 });
      gsap.set(".cinematic__subtitle", { opacity: 0 });
      gsap.set(".cinematic__tag", { opacity: 0 });
      gsap.set("#enter-experience", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".cinematic__hint", { opacity: 1, duration: 1.2, delay: 0.3 })
        .to(
          ".cinematic__title",
          { opacity: 1, y: 0, duration: 1.1 },
          "-=0.5"
        )
        .to(".cinematic__subtitle", { opacity: 1, duration: 0.9 }, "-=0.6")
        .to(".cinematic__tag", { opacity: 1, duration: 1 }, "-=0.5")
        .to("#enter-experience", { opacity: 1, duration: 0.8 }, "-=0.4");
    }

    function openMain() {
      cinematic.classList.add("is-leaving");
      cinematic.setAttribute("aria-hidden", "true");
      main.hidden = false;
      header.hidden = false;
      if (typeof AOS !== "undefined") AOS.refresh();
      const focusTarget = document.querySelector(".hero__title");
      if (focusTarget) {
        focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    }

    btn.addEventListener("click", () => {
      if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.to(cinematic, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: openMain,
        });
      } else {
        cinematic.style.opacity = "0";
        openMain();
      }
    });
  }

  function replayWelcome() {
    const cinematic = document.getElementById("cinematic-welcome");
    const main = document.getElementById("main-content");
    const header = document.getElementById("site-header");
    if (!cinematic) return;
    cinematic.classList.remove("is-leaving");
    cinematic.removeAttribute("aria-hidden");
    cinematic.style.opacity = "1";
    main.hidden = true;
    header.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof gsap !== "undefined" && !prefersReducedMotion) {
      gsap.fromTo(
        cinematic,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }

  /* ---------- Swiper ---------- */
  function initSwipers() {
    if (typeof Swiper === "undefined") return;

    new Swiper(".phrase-swiper", {
      loop: true,
      speed: 900,
      spaceBetween: 0,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: prefersReducedMotion
        ? false
        : { delay: 5200, disableOnInteraction: false },
      pagination: { el: ".phrase-swiper__pagination", clickable: true },
      navigation: {
        nextEl: ".phrase-swiper .swiper-button-next",
        prevEl: ".phrase-swiper .swiper-button-prev",
      },
    });

    new Swiper(".closing-swiper", {
      loop: true,
      speed: 600,
      spaceBetween: 20,
      autoplay: prefersReducedMotion
        ? false
        : { delay: 6000, disableOnInteraction: false },
      pagination: { el: ".closing-swiper__pagination", clickable: true },
    });
  }

  /* ---------- AOS ---------- */
  function initAOS() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
      easing: "ease-out-cubic",
      disable: prefersReducedMotion ? true : false,
    });
  }

  /* ---------- Quiz option cards ---------- */
  const REPLIES = {
    "reply-a":
      "Entonces hoy vas con energía de cometa. El universo aprueba el ritmo.",
    "reply-b":
      "Modo zen activado: conversación buena es el mejor filtro del día.",
    "reply-c":
      "Vitamina C + música = manual oficial de buen humor. Bien jugado.",
  };

  function initQuizCards() {
    const block = document.querySelector(".quiz-block");
    if (!block) return;
    const cards = block.querySelectorAll(".option-card[data-reply]");
    const replyEl = document.getElementById("quiz-reply-1");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        const key = card.getAttribute("data-reply");
        if (replyEl && REPLIES[key]) {
          replyEl.textContent = REPLIES[key];
          replyEl.hidden = false;
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              replyEl,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
            );
          }
        }
      });
    });
  }

  /* ---------- Slider ---------- */
  function initSlider() {
    const slider = document.getElementById("light-slider");
    const out = document.getElementById("slider-output");
    if (!slider || !out) return;
    function update() {
      const v = slider.value;
      const phrases = [
        "Aún así, mereces buena compañía y café caliente.",
        "Brillas lo justo para no deslumbrar… pero casi.",
        "Nivel estrella polar: guías sin pedir permiso.",
        "Radiante con medida: el cosmos te hace un gesto de respeto.",
      ];
      const idx = Math.min(3, Math.floor((v / 100) * 4));
      out.textContent = `Tu semana: ${v}% de constelación. ${phrases[idx]}`;
    }
    slider.addEventListener("input", update);
    update();
  }

  /* ---------- Jokes ---------- */
  function initJokes() {
    const punch = document.getElementById("joke-punchline");
    const btns = document.querySelectorAll(".joke-btn");
    const answers = {
      a: "Correcto: el cielo ya tiene engagement infinito.",
      b: "También válido: por eso a veces titilan con delay.",
    };
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        const j = b.getAttribute("data-joke");
        if (punch && answers[j]) {
          punch.textContent = answers[j];
          punch.hidden = false;
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              punch,
              { opacity: 0, scale: 0.98 },
              { opacity: 1, scale: 1, duration: 0.4 }
            );
          }
        }
      });
    });
  }

  /* ---------- Gift secrets ---------- */
  const SECRET_MESSAGES = {
    "secret-1": "Sorpresa uno: alguien piensa que tu sentido del humor es un regalo público.",
    "secret-2": "Sorpresa dos: la calma que transmites parece magia, pero es constancia.",
    "secret-3": "Sorpresa tres: este mensaje era obvio: eres difícil de olvidar en el buen sentido.",
  };

  function initGifts() {
    document.querySelectorAll(".gift[data-secret]").forEach((gift) => {
      gift.addEventListener("click", () => {
        const id = gift.getAttribute("data-secret");
        showToast(SECRET_MESSAGES[id] || "Un detalle brillante para ti.");
        if (typeof gsap !== "undefined") {
          gsap.fromTo(
            gift,
            { rotation: 0 },
            { rotation: 360, duration: 0.6, ease: "power2.out" }
          );
        }
      });
    });
  }

  /* ---------- Petal mini-game ---------- */
  const PETAL_WHISPERS = [
    "Susurro: hoy cuenta algo bonito, aunque sea pequeño.",
    "Pétalo capturado: mereces un momento sin prisa.",
    "Bien visto: la curiosidad también es una forma de arte.",
    "Pequeña victoria: sonreír sin motivo cuenta triple.",
    "El jardín cósmico te envía un guiño educado.",
  ];

  function initPetalGame() {
    const zone = document.getElementById("petal-game");
    const msg = document.getElementById("petal-msg");
    if (!zone || !msg) return;

    function dropPetal() {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "petal-game__click";
      btn.style.left = `${10 + Math.random() * 80}%`;
      btn.setAttribute("aria-label", "Atrapar pétalo");
      const duration = 3 + Math.random() * 2;
      btn.style.animationDuration = `${duration}s`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        msg.textContent =
          PETAL_WHISPERS[Math.floor(Math.random() * PETAL_WHISPERS.length)];
        btn.remove();
        if (typeof gsap !== "undefined") {
          gsap.fromTo(
            msg,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.35 }
          );
        }
      });
      zone.appendChild(btn);
      setTimeout(() => {
        if (btn.parentNode) btn.remove();
      }, duration * 1000 + 200);
    }

    const interval = prefersReducedMotion ? 5000 : 2200;
    setInterval(dropPetal, interval);
    dropPetal();
  }

  /* ---------- Star tap ---------- */
  const STAR_LINES = [
    "Estrella fugaz: que algo bueno te encuentre en calma.",
    "Destello: tu esfuerzo silencioso no es invisible.",
    "Luz breve: el respeto se nota en los detalles, y tú los tienes.",
    "Brillo: el humor sano es un superpoder subestimado.",
  ];

  function initStarTap() {
    const zone = document.getElementById("star-tap-zone");
    const msg = document.getElementById("star-msg");
    if (!zone || !msg) return;
    zone.addEventListener("click", (e) => {
      const rect = zone.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const burst = document.createElement("span");
      burst.className = "star-burst";
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;
      zone.appendChild(burst);
      setTimeout(() => burst.remove(), 900);
      msg.textContent =
        STAR_LINES[Math.floor(Math.random() * STAR_LINES.length)];
      if (typeof gsap !== "undefined") {
        gsap.fromTo(msg, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      }
    });
  }

  /* ---------- Spin flowers ---------- */
  function initSpinFlowers() {
    const wrap = document.getElementById("spin-flowers");
    if (!wrap) return;
    const fl = ["🌸", "🌺", "🌼", "💮", "🏵️"];
    fl.forEach((emoji) => {
      const s = document.createElement("span");
      s.className = "spin-flower";
      s.textContent = emoji;
      wrap.appendChild(s);
    });
  }

  /* ---------- Konami (↑↑↓↓) ---------- */
  function initKonami() {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"];
    let pos = 0;
    document.addEventListener("keydown", (e) => {
      if (e.key === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          const overlay = document.getElementById("konami-sparkle");
          if (overlay) {
            overlay.hidden = false;
            setTimeout(() => {
              overlay.hidden = true;
            }, 2000);
          }
          showToast(
            "Mensaje oculto: el universo guarda sitio para quienes iluminan sin alarde. Gracias por ser esa persona, Angela Ruth.",
            5500
          );
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              "body",
              { filter: "brightness(1)" },
              {
                filter: "brightness(1.08)",
                duration: 0.4,
                yoyo: true,
                repeat: 1,
              }
            );
          }
        }
      } else {
        pos = e.key === seq[0] ? 1 : 0;
      }
    });
  }

  /* ---------- Replay ---------- */
  document.getElementById("replay-welcome")?.addEventListener("click", replayWelcome);

  /* ---------- Boot ---------- */
  initStarfield();
  startBackgroundPetals();
  initHeroFlowers();
  initWelcome();
  initSwipers();
  initAOS();
  initQuizCards();
  initSlider();
  initJokes();
  initGifts();
  initPetalGame();
  initStarTap();
  initSpinFlowers();
  initKonami();
})();
