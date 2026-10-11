(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const WA = "201212858582", MAIL = "monshenouda01@gmail.com";

  /* Theme (initial value is set by the inline script in <head> to avoid a flash) */
  const themeColor = (t) => ($('meta[name="theme-color"]').content = t === "light" ? "#f6f4ee" : "#0d0e12");
  themeColor(root.dataset.theme);
  $$(".theme-btn").forEach((b) => b.addEventListener("click", () => {
    const t = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
    themeColor(t);
  }));

  /* Language (EN / Arabic) - English is the source text in the HTML, Arabic lives in i18n.js */
  const AR = (window.I18N && window.I18N.ar) || {}, META = (window.I18N && window.I18N.meta) || {};
  const store = new WeakMap();
  const metaTag = (sel) => $(sel);
  const base = { title: d.title, desc: metaTag('meta[name="description"]').content, ogdesc: metaTag('meta[property="og:description"]').content };
  let lang = root.lang === "ar" ? "ar" : "en";
    const applyLang = (l) => {
    lang = l;
    if (l === "ar" && window.__arFonts) window.__arFonts();
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((el) => {
      if (!store.has(el)) store.set(el, el.innerHTML);
      el.innerHTML = l === "ar" && AR[el.dataset.i18n] ? AR[el.dataset.i18n] : store.get(el);
    });
    $$("[data-i18n-attr]").forEach((el) => el.dataset.i18nAttr.split(";").forEach((p) => {
      const [a, k] = p.split(":"), sk = "data-en-" + a;
      if (!el.hasAttribute(sk)) el.setAttribute(sk, el.getAttribute(a));
      el.setAttribute(a, l === "ar" && AR[k] ? AR[k] : el.getAttribute(sk));
    }));
    d.title = l === "ar" ? META.title : base.title;
    metaTag('meta[name="description"]').content = l === "ar" ? META.description : base.desc;
    metaTag('meta[property="og:description"]').content = l === "ar" ? META.ogdesc : base.ogdesc;
    $$(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === l));
    $(".lang-switch").setAttribute("aria-label", l === "ar" ? "اللغة" : "Language");
  };
  if (lang === "ar") applyLang("ar");
  $$(".lang-switch button").forEach((b) => b.addEventListener("click", () => {
    const n = b.dataset.lang;
    if (n === lang) return;
    applyLang(n);
    try { localStorage.setItem("lang", n); } catch (e) {}
  }));

  /* Mobile drawer */
  const btn = $(".menu-btn"), drawer = $("#drawer"), scrim = $(".scrim");
  const setMenu = (open) => {
    btn.setAttribute("aria-expanded", open);
    drawer.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
    d.body.classList.toggle("no-scroll", open);
    drawer.toggleAttribute("inert", !open);
    if (open) $("a", drawer).focus(); 
  };
  drawer.setAttribute("inert", "");
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  scrim.addEventListener("click", () => setMenu(false));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  d.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) { setMenu(false); btn.focus(); } });
  matchMedia("(min-width: 1001px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* Tech marquee: duplicate the track once for a seamless loop (copy is hidden from assistive tech) */
  const track = $(".track");
  if (track) {
    const copy = track.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    $$("[data-i18n]", copy).forEach((el) => el.removeAttribute("data-i18n"));
    track.after(copy);
  }

  /* Active nav link (scroll-spy) */
  const links = $$(".desk-nav a, .drawer a");
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => {
      const on = a.getAttribute("href") === "#" + en.target.id;
      a.classList.toggle("active", on);
      on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
    });
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main > section[id]").forEach((s) => spy.observe(s));

  /* Header shadow, progress bar, back-to-top */
  const header = $(".site-header"), top = $(".to-top"), bar = $("#progress");
  const onScroll = () => {
    header.classList.toggle("scrolled", scrollY > 10);
    const max = root.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    top.classList.toggle("show", scrollY > 700);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  top.addEventListener("click", () => scrollTo({ top: 0 }));

  /* Reveal on scroll (staggered inside grids), then drop the helper classes */
  $$("[data-stagger]").forEach((g) => $$(".reveal", g).forEach((el, i) => el.style.setProperty("--d", Math.min(i, 8) * 0.08 + "s")));
  const rev = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    rev.unobserve(el);
    el.classList.add("in");
    setTimeout(() => { el.classList.remove("reveal", "in"); el.style.removeProperty("--d"); }, 1500);
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el) => rev.observe(el));

  /* Project brief -> WhatsApp / email */
  const form = $("#brief");
  const compose = () => {
    const f = new FormData(form);
    const name = (f.get("name") || "").toString().trim();
    const svc = f.getAll("svc");
    const details = (f.get("details") || "").toString().trim();
    const ar = lang === "ar";
    const svcText = $$('input[name="svc"]:checked', form).map((i) => i.parentElement.textContent.trim());
    const lines = ar
      ? [name ? `أهلاً يا مينا، أنا ${name}.` : "أهلاً يا مينا،", "شفت البورتفوليو بتاعك وعايز أتكلم معاك في مشروع."]
      : [name ? `Hi Mina, I'm ${name}.` : "Hi Mina,", "I found your portfolio and I'd like to discuss a project."];
    if (svc.length) lines.push("", (ar ? "محتاج: " : "I need: ") + (ar ? svcText.join("، ") : svc.join(", ")));
    if (details) lines.push("", ar ? "عن المشروع:" : "About the project:", details);
    return lines.join("\n");
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    open(`https://wa.me/${WA}?text=${encodeURIComponent(compose())}`, "_blank", "noopener");
  });
  $("#send-mail").addEventListener("click", () => {
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(lang === "ar" ? "استفسار عن مشروع" : "Project inquiry")}&body=${encodeURIComponent(compose())}`;
  });

  /* "Want something like this?" pre-fills the brief */
  $$(".ask").forEach((a) => a.addEventListener("click", () => {
    const t = form.elements.details;
    if (!t.value.trim()) t.value = lang === "ar" ? `عايز مشروع شبه مشروع ${a.closest(".p-info").querySelector("h3").textContent}.` : `I'd like something similar to your ${a.dataset.project} project.`;
  }));
})();
