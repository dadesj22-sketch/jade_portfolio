/* ==========================================================
   script.js - interactivity for Jade Dades' portfolio
   ========================================================== */

/* ---------- 1. Typing animation ----------
   Edit the titles below to change what gets typed. */
const titles = [
  "Aspiring IT Professional",
  "Future Web Developer",
  "Passionate About Technology"
];
const typedEl = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let titleIndex = 0, charIndex = 0, deleting = false;

function type() {
  const current = titles[titleIndex];
  charIndex += deleting ? -1 : 1;
  typedEl.textContent = current.slice(0, charIndex);

  let delay = deleting ? 40 : 85;
  if (!deleting && charIndex === current.length) { deleting = true; delay = 1600; }      // pause when finished typing
  else if (deleting && charIndex === 0) { deleting = false; titleIndex = (titleIndex + 1) % titles.length; delay = 400; }
  setTimeout(type, delay);
}
if (reduceMotion) typedEl.textContent = titles[0];   // no animation for users who prefer less motion
else type();

/* ---------- 2. Mobile navigation ---------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));  // close after tapping a link
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });          // keyboard: Esc closes

/* ---------- 3. Scroll effects ---------- */
// 3a. Fade sections in as they enter the screen
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("show"); obs.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// 3b. Highlight the nav link of the section you are viewing
const navAnchors = document.querySelectorAll(".links a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

/* ---------- 4. Profile picture placeholder ----------
   If profile.jpg is missing, show a simple silhouette instead. */
const pic = document.getElementById("profilePic");
const placeholder = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#121c3f"/>' +
  '<circle cx="100" cy="78" r="36" fill="#8b5cf6"/><path d="M30 190c4-42 38-62 70-62s66 20 70 62z" fill="#8b5cf6"/></svg>'
);
pic.addEventListener("error", () => { pic.src = placeholder; }, { once: true });

const resumePic = document.getElementById("resumePic");
resumePic.addEventListener("error", () => { resumePic.src = placeholder; }, { once: true });

/* ---------- 5. Resume download (print dialog > Save as PDF) ---------- */
document.getElementById("printBtn").addEventListener("click", () => window.print());

/* ---------- 6. Contact form ----------
   A website alone cannot send email. A real form needs a backend or a form
   service such as Formspree or Web3Forms (you would replace this code with
   a fetch() call to that service). Until then, this opens the visitor's
   email app with the message already filled in. */
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    formMsg.textContent = "Please enter your name, a valid email, and a message.";
    formMsg.classList.add("error");
    return;
  }
  formMsg.classList.remove("error");
  formMsg.textContent = "Opening your email app...";
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
  window.location.href = "mailto:dadesj22@gmail.com?subject=" + subject + "&body=" + body;
});

/* ---------- 7. Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();