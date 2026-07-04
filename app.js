// Abhilash Bandari — portfolio interactions

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupReveal();
  setupStatCounters();
  setupCopyEmail();
});

// --- Navigation: mobile toggle, scrolled state, active link ---
function setupNav() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu when a link is clicked
  navMenu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    updateActiveLink();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function updateActiveLink() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const links = document.querySelectorAll(".nav-link");
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

// --- Scroll-reveal via IntersectionObserver ---
function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 4) * 60}ms`;
    observer.observe(el);
  });
}

// --- Count-up animation for hero stats ---
function setupStatCounters() {
  const numbers = document.querySelectorAll(".stat-number");
  if (!numbers.length) return;

  const animate = (el) => {
    const target = parseInt(el.textContent, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );

  numbers.forEach((el) => observer.observe(el));
}

// --- Copy email button ---
function setupCopyEmail() {
  const btn = document.getElementById("copy-email");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("bandariabhilash0@gmail.com");
      const original = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(() => (btn.textContent = original), 2000);
    } catch {
      window.location.href = "mailto:bandariabhilash0@gmail.com";
    }
  });
}
