// ====== ТОХИРГОО — энд засна ======
const WEDDING_DATE = new Date("2026-09-12T15:00:00"); // Хуримын огноо ба цаг

// ====== Хөдөлгөөн багасгах горим (JS хамгаалалт) ======
const RM = matchMedia("(prefers-reduced-motion: reduce)");
let reduce = RM.matches;
RM.addEventListener("change", (e) => { reduce = e.matches; });
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

// ====== COUNTDOWN ======
const els = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};
const cdToday = document.getElementById("cd-today");
const cdRow = document.getElementById("countdown");
function pad(n) { return String(n).padStart(2, "0"); }

// Зөвхөн өөрчлөгдсөн талбарыг шинэчилж, нялуун эргэлт хийнэ
function setField(el, value) {
  if (el.textContent === value) return;
  el.textContent = value;
  if (reduce) return;
  el.classList.remove("flip");
  // reflow → дахин ажиллуулах
  void el.offsetWidth;
  el.classList.add("flip");
  el.style.willChange = "transform";
}
els.days.addEventListener("animationend", () => { els.days.classList.remove("flip"); els.days.style.willChange = ""; });
els.hours.addEventListener("animationend", () => { els.hours.classList.remove("flip"); els.hours.style.willChange = ""; });
els.mins.addEventListener("animationend", () => { els.mins.classList.remove("flip"); els.mins.style.willChange = ""; });
els.secs.addEventListener("animationend", () => { els.secs.classList.remove("flip"); els.secs.style.willChange = ""; });

let countdownDone = false;
function tick() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    if (!countdownDone) {
      countdownDone = true;
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = "00";
      if (cdRow) cdRow.hidden = true;
      if (cdToday) cdToday.hidden = false;
    }
    return;
  }
  const s = Math.floor(diff / 1000);
  setField(els.days, pad(Math.floor(s / 86400)));
  setField(els.hours, pad(Math.floor((s % 86400) / 3600)));
  setField(els.mins, pad(Math.floor((s % 3600) / 60)));
  setField(els.secs, pad(s % 60));
}
tick();
setInterval(tick, 1000);

// ====== Stagger engine ======
// .reveal харагдах үед --i бүхий хүүхдүүдэд transition-delay аль хэдийн CSS-ээр өгөгдсөн.
// Энд will-change-ийг түр зуур тавьж, transition дуусахад арилгана.
function primeWillChange(el) {
  if (reduce) return;
  el.style.willChange = "opacity, transform, filter";
  const clear = () => { el.style.willChange = ""; el.removeEventListener("transitionend", clear); };
  el.addEventListener("transitionend", clear);
}

// ====== REVEAL on scroll ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      primeWillChange(e.target);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ====== Hero choreographed entrance + sprig self-draw ======
const heroContent = document.querySelector(".hero-content");
function drawSprig(svg) {
  if (!svg) return;
  svg.querySelectorAll("path").forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = reduce ? 0 : len;
  });
  if (!reduce) requestAnimationFrame(() => svg.classList.add("drawn"));
}
function initHero() {
  requestAnimationFrame(() => {
    heroContent && heroContent.classList.add("visible");
    drawSprig(document.querySelector(".sprig-tl"));
    drawSprig(document.querySelector(".sprig-br"));
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHero);
} else {
  initHero();
}

// ====== GALLERY "develop" on scroll ======
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("developed");
      galleryObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.35 });
const gItems = Array.from(document.querySelectorAll(".g-item"));
gItems.forEach((el) => galleryObserver.observe(el));

// ====== LIGHTBOX ======
(function setupLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb || !gItems.length) return;
  const lbImg = lb.querySelector(".lb-img");
  const lbCaption = lb.querySelector(".lb-caption");
  const lbCounter = lb.querySelector(".lb-counter");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");

  const slides = gItems.map((b) => {
    const img = b.querySelector("img");
    return { src: img.getAttribute("src"), caption: b.dataset.caption || "", alt: img.getAttribute("alt") || "" };
  });
  let current = 0;
  let lastTrigger = null;

  function preload(i) {
    [i - 1, i + 1].forEach((n) => {
      if (n >= 0 && n < slides.length) { const im = new Image(); im.src = slides[n].src; }
    });
  }
  function render() {
    const s = slides[current];
    lbCaption.textContent = s.caption;
    lbCounter.textContent = (current + 1) + " / " + slides.length;
    lbImg.alt = s.alt;
    if (reduce) {
      lbImg.src = s.src;
    } else {
      lbImg.classList.add("focusing");
      const swap = () => { lbImg.src = s.src; lbImg.classList.remove("focusing"); };
      // богино cross-fade
      setTimeout(swap, 180);
    }
    preload(current);
  }
  function open(i, trigger) {
    current = i; lastTrigger = trigger || null;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    const s = slides[current];
    lbImg.src = s.src; lbImg.alt = s.alt;
    lbCaption.textContent = s.caption;
    lbCounter.textContent = (current + 1) + " / " + slides.length;
    requestAnimationFrame(() => lb.classList.add("open"));
    preload(current);
    btnClose.focus();
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    const done = () => {
      lb.hidden = true;
      lb.removeEventListener("transitionend", done);
      if (lastTrigger) lastTrigger.focus();
    };
    if (reduce) { done(); } else { lb.addEventListener("transitionend", done); }
  }
  function go(dir) {
    current = (current + dir + slides.length) % slides.length;
    render();
  }

  gItems.forEach((b, i) => b.addEventListener("click", () => open(i, b)));
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "Tab") {
      // Фокус хавх
      const focusable = [btnClose, btnPrev, btnNext];
      const idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? (idx <= 0 ? focusable.length - 1 : idx - 1)
                              : (idx === focusable.length - 1 ? 0 : idx + 1);
      focusable[next].focus();
    }
  });

  // Хүрэлцэх swipe
  let sx = 0, sy = 0, swiping = false;
  lb.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; swiping = true; });
  lb.addEventListener("pointerup", (e) => {
    if (!swiping) return; swiping = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  });
})();

// ====== Уналт цэцгийн дэлбээ (нэг канвас, нэг rAF) ======
const canvas = document.getElementById("petalCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let petals = [];
let dpr = 1;
let canvasW = 0, canvasH = 0;

const PETAL_TINTS = ["rgba(245,241,234,1)", "rgba(177,143,90,.5)"]; // --ivory / --gold

function sizeCanvas() {
  if (!canvas) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  canvas.width = Math.floor(canvasW * dpr);
  canvas.height = Math.floor(canvasH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function makePetal(seedTop) {
  return {
    x: Math.random() * canvasW,
    y: seedTop ? -20 - Math.random() * canvasH : Math.random() * canvasH,
    size: 9 + Math.random() * 11,
    vy: 18 + Math.random() * 16,            // 18–34 px/s
    swayAmp: 14 + Math.random() * 26,
    swayFreq: 0.4 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.6,
    opacity: 0.18 + Math.random() * 0.27,   // 0.18–0.45
    tint: PETAL_TINTS[Math.random() < 0.5 ? 0 : 1],
  };
}
function initPetals() {
  const count = window.innerWidth < 760 ? 4 : 8;
  petals = [];
  for (let i = 0; i < count; i++) petals.push(makePetal(false));
}
// petal.svg-ийн дусал хэлбэрийг вектороор зурна
function drawPetal(p) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.tint;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.9, -s * 0.55, s * 1.05, s * 0.45, s * 0.5, s);
  ctx.bezierCurveTo(s * 0.18, s * 1.18, -s * 0.18, s * 1.18, -s * 0.5, s);
  ctx.bezierCurveTo(-s * 1.05, s * 0.45, -s * 0.9, -s * 0.55, 0, -s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ====== ЕРӨНХИЙ rAF (петал + явц + hero parallax) ======
const progressBar = document.querySelector(".scroll-progress i");
const heroMonogram = document.querySelector(".hero-monogram");
const heroEl = document.querySelector(".hero");
let ticking = false;
let scrollY = window.scrollY || 0;
let lastTime = performance.now();
let rafId = null;
let running = false;

function onScroll() {
  scrollY = window.scrollY || window.pageYOffset || 0;
  if (!reduce && !ticking) { ticking = true; }
}
window.addEventListener("scroll", onScroll, { passive: true });

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  // READ
  const sh = document.documentElement.scrollHeight - window.innerHeight;
  const progress = sh > 0 ? scrollY / sh : 0;

  // WRITE — scroll явц
  if (progressBar) progressBar.style.transform = "scaleX(" + Math.min(progress, 1) + ")";

  // WRITE — hero monogram parallax (богино дэлгэц дээр хөдөлгөхгүй)
  if (heroMonogram && window.innerHeight > 520) {
    const py = scrollY * -0.06;
    heroMonogram.style.transform = "translate(-50%,-54%) translateY(" + py.toFixed(1) + "px)";
  }

  // WRITE — петал алхам (зөвхөн hero харагдаж байх үед бус, бүх үед нялуун)
  if (petals.length && ctx) {
    ctx.clearRect(0, 0, canvasW, canvasH);
    for (const p of petals) {
      p.y += p.vy * dt;
      p.phase += p.swayFreq * dt;
      p.x += Math.sin(p.phase) * p.swayAmp * dt;
      p.rot += p.vrot * dt;
      if (p.y - p.size > canvasH) {
        Object.assign(p, makePetal(true));
      }
      drawPetal(p);
    }
  }

  ticking = false;
  rafId = requestAnimationFrame(frame);
}

function startLoop() {
  if (running || reduce) return;
  running = true;
  lastTime = performance.now();
  rafId = requestAnimationFrame(frame);
}
function stopLoop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (reduce) return;
    sizeCanvas();
    initPetals();
  }, 200);
}, { passive: true });

// Таб нуугдах үед зогсооно
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLoop();
  else if (!reduce) startLoop();
});

if (!reduce && canvas && ctx) {
  sizeCanvas();
  initPetals();
  startLoop();
}

// ====== Соронзон + туяат товч (зөвхөн нарийн заагч) ======
if (finePointer && !reduce) {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.add("magnetic");
    let bx = 0, by = 0, raf = null;
    function apply() {
      btn.style.transform = "translate(" + bx.toFixed(1) + "px," + by.toFixed(1) + "px)";
      raf = null;
    }
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      bx = Math.max(-8, Math.min(8, dx * 0.25));
      by = Math.max(-8, Math.min(8, dy * 0.25));
      if (!raf) raf = requestAnimationFrame(apply);
    });
    const resetBtn = () => { bx = 0; by = 0; btn.style.transform = ""; };
    btn.addEventListener("pointerleave", resetBtn);
    btn.addEventListener("blur", resetBtn);
  });
}

// ====== ХӨГЖИМ ======
// Аудио файл бодитоор тоглуулах боломжтой бол л товчийг харуулна.
// Файл байхгүй (404) эсвэл дэмжигдэхгүй бол товч нуугдсан хэвээр үлдэж,
// зочин ямар ч алдааны цонхтой таарахгүй.
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
if (music && musicBtn) {
  let musicReady = false;
  const enableMusic = () => {
    if (musicReady) return;
    musicReady = true;
    musicBtn.hidden = false;
  };
  // canplay → тоглуулах хангалттай өгөгдөл ачаалагдсан
  music.addEventListener("canplay", enableMusic);
  // preload="none" тул сэжүүр өгөхийн тулд metadata-г татаж эхлүүлнэ
  if (music.readyState >= 3) {
    enableMusic();
  } else {
    music.load();
  }

  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      const p = music.play();
      const onPlay = () => {
        musicBtn.classList.add("playing");
        musicBtn.setAttribute("aria-pressed", "true");
        if (!reduce) {
          musicBtn.classList.remove("pulse");
          void musicBtn.offsetWidth;
          musicBtn.classList.add("pulse");
        }
      };
      // Зарим хөтөч play()-аас promise буцаахгүй
      if (p && typeof p.then === "function") {
        p.then(onPlay).catch(() => {
          // Тоглуулах боломжгүй бол товчийг чимээгүйхэн нуунa (алдааны цонх гаргахгүй)
          musicBtn.hidden = true;
        });
      } else {
        onPlay();
      }
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
      musicBtn.setAttribute("aria-pressed", "false");
    }
  });
  musicBtn.addEventListener("animationend", (e) => {
    if (e.animationName === "musicPulse") musicBtn.classList.remove("pulse");
  });
}

// ====== RSVP ======
const form = document.getElementById("rsvpForm");
const msg = document.getElementById("rsvpMsg");
const submitBtn = form.querySelector('button[type="submit"]');
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  // Локал хадгалалт (хүсвэл сервер рүү fetch() болгож өөрчилнө)
  const saved = JSON.parse(localStorage.getItem("rsvp") || "[]");
  saved.push({ ...data, at: new Date().toISOString() });
  localStorage.setItem("rsvp", JSON.stringify(saved));

  const text = data.attending === "yes"
    ? `Баярлалаа, ${data.name}! Таныг хүлээж байна ♥`
    : `Ойлголоо, ${data.name}. Таны ерөөлд баярлалаа.`;

  function confirmReply() {
    msg.hidden = false;
    msg.textContent = text;
    requestAnimationFrame(() => msg.classList.add("show"));
    form.reset();
  }

  if (reduce) {
    confirmReply();
    form.style.display = "none";
  } else {
    submitBtn.classList.add("sending");
    // богино "илгээж байна" төлөв → форм бүдгэрч → хариу карт орж ирнэ
    setTimeout(() => {
      form.classList.add("sent");
      const after = () => {
        form.style.display = "none";
        form.removeEventListener("transitionend", after);
        confirmReply();
      };
      form.addEventListener("transitionend", after);
    }, 650);
  }
});

// ====== Footer monogram (ажиглагч хэдийн .visible нэмнэ) ======
// .monogram нь .reveal-ийн оронд тусдаа observer ашиглана, учир нь дотроо SVG ring зурна.
const monogram = document.querySelector(".monogram");
if (monogram) {
  const mObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); mObs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  mObs.observe(monogram);
}
