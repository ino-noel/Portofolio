"use strict";

(() => {
  const data = window.portfolioData || {};
  const navigation = document.querySelector(".primary-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const mobileQuery = window.matchMedia("(max-width: 650px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Only HTTP(S) destinations are accepted for configurable external links.
  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function externalLink(label, url, className = "text-link") {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.className = className;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = label;
    const arrow = document.createElement("span");
    arrow.textContent = " ↗";
    arrow.setAttribute("aria-hidden", "true");
    const hint = document.createElement("span");
    hint.className = "sr-only";
    hint.textContent = " (opens in a new tab)";
    anchor.append(arrow, hint);
    return anchor;
  }

  const githubUrl = safeUrl(data.githubUrl);
  if (githubUrl) {
    document.querySelectorAll("[data-github]").forEach((placeholder) => {
      placeholder.replaceWith(externalLink("GitHub", githubUrl, "social-link"));
    });
  }

  if (data.showGpa && data.gpa) {
    const gpa = document.getElementById("education-gpa");
    gpa.textContent = `GPA: ${data.gpa}`;
    gpa.hidden = false;
  }

  const featuredLinks = document.getElementById("featured-project-links");
  const repositoryUrl = safeUrl(data.featuredProject?.repositoryUrl);
  const demoUrl = safeUrl(data.featuredProject?.demoUrl);
  if (repositoryUrl) {
    featuredLinks.append(externalLink("View on GitHub", repositoryUrl));
    document.getElementById("repository-note").hidden = true;
  }
  if (demoUrl) featuredLinks.append(externalLink("Live demo", demoUrl));

  const projects = Array.isArray(data.otherProjects)
    ? data.otherProjects.filter((project) => project && typeof project.title === "string" && project.title.trim() && typeof project.description === "string" && project.description.trim())
    : [];
  if (projects.length) {
    const list = document.getElementById("other-project-list");
    list.replaceChildren();
    projects.forEach((project, index) => {
      const article = document.createElement("article");
      article.className = "additional-project";
      const content = document.createElement("div");
      content.className = "additional-project-content";
      const title = document.createElement("h4");
      title.id = `additional-project-${index + 1}`;
      title.textContent = project.title;
      article.setAttribute("aria-labelledby", title.id);
      const description = document.createElement("p");
      description.textContent = project.description;
      content.append(title, description);
      [["technologies", "tags"], ["features", "project-features"]].forEach(([key, className]) => {
        if (!Array.isArray(project[key]) || !project[key].length) return;
        const items = document.createElement("ul");
        items.className = className;
        project[key].forEach((value) => {
          const item = document.createElement("li");
          item.textContent = value;
          items.append(item);
        });
        content.append(items);
      });
      const links = document.createElement("div");
      links.className = "project-links";
      [["repositoryUrl", "View on GitHub"], ["demoUrl", "Live demo"]].forEach(([key, label]) => {
        const url = safeUrl(project[key]);
        if (url) links.append(externalLink(label, url));
      });
      content.append(links);
      article.append(content);
      // Media is created only for projects with a valid local image path.
      // Text-only entries never reserve an empty image column.
      if (typeof project.image === "string" && /^assets\/images\/[\w./-]+$/.test(project.image) && !project.image.includes("..") && project.imageAlt) {
        const media = document.createElement("figure");
        media.className = "project-media";
        const image = document.createElement("img");
        image.src = project.image;
        image.alt = project.imageAlt;
        image.loading = "lazy";
        image.decoding = "async";
        if (Number.isInteger(project.imageWidth) && project.imageWidth > 0) image.width = project.imageWidth;
        if (Number.isInteger(project.imageHeight) && project.imageHeight > 0) image.height = project.imageHeight;
        media.append(image);
        article.classList.add("has-image");
        article.append(media);
      }
      list.append(article);
    });
  }

  // Mobile navigation supports Escape, focus containment, and screen changes.
  function closeMenu(restoreFocus = false) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
      return;
    }
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    navigation.classList.add("is-open");
    document.body.classList.add("menu-open");
    navLinks[0].focus();
  });
  navLinks.forEach((link) => link.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") !== "true") return;
    closeMenu();
    const section = document.querySelector(link.getAttribute("href"));
    if (section) {
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
      section.addEventListener("blur", () => section.removeAttribute("tabindex"), { once: true });
    }
  }));
  document.addEventListener("keydown", (event) => {
    if (menuToggle.getAttribute("aria-expanded") !== "true") return;
    if (event.key === "Escape") closeMenu(true);
    if (event.key === "Tab") {
      const items = [menuToggle, ...navLinks];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) closeMenu();
  });
  document.documentElement.classList.add("navigation-ready");

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
  }

  // One passive, animation-frame scheduled update handles the active section.
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const backToTop = document.querySelector(".back-to-top");
  let scrollScheduled = false;
  function updateScrollState() {
    let activeId = sections[0].id;
    const marker = window.innerHeight * 0.34;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) activeId = section.id;
    });
    // Short contact sections still become active at the end of the document.
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 3) activeId = "contact";
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const nearFooter = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
    backToTop.hidden = window.scrollY < 700 || nearFooter;
    scrollScheduled = false;
  }
  function scheduleScrollUpdate() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(updateScrollState);
  }
  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate, { passive: true });
  window.addEventListener("load", updateScrollState);
  updateScrollState();

  const copyButton = document.querySelector(".copy-email");
  const copyStatus = document.querySelector(".copy-status");
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("inocentius.noel@gmail.com");
        copyStatus.textContent = "Email address copied. Say hello whenever you're ready.";
      } catch {
        copyStatus.textContent = "Couldn't copy automatically. Select the email address to copy it, or click it to open your mail app.";
      }
    });
  }
  document.getElementById("copyright-year").textContent = new Date().getFullYear();
})();
