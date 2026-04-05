/**
 * Experiencia luminosa — intro cinematográfica, capítulos interactivos, Lenis, GSAP, Swiper.
 */
(function () {
  "use strict";

  const FEEDBACK_LINES = [
    "Buena elección, eso tiene mucho encanto.",
    "Esa respuesta combina perfecto con algo bonito.",
    "Se siente como una opción llena de luz.",
    "Hay respuestas que tienen una elegancia especial.",
    "Eso suena a alguien que aprecia los detalles.",
  ];

  const PLAYFUL_LINES = [
    "Advertencia: esta experiencia contiene niveles inesperados de dedicación.",
    "Las flores amarillas insistieron mucho en participar.",
    "El departamento de detalles bonitos aprobó esta sección por unanimidad.",
    "Si apareció una sonrisa por ahí, esta parte ya cumplió su trabajo.",
    "Todo esto fue cuidadosamente preparado por un exceso de inspiración.",
  ];

  const EMOTIONS = [
    { label: "Dulzura", phrase: "Hay gestos que ablandan el día sin decir mucho.", a: "#ffe566", b: "#ffd4c4" },
    { label: "Brillo", phrase: "Algunas personas traen su propia luz a cualquier espacio.", a: "#ffd27a", b: "#fff4d4" },
    { label: "Alegría", phrase: "Hay personas que naturalmente iluminan un momento.", a: "#ffe566", b: "#9bc9a8" },
    { label: "Encanto", phrase: "El encanto también es una forma silenciosa de arte.", a: "#ffc4dd", b: "#ffd4c4" },
    { label: "Calma", phrase: "La calma bonita no grita; se siente.", a: "#d8f4ff", b: "#e8d4ff" },
    { label: "Ternura", phrase: "La ternura se nota en los pequeños matices.", a: "#ffc4dd", b: "#fffbf5" },
    { label: "Inspiración", phrase: "No todos provocan ganas de crear algo especial.", a: "#e8d4ff", b: "#ffd27a" },
    {
      label: "Admiración",
      phrase: "Cuando alguien inspira algo bonito, se nota hasta en los detalles.",
      a: "#f4d48a",
      b: "#ff9ec7",
    },
  ];

  const QUIZ_QUESTIONS = [
    {
      q: "¿Qué detalle te parece más bonito en una experiencia especial?",
      options: ["Flores", "Música", "Una sorpresa creativa", "Palabras sinceras"],
    },
    {
      q: "Si un momento lindo tuviera color, ¿cuál sería?",
      options: ["Amarillo suave", "Rosa pastel", "Dorado claro", "Celeste brillante"],
    },
    {
      q: "¿Qué valoras más en alguien?",
      options: ["Sinceridad", "Sentido del humor", "Atención", "Ternura"],
    },
    {
      q: "¿Qué gesto te parece más inolvidable?",
      options: ["Algo hecho con dedicación", "Una sorpresa", "Una conversación bonita", "Un detalle inesperado"],
    },
    {
      q: "¿Qué te saca una sonrisa más rápido?",
      options: ["Algo tierno", "Algo divertido", "Algo inesperado", "Algo bonito y bien pensado"],
    },
    {
      q: "¿Cuál de estas flores transmite mejor una emoción bonita?",
      options: ["Girasol", "Rosa amarilla", "Tulipán", "Margarita"],
    },
    {
      q: "¿Qué te parece más valioso?",
      options: ["El tiempo", "La intención", "La creatividad", "La autenticidad"],
    },
    {
      q: "Si esta experiencia fuera un recuerdo, ¿cómo te gustaría describirla?",
      options: ["Alegre", "Tierna", "Sorprendente", "Especial"],
    },
  ];

  const GIFT_MESSAGES = [
    "Lo bonito también puede sentirse en la intención.",
    "Algunas personas merecen detalles que se noten diferentes.",
    "No todo se dice de frente; a veces se diseña con cuidado.",
    "Hay presencias que vuelven más elegante hasta una idea.",
    "A veces, crear algo especial también es una forma de expresar aprecio.",
  ];

  const GIFT_ICONS = ["✦", "❀", "✧", "🎁", "🌼", "💛"];

  const els = {
    intro: document.getElementById("intro"),
    mainStage: document.getElementById("main-stage"),
    mainHeader: document.getElementById("main-header"),
    heartPath: document.getElementById("heart-path"),
    heartFill: document.getElementById("heart-fill"),
    heartShine: document.getElementById("heart-shine"),
    bouquetRoot: document.getElementById("bouquet-root"),
    bouquetScale: document.getElementById("bouquet-scale"),
    introCopy: document.getElementById("intro-copy"),
    btnEnter: document.getElementById("btn-enter"),
    btnRelive: document.getElementById("btn-relive"),
    btnMusicIntro: document.getElementById("btn-music-intro"),
    btnMusicMain: document.getElementById("btn-music-main"),
    audio: document.getElementById("ambient-audio"),
    introGold: document.getElementById("intro-gold-dust"),
    roseSparkles: document.getElementById("rose-sparkles"),
    cnParticles: document.getElementById("cn-particles"),
    petalsGlobal: document.getElementById("petals-global"),
    readProgressFill: document.getElementById("read-progress-fill"),
    bubbleGrid: document.getElementById("bubble-grid"),
    quizStage: document.getElementById("quiz-stage"),
    quizBar: document.getElementById("quiz-bar"),
    quizStepLabel: document.getElementById("quiz-step-label"),
    quizFeedback: document.getElementById("quiz-feedback"),
    quizPrev: document.getElementById("quiz-prev"),
    quizNext: document.getElementById("quiz-next"),
    playfulCard: document.getElementById("playful-card"),
    btnPlayfulNext: document.getElementById("btn-playful-next"),
    giftGrid: document.getElementById("gift-grid"),
    petalTapZone: document.getElementById("petal-tap-zone"),
    globalToast: document.getElementById("global-toast"),
  };

  let lenis = null;
  let introTimeline = null;
  let introIdleTweens = [];
  let sparkleInterval = null;
  let quizIndex = 0;
  const quizAnswers = [];
  let playfulIndex = 0;
  let secondaryInited = false;
  let particlesRaf = null;

  function randomFeedback() {
    return FEEDBACK_LINES[Math.floor(Math.random() * FEEDBACK_LINES.length)];
  }

  function showToast(msg, ms = 3200) {
    if (!els.globalToast) return;
    els.globalToast.textContent = msg;
    els.globalToast.hidden = false;
    els.globalToast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      els.globalToast.classList.remove("is-visible");
      setTimeout(() => {
        els.globalToast.hidden = true;
      }, 400);
    }, ms);
  }

  function setMusicUi(on) {
    [els.btnMusicIntro, els.btnMusicMain].forEach((btn) => {
      if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function toggleMusic() {
    if (!els.audio) return;
    if (els.audio.paused) {
      els.audio
        .play()
        .then(() => setMusicUi(true))
        .catch(() => showToast("Toca de nuevo para activar el audio del navegador."));
    } else {
      els.audio.pause();
      setMusicUi(false);
    }
  }

  function spawnIntroDust() {
    if (!els.introGold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = document.createElement("span");
    d.className = "dust";
    d.style.left = `${40 + Math.random() * 20}%`;
    d.style.top = `${38 + Math.random() * 22}%`;
    d.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
    d.style.setProperty("--dy", `${-30 - Math.random() * 60}px`);
    els.introGold.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }

  function startSparkles() {
    if (!els.roseSparkles) return;
    stopSparkles();
    const add = () => {
      const sp = document.createElement("span");
      sp.className = "sp";
      sp.style.left = `${12 + Math.random() * 76}%`;
      sp.style.top = `${8 + Math.random() * 78}%`;
      const sc = 0.75 + Math.random() * 0.85;
      els.roseSparkles.appendChild(sp);
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          sp,
          { opacity: 0, scale: 0, rotation: 0 },
          {
            opacity: 1,
            scale: sc,
            rotation: (Math.random() - 0.5) * 40,
            duration: 0.42,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            yoyoEase: "power2.in",
            onComplete: () => sp.remove(),
          }
        );
      } else {
        sp.style.opacity = "1";
        setTimeout(() => sp.remove(), 700);
      }
    };
    sparkleInterval = setInterval(add, 145);
  }

  function stopSparkles() {
    if (sparkleInterval) clearInterval(sparkleInterval);
    sparkleInterval = null;
    if (els.roseSparkles) els.roseSparkles.innerHTML = "";
  }

  function stopIntroRoseIdle() {
    introIdleTweens.forEach((t) => t.kill());
    introIdleTweens = [];
    const sway = document.querySelector(".cine-bouquet__sway");
    const img = document.getElementById("bouquet-photo");
    if (typeof gsap !== "undefined") {
      if (sway) gsap.set(sway, { clearProps: "rotation,x,transform" });
      if (img) gsap.set(img, { clearProps: "filter" });
    }
  }

  /** Movimiento suave continuo de la rosa tras terminar la intro (luz viva). */
  function startIntroRoseIdle() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof gsap === "undefined") return;
    stopIntroRoseIdle();
    const sway = document.querySelector(".cine-bouquet__sway");
    const img = document.getElementById("bouquet-photo");
    if (sway) {
      introIdleTweens.push(
        gsap.to(sway, {
          rotation: 3.2,
          x: 9,
          y: -5,
          transformOrigin: "50% 92%",
          duration: 3.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );
    }
    if (img) {
      introIdleTweens.push(
        gsap.to(img, {
          filter:
            "brightness(1.16) saturate(1.14) drop-shadow(0 0 40px rgba(255,244,200,1)) drop-shadow(0 0 56px rgba(255,214,130,0.65)) drop-shadow(0 18px 48px rgba(255,160,110,0.45))",
          duration: 2.45,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );
    }
  }

  function resetIntroVisuals() {
    stopSparkles();
    if (els.introGold) els.introGold.innerHTML = "";
    if (els.heartPath) {
      const len = els.heartPath.getTotalLength();
      els.heartPath.style.strokeDasharray = `${len}`;
      els.heartPath.style.strokeDashoffset = `${len}`;
    }
    stopIntroRoseIdle();
    if (typeof gsap !== "undefined") {
      if (els.heartFill) gsap.set(els.heartFill, { opacity: 0 });
      if (els.heartShine) gsap.set(els.heartShine, { opacity: 0 });
      if (els.bouquetRoot) gsap.set(els.bouquetRoot, { opacity: 0 });
      if (els.bouquetScale) gsap.set(els.bouquetScale, { scale: 0.08 });
      if (els.introCopy) {
        els.introCopy.hidden = true;
        gsap.set(els.introCopy, { opacity: 0, y: 16 });
      }
    } else {
      if (els.heartFill) els.heartFill.style.opacity = "0";
      if (els.heartShine) els.heartShine.style.opacity = "0";
      if (els.bouquetRoot) els.bouquetRoot.style.opacity = "0";
      if (els.bouquetScale) els.bouquetScale.style.transform = "scale(0.08)";
      if (els.introCopy) {
        els.introCopy.hidden = true;
        els.introCopy.style.opacity = "0";
      }
    }
  }

  function runIntroSequence() {
    if (typeof gsap === "undefined") {
      if (els.introCopy) els.introCopy.hidden = false;
      if (els.bouquetRoot) els.bouquetRoot.style.opacity = "1";
      if (els.bouquetScale) els.bouquetScale.style.transform = "scale(1)";
      return;
    }

    if (introTimeline) introTimeline.kill();
    resetIntroVisuals();

    const pathLen = els.heartPath ? els.heartPath.getTotalLength() : 0;
    if (els.heartPath) {
      els.heartPath.style.strokeDasharray = String(pathLen);
      els.heartPath.style.strokeDashoffset = String(pathLen);
    }

    let dustTicker = 0;
    introTimeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    if (els.heartPath) {
      introTimeline.to(els.heartPath, {
        strokeDashoffset: 0,
        duration: 3.35,
        ease: "power2.inOut",
        onUpdate: () => {
          dustTicker++;
          if (dustTicker % 4 === 0) spawnIntroDust();
        },
      });
    }

    if (els.heartFill) introTimeline.to(els.heartFill, { opacity: 0.62, duration: 0.85 }, "-=0.35");
    if (els.heartShine) introTimeline.to(els.heartShine, { opacity: 0.42, duration: 0.65 }, "<0.1");

    if (els.bouquetRoot) {
      introTimeline.to(els.bouquetRoot, { opacity: 1, duration: 0.55, ease: "power2.out" }, "+=0.15");
    }
    if (els.bouquetScale) {
      introTimeline.to(
        els.bouquetScale,
        {
          scale: 1,
          duration: 2.45,
          ease: "power3.out",
          onStart: () => startSparkles(),
        },
        "<0.08"
      );
    }

    const bouquetPhoto = document.getElementById("bouquet-photo");
    if (bouquetPhoto) {
      introTimeline.fromTo(
        bouquetPhoto,
        { scale: 0.88, filter: "blur(6px)" },
        { scale: 1, filter: "blur(0px)", duration: 2.2, ease: "power2.out" },
        "<0.1"
      );
    }

    if (els.introCopy) {
      introTimeline.to(
        els.introCopy,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          onStart: () => {
            els.introCopy.hidden = false;
          },
        },
        "+=0.35"
      );
    }

    introTimeline.eventCallback("onComplete", () => {
      startIntroRoseIdle();
    });
  }

  function enterExperience() {
    if (!els.intro) return;
    if (typeof gsap !== "undefined") {
      gsap.to(els.intro, {
        opacity: 0,
        duration: 0.85,
        ease: "power2.inOut",
        onComplete: () => {
          els.intro.classList.add("is-done");
          els.intro.style.opacity = "";
          stopSparkles();
          stopIntroRoseIdle();
        },
      });
    } else {
      els.intro.classList.add("is-done");
    }

    if (els.mainStage) els.mainStage.hidden = false;
    if (els.mainHeader) els.mainHeader.hidden = false;
    initSecondary();
    if (lenis && typeof lenis.start === "function") lenis.start();
  }

  function initLenis() {
    if (typeof Lenis === "undefined") return;
    if (lenis && typeof lenis.destroy === "function") lenis.destroy();
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    document.documentElement.classList.add("lenis");
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function initAos() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 900,
      once: true,
      offset: 40,
      easing: "ease-out-cubic",
    });
  }

  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    const el = document.querySelector(".film-swiper");
    if (!el || el.swiper) return;
    new Swiper(".film-swiper", {
      loop: true,
      speed: 750,
      grabCursor: true,
      spaceBetween: 20,
      slidesPerView: 1,
      pagination: { el: ".film-swiper__pag", clickable: true },
      navigation: {
        nextEl: ".film-swiper .swiper-button-next",
        prevEl: ".film-swiper .swiper-button-prev",
      },
    });
  }

  /** Partículas suaves en canvas (ligero) */
  function initParticles() {
    const canvas = els.cnParticles;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    const dots = [];

    function resize() {
      w = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5);
      h = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    for (let i = 0; i < 48; i++) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.00012,
        vy: (Math.random() - 0.5) * 0.0001,
        a: 0.12 + Math.random() * 0.35,
      });
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 214, 140, ${d.a})`;
        ctx.arc(d.x * w, d.y * h, d.r * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fill();
      });
      particlesRaf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) frame();
  }

  function spawnGlobalPetal() {
    if (!els.petalsGlobal || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const p = document.createElement("span");
    p.className = "petal-float";
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${10 + Math.random() * 14}s`;
    p.style.animationDelay = `${Math.random() * 4}s`;
    els.petalsGlobal.appendChild(p);
    setTimeout(() => p.remove(), 28000);
  }

  function petalLoop() {
    spawnGlobalPetal();
    setTimeout(petalLoop, 1800 + Math.random() * 2200);
  }

  function initEmotionBubbles() {
    if (!els.bubbleGrid) return;
    els.bubbleGrid.innerHTML = "";
    EMOTIONS.forEach((em) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "emotion-bubble";
      btn.style.setProperty("--bubble-a", em.a);
      btn.style.setProperty("--bubble-b", em.b);
      btn.innerHTML = `<span class="emotion-bubble__label">${em.label}</span>
        <div class="emotion-bubble__reveal" role="tooltip"><p style="margin:0">${em.phrase}</p></div>`;
      btn.addEventListener("click", () => {
        const open = btn.classList.contains("is-open");
        els.bubbleGrid.querySelectorAll(".emotion-bubble.is-open").forEach((b) => b.classList.remove("is-open"));
        if (!open) btn.classList.add("is-open");
      });
      els.bubbleGrid.appendChild(btn);
    });
  }

  function renderQuizStep() {
    if (!els.quizStage || !els.quizStepLabel || !els.quizBar || !els.quizFeedback) return;
    const q = QUIZ_QUESTIONS[quizIndex];
    const total = QUIZ_QUESTIONS.length;
    els.quizStepLabel.textContent = `${quizIndex + 1} / ${total}`;
    els.quizBar.style.width = `${((quizIndex + 1) / total) * 100}%`;

    const selected = quizAnswers[quizIndex];
    els.quizStage.innerHTML = `<h3 class="quiz-q">${q.q}</h3><div class="chip-row" id="quiz-chips"></div>`;
    const row = document.getElementById("quiz-chips");
    if (!row) return;
    q.options.forEach((opt, i) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "quiz-chip";
      chip.textContent = opt;
      if (selected === i) chip.classList.add("is-selected");
      chip.addEventListener("click", () => {
        quizAnswers[quizIndex] = i;
        row.querySelectorAll(".quiz-chip").forEach((c) => c.classList.remove("is-selected"));
        chip.classList.add("is-selected");
        els.quizFeedback.hidden = false;
        els.quizFeedback.textContent = randomFeedback();
      });
      row.appendChild(chip);
    });

    els.quizPrev.disabled = quizIndex === 0;
    els.quizNext.textContent = quizIndex === total - 1 ? "Listo ✦" : "Siguiente";

    if (selected !== undefined) {
      els.quizFeedback.hidden = false;
      els.quizFeedback.textContent = randomFeedback();
    } else {
      els.quizFeedback.hidden = true;
      els.quizFeedback.textContent = "";
    }
  }

  function initQuiz() {
    if (!els.quizPrev || !els.quizNext) return;
    quizIndex = 0;
    quizAnswers.length = 0;
    els.quizPrev.addEventListener("click", () => {
      if (quizIndex > 0) {
        quizIndex--;
        renderQuizStep();
      }
    });
    els.quizNext.addEventListener("click", () => {
      if (quizAnswers[quizIndex] === undefined) {
        showToast("Elige una opción para continuar.");
        return;
      }
      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
        quizIndex++;
        renderQuizStep();
      } else {
        showToast("Gracias por recorrer el jardín de preguntas con calma.");
      }
    });
    renderQuizStep();
  }

  function initPlayful() {
    if (!els.playfulCard || !els.btnPlayfulNext) return;
    playfulIndex = 0;
    els.playfulCard.textContent = PLAYFUL_LINES[0];
    els.btnPlayfulNext.addEventListener("click", () => {
      playfulIndex = (playfulIndex + 1) % PLAYFUL_LINES.length;
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          els.playfulCard,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", onStart: () => {
            els.playfulCard.textContent = PLAYFUL_LINES[playfulIndex];
          }}
        );
      } else {
        els.playfulCard.textContent = PLAYFUL_LINES[playfulIndex];
      }
    });
  }

  function initGifts() {
    if (!els.giftGrid) return;
    els.giftGrid.innerHTML = "";
    GIFT_MESSAGES.forEach((msg, i) => {
      const box = document.createElement("button");
      box.type = "button";
      box.className = "gift-box";
      box.innerHTML = `<span class="gift-box__icon">${GIFT_ICONS[i % GIFT_ICONS.length]}</span><span class="gift-box__tag">Abrir</span>`;
      box.addEventListener("click", () => {
        if (box.classList.contains("is-opened")) return;
        box.classList.add("is-opened");
        box.querySelector(".gift-box__tag").textContent = "✓";
        showToast(msg, 4000);
        if (typeof gsap !== "undefined") {
          gsap.fromTo(box, { rotate: -2 }, { rotate: 0, duration: 0.4, ease: "elastic.out(1,0.5)" });
        }
      });
      els.giftGrid.appendChild(box);
    });
  }

  const PETAL_HINTS = [
    "Un detalle más, flotando.",
    "Como un pétalo: ligero y sincero.",
    "Eso también cuenta como magia moderna.",
  ];
  let petalHintI = 0;

  function spawnTappablePetal() {
    if (!els.petalTapZone) return;
    const z = els.petalTapZone.getBoundingClientRect();
    if (z.width < 40) return;
    const p = document.createElement("span");
    p.className = "petal-float petal-float--tap";
    p.style.left = `${10 + Math.random() * 80}%`;
    p.style.top = `-20px`;
    p.style.animation = "petal-fall 8s linear forwards";
    p.addEventListener("click", (e) => {
      e.stopPropagation();
      showToast(PETAL_HINTS[petalHintI % PETAL_HINTS.length]);
      petalHintI++;
      p.remove();
    });
    els.petalTapZone.appendChild(p);
    setTimeout(() => p.remove(), 9000);
  }

  function initPetalZone() {
    if (!els.petalTapZone) return;
    setInterval(spawnTappablePetal, 3200);
  }

  function updateScrollProgress() {
    if (!els.readProgressFill) return;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max <= 0 ? 100 : (scrollTop / max) * 100;
    els.readProgressFill.style.width = `${Math.min(100, p)}%`;
  }

  function spawnScenePetals(cap, count) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = Math.min(Math.max(count, 4), 14);
    const wrap = document.createElement("div");
    wrap.className = "scene-petal-burst";
    wrap.setAttribute("aria-hidden", "true");
    const host = cap.querySelector(".cap__inner") || cap;
    host.appendChild(wrap);
    const bits = [];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "scene-petal-bit";
      p.style.left = `${32 + Math.random() * 36}%`;
      p.style.top = `${28 + Math.random() * 32}%`;
      wrap.appendChild(p);
      bits.push(p);
    }
    const cleanup = () => {
      wrap.remove();
    };
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        bits,
        { x: 0, y: 0, opacity: 0.95, scale: 0, rotation: 0 },
        {
          x: () => (Math.random() - 0.5) * 140,
          y: () => -60 - Math.random() * 100,
          opacity: 0,
          scale: 1,
          rotation: () => (Math.random() - 0.5) * 180,
          duration: () => 0.95 + Math.random() * 0.55,
          stagger: 0.035,
          ease: "power2.out",
          onComplete: cleanup,
        }
      );
    } else {
      setTimeout(cleanup, 1400);
    }
  }

  /** Golpe cinematográfico suave al entrar en cada escena (se puede repetir al volver a scroll). */
  function playSectionSurprise(cap) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (cap._sceneTl && typeof cap._sceneTl.kill === "function") cap._sceneTl.kill();

    const id = cap.id;
    const petalCount =
      id === "cap-cierre" ? 12 : id === "cap-luz" ? 10 : id === "cap-regalos" ? 9 : id === "cap-emociones" ? 8 : 7;

    if (typeof gsap === "undefined") {
      spawnScenePetals(cap, petalCount);
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    cap._sceneTl = tl;

    switch (id) {
      case "cap-luz": {
        const frags = cap.querySelectorAll(".title-frag");
        const hero = cap.querySelector(".hero-bloom");
        const tiles = cap.querySelectorAll(".pulse-tile");
        if (frags.length) tl.to(frags, { y: -8, duration: 0.3, stagger: 0.06, yoyo: true, repeat: 1 }, 0);
        if (hero) tl.to(hero, { scale: 1.05, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
        if (tiles.length) {
          tl.to(
            tiles,
            {
              y: -10,
              boxShadow: "0 40px 100px rgba(255,200,140,0.32)",
              duration: 0.36,
              stagger: 0.05,
              yoyo: true,
              repeat: 1,
            },
            0.05
          );
        }
        break;
      }
      case "cap-emociones": {
        const idx = cap.querySelector(".scene-index");
        /* No tocamos las burbujas con GSAP para no pisar su flotación CSS. */
        if (idx) tl.to(idx, { scale: 1.05, duration: 0.4, transformOrigin: "50% 50%", yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
        break;
      }
      case "cap-jardin": {
        const panel = cap.querySelector(".garden-panel");
        if (panel) tl.to(panel, { y: -8, duration: 0.42, yoyo: true, repeat: 1, ease: "power2.out" }, 0);
        break;
      }
      case "cap-momentos": {
        const st = cap.querySelector(".playful-sticker");
        if (st) {
          tl.to(st, { rotation: 5, scale: 1.06, duration: 0.28, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0);
        }
        break;
      }
      case "cap-regalos": {
        const gifts = cap.querySelectorAll(".gift-box");
        if (gifts.length) {
          tl.to(gifts, {
            y: -5,
            rotation: 3,
            duration: 0.28,
            stagger: { each: 0.045, from: "center" },
            yoyo: true,
            repeat: 1,
          }, 0);
        }
        break;
      }
      case "cap-historia": {
        const sw = cap.querySelector(".film-swiper");
        if (sw) tl.to(sw, { scale: 1.022, duration: 0.55, ease: "power1.inOut", yoyo: true, repeat: 1 }, 0);
        break;
      }
      case "cap-cierre": {
        const shards = cap.querySelectorAll(".finale-shard");
        if (shards.length) {
          tl.to(shards, { y: -12, duration: 0.42, stagger: 0.09, yoyo: true, repeat: 1, ease: "power2.out" }, 0);
        }
        break;
      }
      default:
        break;
    }

    tl.add(() => spawnScenePetals(cap, petalCount), 0.02);
  }

  function initSectionWake() {
    if (typeof IntersectionObserver === "undefined") return;
    const caps = document.querySelectorAll(".cap");
    if (!caps.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cap = entry.target;
          if (entry.isIntersecting) {
            cap.classList.add("cap--awake");
            requestAnimationFrame(() => playSectionSurprise(cap));
          } else {
            cap.classList.remove("cap--awake");
          }
        });
      },
      { threshold: 0.18, rootMargin: "-7% 0px -11% 0px" }
    );
    caps.forEach((c) => io.observe(c));
  }

  function initParallax() {
    const layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;
    let mx = 0.5;
    let my = 0.5;
    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX / window.innerWidth;
        my = e.clientY / window.innerHeight;
      },
      { passive: true }
    );
    function tick() {
      layers.forEach((layer) => {
        const str = parseFloat(layer.getAttribute("data-parallax") || "0.05");
        const dx = (mx - 0.5) * 40 * str;
        const dy = (my - 0.5) * 40 * str;
        layer.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      requestAnimationFrame(tick);
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) tick();
  }

  function initSecondary() {
    if (secondaryInited) {
      initAos();
      if (typeof AOS !== "undefined") AOS.refresh();
      return;
    }
    secondaryInited = true;
    initLenis();
    initAos();
    initSwiper();
    initParticles();
    petalLoop();
    initEmotionBubbles();
    initQuiz();
    initPlayful();
    initGifts();
    initPetalZone();
    initParallax();
    initSectionWake();

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();
    if (lenis && typeof lenis.on === "function") lenis.on("scroll", updateScrollProgress);
  }

  function relive() {
    if (lenis && typeof lenis.scrollTo === "function") lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    if (!els.intro) return;
    els.intro.classList.remove("is-done");
    els.intro.style.opacity = "1";
    if (els.mainStage) els.mainStage.hidden = true;
    if (els.mainHeader) els.mainHeader.hidden = true;
    if (lenis && typeof lenis.stop === "function") lenis.stop();

    runIntroSequence();
    showToast("De nuevo, con la misma intención.");
  }

  /* Eventos */
  if (els.btnEnter) els.btnEnter.addEventListener("click", enterExperience);
  if (els.btnRelive) els.btnRelive.addEventListener("click", relive);
  if (els.btnMusicIntro) els.btnMusicIntro.addEventListener("click", toggleMusic);
  if (els.btnMusicMain) els.btnMusicMain.addEventListener("click", toggleMusic);

  /* Imagen del ramo: fallback si falta archivo */
  const bouquetImg = document.getElementById("bouquet-photo");
  if (bouquetImg) {
    bouquetImg.addEventListener("error", () => {
      bouquetImg.style.display = "none";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => runIntroSequence());
  } else {
    runIntroSequence();
  }
})();
