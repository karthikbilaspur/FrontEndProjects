// --- CENTRALIZED CONFIGURATION ---
const AppConstants = {
  HEADER_HEIGHT_OFFSET: 120, // Approximate height of the fixed header
  SCROLL_THRESHOLD_BACK_TO_TOP: 300, // Pixels scrolled before back-to-top button appears
  SCROLL_THROTTLE_DELAY: 100, // Milliseconds for scroll event throttling
  DEFAULT_LANGUAGE: 'en',
  LANGUAGE_KEY: 'appLanguage',
  DARK_MODE_KEY: 'darkMode'
};

// --- UTILITY FUNCTIONS ---
/**
 * Throttles a function call to execute at most once within a given time frame.
 * Useful for performance-intensive events like scroll.
 */
function throttle(func, delay) {
  let inThrottle;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
}

/**
 * Loads language data from languages.json.
 * @returns {Promise<Object>} A promise that resolves with the language data.
 */
async function loadLanguageData() {
  try {
    const response = await fetch('languages.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not load language data:", error);
    return {}; // Return empty object on error
  }
}

let allLanguageData = {}; // Stores the loaded language data

/**
 * Updates all text content on the page based on the current language.
 * @param {string} lang The language code (e.g., 'en', 'hi').
 */
function updateContent(lang) {
  const langData = allLanguageData[lang];
  if (!langData) {
    console.warn(`Language data for "${lang}" not found. Falling back to default.`);
    lang = AppConstants.DEFAULT_LANGUAGE;
    // Attempt to update with default language if available
    if (!allLanguageData[lang]) return; // If default also not available, do nothing
    // Else, continue with default
  }

  // Update elements with data-key attributes
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (langData[key]) {
      // Use innerHTML for keys that might contain HTML (like strong tags)
      element.innerHTML = langData[key];
    }
  });

  // Update elements with data-key-list attributes (for lists)
  document.querySelectorAll('[data-key-list]').forEach(listContainer => {
    const key = listContainer.getAttribute('data-key-list');
    const listItems = langData[key];

    if (listItems && Array.isArray(listItems)) {
      const ul = listContainer.querySelector('ul');
      if (ul) {
        ul.innerHTML = ''; // Clear existing list items
        listItems.forEach(itemText => {
          const li = document.createElement('li');
          // Use innerHTML for list items too, as they might contain strong tags
          li.innerHTML = itemText;
          ul.appendChild(li);
        });
      }
    }
  });

  // Update page title
  const pageTitleElement = document.querySelector('title');
  if (pageTitleElement && langData.pageTitle) {
    pageTitleElement.textContent = langData.pageTitle;
  }

  // Update meta description and og:title (if needed, though generally not dynamic)
  // For meta description, it's best handled server-side or by content management systems.
  // For client-side, we can update, but it won't affect initial crawl.
  document.querySelector('meta[name="description"]')?.setAttribute('content', langData.metaDescription || '');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', langData.ogDescription || '');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', langData.pageTitle || '');

  // Update current language in Open Graph meta tags
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang);
}

// --- DOM READY CHECK ---
document.addEventListener('DOMContentLoaded', async () => {

  // Load language data first
  allLanguageData = await loadLanguageData();
  const languageSelector = document.getElementById('language-selector');

  // --- LANGUAGE SWITCHER ---
  (function() {
    const savedLang = localStorage.getItem(AppConstants.LANGUAGE_KEY) || AppConstants.DEFAULT_LANGUAGE;

    // Set selector to saved language
    if (languageSelector) {
      languageSelector.value = savedLang;
      // Also set the document lang attribute for better accessibility
      document.documentElement.lang = savedLang;
    }

    // Apply initial content translation
    updateContent(savedLang);

    languageSelector?.addEventListener('change', (event) => {
      const newLang = event.target.value;
      localStorage.setItem(AppConstants.LANGUAGE_KEY, newLang);
      document.documentElement.lang = newLang; // Update document lang attribute
      updateContent(newLang);
    });
  })();

  // --- DARK MODE — WITH SAVE + SYSTEM PREFERENCE ---
  (function() {
    const toggleBtn = document.getElementById("darkToggle");
    const darkClass = "dark";

    function setDarkMode(enabled) {
      document.body.classList.toggle(darkClass, enabled);
      localStorage.setItem(AppConstants.DARK_MODE_KEY, enabled? "enabled" : "disabled");
    }

    // Load saved mode OR system preference
    const savedMode = localStorage.getItem(AppConstants.DARK_MODE_KEY);
    if (savedMode === "enabled" ||
      (!savedMode && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
    }

    toggleBtn?.addEventListener("click", () => {
      setDarkMode(!document.body.classList.contains(darkClass));
    });
  })();

  // --- SMOOTH SCROLL FOR NAVIGATION (Using Event Delegation) ---
  (function() {
    const navElement = document.querySelector("nav");

    navElement?.addEventListener("click", e => {
      const link = e.target.closest("a"); // Check if a link was clicked
      if (link && link.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
          // Adjust scroll position by header height for sticky header
          const scrollPosition = target.offsetTop - AppConstants.HEADER_HEIGHT_OFFSET;
          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth"
          });
        }
      }
    });
  })();

  // --- ACTIVE NAV LINK ON SCROLL ---
  (function() {
    const sections = document.querySelectorAll("main section"); // Target only main content sections
    const navLinks = document.querySelectorAll("header nav a");

    const navLinkMap = new Map();
    navLinks.forEach(link => navLinkMap.set(link.getAttribute("href"), link));

    let currentActiveSectionId = "";

    const setActiveNavLink = () => {
      let current = "";

      sections.forEach(section => {
        // Adjust the trigger point considering the fixed header
        const top = section.offsetTop - AppConstants.HEADER_HEIGHT_OFFSET - 20; // -20 for a little buffer
        const bottom = section.offsetTop + section.offsetHeight - AppConstants.HEADER_HEIGHT_OFFSET - 20;

        if (window.scrollY >= top && window.scrollY < bottom) {
          current = section.id;
        }
      });

      if (current && current!== currentActiveSectionId) {
        currentActiveSectionId = current;
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = navLinkMap.get(`#${currentActiveSectionId}`);
        activeLink?.classList.add("active");
      } else if (!current && window.scrollY < AppConstants.HEADER_HEIGHT_OFFSET) {
        // If at the very top (before any section), remove all active classes
        navLinks.forEach(link => link.classList.remove("active"));
      }
    };

    setActiveNavLink(); // Initial call on load
    window.addEventListener("scroll", throttle(setActiveNavLink, AppConstants.SCROLL_THROTTLE_DELAY));
  })();

  // --- BACK TO TOP BUTTON — FADE EFFECT ---
  (function() {
    // Check if a topBtn already exists (e.g., from a previous render or if manually added in HTML)
    let topBtn = document.getElementById('topBtn');
    if (!topBtn) {
      topBtn = document.createElement('button'); // Create the button dynamically
      topBtn.id = 'topBtn';
      topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      document.body.appendChild(topBtn); // Append to body
    }

    topBtn.setAttribute('title', 'Back to Top');
    topBtn.setAttribute('aria-label', 'Back to top of page');
    topBtn.setAttribute('type', 'button');

    const visibleClass = "visible";

    const handleScroll = () => {
      if (window.scrollY > AppConstants.SCROLL_THRESHOLD_BACK_TO_TOP) {
        topBtn.classList.add(visibleClass);
      } else {
        topBtn.classList.remove(visibleClass);
      }
    };

    window.addEventListener("scroll", throttle(handleScroll, AppConstants.SCROLL_THROTTLE_DELAY));
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    handleScroll(); // Initial check
  })();

  // --- SCROLL PROGRESS BAR ---
  (function() {
    const progressBar = document.getElementById("progressBar");

    if (progressBar) {
      const updateProgressBar = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const height = scrollHeight - clientHeight;

        if (height > 0) {
          progressBar.style.width = (scrollTop / height) * 100 + "%";
        } else {
          progressBar.style.width = "0%"; // No scrollable content
        }
      };

      window.addEventListener("scroll", throttle(updateProgressBar, AppConstants.SCROLL_THROTTLE_DELAY));
      updateProgressBar(); // Initial update
    }
  })();

  // --- READ MORE / READ LESS FUNCTIONALITY ---
  (function() {
    document.addEventListener('click', e => {
      const button = e.target.closest('.read-more-btn');
      if (button) {
        const contentWrapper = button.closest('.content-wrapper');
        if (!contentWrapper) return;

        const shortText = contentWrapper.querySelector('.short-text');
        const fullText = contentWrapper.querySelector('.full-text');

        if (shortText && fullText) {
          const isExpanded = button.getAttribute('aria-expanded') === 'true';
          const currentLang = localStorage.getItem(AppConstants.LANGUAGE_KEY) || AppConstants.DEFAULT_LANGUAGE;
          const langData = allLanguageData[currentLang];

          if (isExpanded) {
            shortText.classList.remove('hidden');
            fullText.classList.add('hidden');
            button.textContent = langData.readMore; // Use translated text
            button.setAttribute('aria-expanded', 'false');
          } else {
            shortText.classList.add('hidden');
            fullText.classList.remove('hidden');
            button.textContent = langData.readLess; // Use translated text
            button.setAttribute('aria-expanded', 'true');
          }
        }
      }
    });
  })();

  // --- FOOTER YEAR UPDATE ---
  (function() {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  })();

}); // End DOMContentLoaded