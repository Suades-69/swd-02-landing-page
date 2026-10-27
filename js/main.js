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

  const fields = {
    name: {
      input: signupForm.elements.namedItem("name"),
      error: document.getElementById("name-error"),
    },
    email: {
      input: signupForm.elements.namedItem("email"),
      error: document.getElementById("email-error"),
    },
    plan: {
      input: signupForm.elements.namedItem("plan"),
      error: document.getElementById("plan-error"),
    },
    terms: {
      input: signupForm.elements.namedItem("terms"),
      error: document.getElementById("terms-error"),
    },
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validationMessages = {
    name: "Please enter your name using at least 2 characters.",
    email: "Please enter a valid email address.",
    plan: "Please choose a plan to continue.",
    terms: "Please agree to be contacted about your enquiry.",
  };

  const getFieldError = (fieldName) => {
    const value = fields[fieldName].input.value;

    if (fieldName === "name" && value.trim().length < 2) {
      return validationMessages.name;
    }

    if (fieldName === "email" && !emailPattern.test(value.trim())) {
      return validationMessages.email;
    }

    if (fieldName === "plan" && !value) {
      return validationMessages.plan;
    }

    if (fieldName === "terms" && !fields.terms.input.checked) {
      return validationMessages.terms;
    }

    return "";
  };

  const showFieldError = (fieldName, message) => {
    const { input, error } = fields[fieldName];
    if (!input || !error) return;

    error.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
  };

  const validateField = (fieldName) => {
    const message = getFieldError(fieldName);
    showFieldError(fieldName, message);
    return !message;
  };

  const clearFieldErrors = () => {
    Object.keys(fields).forEach((fieldName) => showFieldError(fieldName, ""));
  };

  Object.keys(fields).forEach((fieldName) => {
    const { input } = fields[fieldName];
    const eventName = fieldName === "plan" || fieldName === "terms" ? "change" : "input";

    input.addEventListener(eventName, () => {
      validateField(fieldName);
      formNote.textContent = "";
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = Object.keys(fields).reduce(
      (valid, fieldName) => validateField(fieldName) && valid,
      true,
    );

    if (!isValid) {
      formNote.textContent = "Please correct the highlighted fields and try again.";
      return;
    }

    const name = fields.name.input.value.trim();
    const email = fields.email.input.value.trim();
    const plan = fields.plan.input.value;
    let signups;

    try {
      const storedSignups = localStorage.getItem("signups");
      signups = storedSignups ? JSON.parse(storedSignups) : [];
    } catch {
      formNote.textContent = "We couldn’t read saved signups in this browser. Please try again.";
      return;
    }

    if (!Array.isArray(signups)) {
      formNote.textContent = "Saved signup data is unavailable. Please clear the signups entry and try again.";
      return;
    }

    const normalizedEmail = email.toLowerCase();
    const alreadySignedUp = signups.some(
      (signup) =>
        signup &&
        typeof signup.email === "string" &&
        signup.email.trim().toLowerCase() === normalizedEmail,
    );

    if (alreadySignedUp) {
      showFieldError("email", "You've already signed up.");
      formNote.textContent = "You've already signed up with this email address.";
      return;
    }

    signups.push({ name, email, plan, createdAt: new Date().toISOString() });

    try {
      localStorage.setItem("signups", JSON.stringify(signups));
    } catch {
      formNote.textContent = "We couldn’t save your signup in this browser. Please try again.";
      return;
    }

    signupForm.reset();
    clearFieldErrors();
    formNote.textContent = "Thanks for signing up! Your details have been saved in this browser.";
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
