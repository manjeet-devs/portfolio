"use strict";

// PHOTO: Put your photo in assets/, then change this to "assets/manjeet.jpg".
// Leave empty to show the MK initials. No external images or libraries are used.
const PROFILE_PHOTO = "";

if (PROFILE_PHOTO) {
  const portrait = document.getElementById("portrait");
  const photo = new Image();
  photo.alt = "Manjeet Kumar Vishwakarma";
  photo.className = "profile-photo";
  photo.width = 600;
  photo.height = 700;
  photo.decoding = "async";
  photo.addEventListener("load", () => portrait?.replaceChildren(photo));
  photo.addEventListener("error", () => {
    // Keep the initials visible if the filename is incorrect.
    console.warn("Profile photo could not load. Check PROFILE_PHOTO in script.js.");
  });
  photo.src = PROFILE_PHOTO;
}

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// Move the mouse across a card to gently rotate it in 3D.
// Touch devices and reduced-motion preferences keep the cards still.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const mouseAvailable = window.matchMedia("(hover: hover) and (pointer: fine)");
const cards = document.querySelectorAll("[data-tilt]");
const cardResetters = [];

cards.forEach((card) => {
  let frame = 0;
  let bounds = null;
  let pointerX = 0;
  let pointerY = 0;
  const maxRotation = 5;

  const canAnimate = (event) =>
    !motionPreference.matches && mouseAvailable.matches && event.pointerType !== "touch";

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    bounds = null;
    card.style.removeProperty("--rotate-x");
    card.style.removeProperty("--rotate-y");
    card.classList.remove("is-tilting");
  };

  card.addEventListener("pointerenter", (event) => {
    if (!canAnimate(event)) return;
    bounds = card.getBoundingClientRect();
    card.classList.add("is-tilting");
  });

  card.addEventListener("pointermove", (event) => {
    if (!canAnimate(event)) return;
    if (!bounds) bounds = card.getBoundingClientRect();
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame) return;

    frame = requestAnimationFrame(() => {
      const x = Math.max(-1, Math.min(1, ((pointerX - bounds.left) / bounds.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((pointerY - bounds.top) / bounds.height - 0.5) * 2));
      card.style.setProperty("--rotate-x", `${(-y * maxRotation).toFixed(2)}deg`);
      card.style.setProperty("--rotate-y", `${(x * maxRotation).toFixed(2)}deg`);
      frame = 0;
    });
  });

  card.addEventListener("pointerleave", reset);
  card.addEventListener("pointercancel", reset);
  cardResetters.push(reset);
});

const resetAllCards = () => cardResetters.forEach((reset) => reset());
window.addEventListener("scroll", resetAllCards, { passive: true });
window.addEventListener("resize", resetAllCards, { passive: true });
window.addEventListener("blur", resetAllCards);
motionPreference.addEventListener("change", resetAllCards);
mouseAvailable.addEventListener("change", resetAllCards);

// Highlight the section currently being read. Navigation works without JS too.
const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const currentSection = entries.find((entry) => entry.isIntersecting);
    if (!currentSection) return;
    navigationLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${currentSection.target.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}
