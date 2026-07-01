/* ===== Theme System (CSS + Logic) ===== */
(function () {
  const style = document.createElement("style");
  style.textContent = `
  :root {
    --panel: #111122 ;
    --muted: #ffffffff;
    --text: #fff;
    --accent: #0ff;
    --header-bg: rgba(10, 10, 15, 0.9);
    --footer-bg: #000000ff;
  }

  /* Dark Theme */
  [data-theme="dark"] {
    --bg-start: #0a0a0f;
    --bg-end: #141426;
    --panel: #111122;
    --text: #fff;
    --header-bg: rgba(10, 10, 15, 0.9);
    --footer-bg: #000000ff;
  }

  /* Light Theme */
  [data-theme="light"] {
    --bg-start: #ffffffff;
    --bg-end: #ffffffff;
    --muted: #000000ca;
    --panel: rgba(255, 255, 255, 1);
    --accent: #0ff;
    --text: #111122;
    --header-bg: #ffffff;
    --footer-bg: #ffffff;
  }

  body {
    font-family: "Poppins", sans-serif;
    background: linear-gradient(145deg, var(--bg-start), var(--bg-end));
    color: var(--text);
    transition: background 0.5s ease, color 0.5s ease;
    margin: 0;
    padding: 0;
  }

  header {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    padding: 20px 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--header-bg);
    backdrop-filter: blur(10px);
    z-index: 1000;
    transition: background 0.5s ease;
  }

  footer {
    background: var(--footer-bg);
    color: var(--text);
    text-align: center;
    padding: 20px;
    border-top: 1px solid var(--muted);
    transition: background 0.5s ease, color 0.5s ease;
  }

  .logo {
    font-size: 28px;
    font-weight: bold;
    color: var(--accent);
  }

  nav {
    gap: 20px;
  }

  nav a {
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
  }

  /* زر تغيير الثيم */
  .theme-toggle {
    font-size: 22px;
    cursor: pointer;
    background: none;
    border: none;
    transition: transform 0.5s ease;
  }

  .theme-toggle:active {
    transform: rotate(360deg);
  }

  .theme-toggle:hover {
    color: var(--accent);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: scale(1.2) rotate(15deg);
    box-shadow: 0 0 15px var(--accent);
    transition: all 0.4s ease;
  }

  /* رموز الثيم */
  [data-theme="dark"] .theme-toggle::before {
    content: "☾";
    color: var(--accent);
  }

  [data-theme="light"] .theme-toggle::before {
    content: "☀";
    color: gold;
  }
  `;
  document.head.appendChild(style);
})();

/* ===== وظائف تغيير الثيم ===== */
function applyTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.dataset.theme = savedTheme;
}

function toggleTheme() {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.body.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
}

/* ===== تطبيق عند تحميل الصفحة ===== */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();

  // نجيب كل الأزرار اللي class="theme-toggle"
  const themeButtons = document.querySelectorAll(".theme-toggle");

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });
});






  const links = document.querySelectorAll("nav a");
  const currentPage = decodeURIComponent(window.location.pathname.split("/").pop().toLowerCase());

  links.forEach(link => {
    const href = decodeURIComponent(link.getAttribute("href").toLowerCase());
    if (href === currentPage) {
      link.classList.add("active");
    }
  });





// زرهر مهم
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  mobileLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 768px)").matches) {
        e.preventDefault(); // منع الفتح الفورى

        // نضيف كلاس عشان يعمل تأثير "هوفر مطوّل"
        link.classList.add("touched");

        // بعد 700ms يفتح اللينك
        setTimeout(() => {
          window.location.href = link.href;
        }, 1000);
      }
    });
  });











const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".mobile-nav");
const navLinks = document.querySelectorAll("nav.mobile-nav a");
const overlay = document.querySelector(".overlay");

// فتح/قفل القائمة
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

// يقفل القائمة لما تدوس على أي لينك (بعد ثانية)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setTimeout(() => {
      closeMenu();
    }, 1000); // ثانية واحدة
  });
});

// يقفل القائمة لما تدوس على أي مكان في الشاشة
document.addEventListener("click", closeMenu);

// منع إغلاق عند الضغط على القائمة نفسها
nav.addEventListener("click", (e) => e.stopPropagation());

// دالة لتبديل الحالة
function toggleMenu() {
  menuToggle.classList.toggle("active");
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
}

// دالة لإغلاق القائمة
function closeMenu() {
  menuToggle.classList.remove("active");
  nav.classList.remove("active");
  overlay.classList.remove("active");
}



