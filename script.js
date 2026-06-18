// ====== ТОХИРГОО — энд засна ======
const WEDDING_DATE = new Date("2026-09-12T15:00:00"); // Хуримын огноо ба цаг

// ====== COUNTDOWN ======
const els = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};
function pad(n) { return String(n).padStart(2, "0"); }
function tick() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = "00";
    return;
  }
  const s = Math.floor(diff / 1000);
  els.days.textContent = pad(Math.floor(s / 86400));
  els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
  els.mins.textContent = pad(Math.floor((s % 3600) / 60));
  els.secs.textContent = pad(s % 60);
}
tick();
setInterval(tick, 1000);

// ====== REVEAL on scroll ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
// Hero нь шууд харагдана
document.querySelector(".hero .reveal")?.classList.add("visible");

// ====== ХӨГЖИМ ======
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");
musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play().then(() => musicBtn.classList.add("playing"))
      .catch(() => alert("Хөгжмийн файл олдсонгүй. assets/music.mp3 нэмнэ үү."));
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
  }
});

// ====== RSVP ======
const form = document.getElementById("rsvpForm");
const msg = document.getElementById("rsvpMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  // Локал хадгалалт (хүсвэл сервер рүү fetch() болгож өөрчилнө)
  const saved = JSON.parse(localStorage.getItem("rsvp") || "[]");
  saved.push({ ...data, at: new Date().toISOString() });
  localStorage.setItem("rsvp", JSON.stringify(saved));

  msg.hidden = false;
  msg.textContent = data.attending === "yes"
    ? `Баярлалаа, ${data.name}! Таныг хүлээж байна ♥`
    : `Ойлголоо, ${data.name}. Таны ерөөлд баярлалаа.`;
  form.reset();
});
