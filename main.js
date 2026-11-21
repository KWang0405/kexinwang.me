const header = document.querySelector(".site-header");
if (header && "ResizeObserver" in window) {
  const headerObserver = new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
  });
  headerObserver.observe(header);
}

const olderNews = document.getElementById("older-news");
const newsToggle = document.getElementById("news-toggle");

if (olderNews && newsToggle) {
  function setExpanded(expanded) {
    olderNews.hidden = !expanded;
    newsToggle.setAttribute("aria-expanded", String(expanded));
    newsToggle.textContent = expanded ? "Show fewer news items" : "Show all news";
  }

  setExpanded(false);
  newsToggle.hidden = false;
  newsToggle.addEventListener("click", () => setExpanded(olderNews.hidden));
}

const affiliations = document.querySelectorAll(".affiliation");
function selectAffiliation(selected) {
  for (const button of affiliations) {
    button.setAttribute("aria-pressed", String(button === selected));
  }
}

for (const button of affiliations) {
  button.addEventListener("click", () => {
    selectAffiliation(button.getAttribute("aria-pressed") === "true" ? null : button);
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".affiliation")) selectAffiliation(null);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") selectAffiliation(null);
});

// Keep bookmarks from the previous single-page site working.
if (olderNews && ["#teaching", "#service"].includes(location.hash)) {
  location.replace("timeline.html" + location.hash);
}

const sectionLinks = document.querySelectorAll('nav a[href^="#"]');
if (sectionLinks.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(() => {
    let currentSection = null;
    for (const link of sectionLinks) {
      const section = document.querySelector(link.hash);
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        currentSection = link;
      }
    }
    for (const link of sectionLinks) {
      if (link === currentSection) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }, { rootMargin: "-39% 0px -60% 0px" });

  for (const link of sectionLinks) observer.observe(document.querySelector(link.hash));
}

const nameAudio = document.getElementById("name-audio");
if (nameAudio) {
  const playButton = document.querySelector(".say-name");
  const audioLink = document.querySelector(".audio-fallback");
  playButton.hidden = false;
  audioLink.hidden = true;

  playButton.addEventListener("click", async () => {
    nameAudio.currentTime = 0;
    try {
      await nameAudio.play();
    } catch {
      audioLink.hidden = false;
    }
  });

  nameAudio.addEventListener("playing", () => playButton.classList.add("is-playing"));
  nameAudio.addEventListener("pause", () => playButton.classList.remove("is-playing"));
}
