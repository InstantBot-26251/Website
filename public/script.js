// =====================================================
//  MENU: edit this list to change the dropdown menus.
//  Each item is [ "Text shown", "/link/" ]
// =====================================================
const NAV = [
  {
    label: "Our Team",
    items: [
      ["About Us", "/team/"],
      ["Members", "/team/#members"],
    ],
  },
  {
    label: "Seasons",
    items: [
      ["All Seasons", "/seasons/"],
      ["2025–2026", "/seasons/2025-2026/"],
      ["2024–2025", "/seasons/2024-2025/"],
    ],
  },
  {
    label: "Sponsors",
    items: [
      ["Our Sponsors", "/sponsors/"],
      ["Become a Sponsor", "/sponsors/#become-a-sponsor"],
    ],
  },
  {
    label: "Our Robot",
    items: [
      ["Current Robot", "/robot/"],
      ["Gallery", "/robot/#gallery"],
    ],
  },
  {
    label: "Contact",
    items: [
      ["Contact Us", "/contact/"],
      ["Join the Team", "/contact/#join"],
    ],
  },
];

// ===== Build the header (same on every page) =====
function buildHeader() {
  const here = location.pathname;

  const menus = NAV.map((menu, i) => {
    // Highlight the menu for the page you're on
    const active = menu.items.some(([, link]) => {
      const path = link.split("#")[0];
      return path !== "/" && here.startsWith(path);
    });

    const links = menu.items
      .map(([text, link]) => `<a href="${link}">${text}</a>`)
      .join("");

    return `
      <div class="nav-item${active ? " active" : ""}">
        <button class="nav-button" aria-expanded="false" aria-controls="menu-${i}">
          ${menu.label} <span class="arrow">▾</span>
        </button>
        <div class="dropdown" id="menu-${i}">${links}</div>
      </div>`;
  }).join("");

  return `
    <header class="navbar">
      <a href="/" class="logo">
        <img src="/images/logo.svg" alt="" width="36" height="36">
        FTC 26251
      </a>
      <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">☰</button>
      <nav id="navLinks">${menus}</nav>
    </header>`;
}

function buildFooter() {
  return `
    <footer>
      <p>&copy; ${new Date().getFullYear()} FTC Team 26251 &middot; FIRST Tech Challenge</p>
    </footer>`;
}

document.getElementById("site-header").outerHTML = buildHeader();
document.getElementById("site-footer").outerHTML = buildFooter();

// ===== Menu behavior =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-item");

function closeAllDropdowns(except) {
  navItems.forEach((item) => {
    if (item !== except) {
      item.classList.remove("open");
      item.querySelector(".nav-button").setAttribute("aria-expanded", "false");
    }
  });
}

// Phone: ☰ button opens/closes the whole menu
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

// Clicking a menu name opens/closes its dropdown
navItems.forEach((item) => {
  const button = item.querySelector(".nav-button");
  button.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    button.setAttribute("aria-expanded", open);
    closeAllDropdowns(item);
  });
});

// Clicking anywhere else closes dropdowns
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-item")) closeAllDropdowns();
});

// Escape key closes everything
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllDropdowns();
    navLinks.classList.remove("open");
  }
});

// Close the phone menu after picking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    closeAllDropdowns();
  });
});

// ===== Fade sections in as you scroll =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach((el) => fadeObserver.observe(el));

// ===== Count-up numbers (home page stats) =====
// The number each one counts to is set by data-goal="..." in the HTML
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const goal = parseInt(el.dataset.goal, 10) || 0;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= goal) clearInterval(timer);
    }, 120);
    countObserver.unobserve(el);
  });
});

document.querySelectorAll("[data-goal]").forEach((el) => countObserver.observe(el));
