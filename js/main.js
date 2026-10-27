/**
 * Toggles the mobile navigation and supports link and Escape-key dismissal.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");

  if (!menuToggle || !navigation) return;

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("is-open", !expanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
};

/**
 * Adds animated, single-open accordion behavior to the FAQ.
 */
const initAccordion = () => {
  const faqButtons = document.querySelectorAll(".faq-question");

  const closePanel = (button, panel) => {
    button.setAttribute("aria-expanded", "false");
    panel.style.height = `${panel.scrollHeight}px`;
    panel.hidden = false;
    panel.classList.remove("is-open");

    requestAnimationFrame(() => {
      panel.style.height = "0px";
    });
  };

  const openPanel = (button, panel) => {
    button.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    panel.classList.add("is-open");
    panel.style.height = "0px";

    requestAnimationFrame(() => {
      panel.style.height = `${panel.scrollHeight}px`;
    });
  };

  faqButtons.forEach((button) => {
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) return;

    const expanded = button.getAttribute("aria-expanded") === "true";
    panel.hidden = !expanded;

    if (expanded) {
      panel.classList.add("is-open");
      panel.style.height = "auto";
    }

    panel.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "height") return;
      if (button.getAttribute("aria-expanded") === "true") {
        panel.style.height = "auto";
      } else {
        panel.hidden = true;
      }
    });

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => {
        const otherPanelId = otherButton.getAttribute("aria-controls");
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;

        if (otherButton !== button && otherPanel && otherButton.getAttribute("aria-expanded") === "true") {
          closePanel(otherButton, otherPanel);
        }
      });

      if (isExpanded) {
        closePanel(button, panel);
      } else {
        openPanel(button, panel);
      }
    });
  });
};

/**
 * Switches displayed prices and the selected billing period.
 */
const initPricingToggle = () => {
  const billingOptions = document.querySelectorAll(".billing-option");
  const prices = document.querySelectorAll(".price strong[data-monthly][data-yearly]");

  billingOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const billingPeriod = button.dataset.billing;

      if (billingPeriod !== "monthly" && billingPeriod !== "yearly") return;

      billingOptions.forEach((option) => {
        const active = option === button;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-pressed", String(active));
      });

      prices.forEach((price) => {
        price.textContent = price.dataset[billingPeriod];
      });
    });
  });
};

/**
 * Adds a shadow to the sticky header after the page scrolls.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const updateHeaderShadow = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Keeps project-plan buttons and the enquiry form working.
 */
const initSignupForm = () => {
  document.querySelectorAll("[data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      const planSelect = document.getElementById("plan");
      if (planSelect) planSelect.value = link.dataset.plan;
    });
  });

  const signupForm = document.getElementById("signup-form");
  const formNote = document.getElementById("form-note");

  if (!signupForm || !formNote) return;

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent =
      "Thanks for sharing your project details. This demo doesn’t send submissions yet—please email hello@suadeprint.com to get in touch.";
  });
};

/**
 * Sets the displayed copyright year to the current year.
 */
const setFooterYear = () => {
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());
};

/**
 * Initializes the page behavior after the document is ready.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initSignupForm();
  setFooterYear();
};

document.addEventListener("DOMContentLoaded", init, { once: true });
