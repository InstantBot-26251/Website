// Put the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Phone menu: open/close when the ☰ button is clicked
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

// Close the phone menu after clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Fade sections in as you scroll down to them
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// Count-up animation for the stats numbers
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const goal = parseInt(el.dataset.goal, 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(goal / 40));
        const timer = setInterval(() => {
            current = Math.min(current + step, goal);
            el.textContent = current;
            if (current >= goal) clearInterval(timer);
        }, 30);
        statsObserver.unobserve(el);
    });
});

// Set your real numbers here
const statNumbers = { Members: 12, Competitions: 3, Awards: 1 };

document.querySelectorAll(".stat").forEach((stat) => {
    const label = stat.querySelector(".label").textContent;
    const number = stat.querySelector(".number");
    number.dataset.goal = statNumbers[label] ?? 0;
    statsObserver.observe(number);
});