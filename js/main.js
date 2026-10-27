const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(button.getAttribute("aria-controls"));

    button.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
  });
});

const billingOptions = document.querySelectorAll(".billing-option");
const prices = document.querySelectorAll(".price strong[data-monthly]");

billingOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const billingPeriod = button.dataset.billing;

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

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    const planSelect = document.getElementById("plan");
    planSelect.value = link.dataset.plan;
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("primary-navigation");

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  navigation.classList.toggle("is-open", !expanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  });
});

document.getElementById("signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("form-note").textContent =
    "Thanks for sharing your project details. This demo doesn’t send submissions yet—please email hello@suadeprint.com to get in touch.";
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());
