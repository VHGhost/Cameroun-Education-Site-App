const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const startQuiz = document.getElementById("startQuiz");
const themeToggle = document.getElementById("themeToggle");
const siteSearch = document.getElementById("siteSearch");

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

document.body.classList.add(initialTheme);

function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
  themeToggle.innerText = theme === "dark" ? "☀️" : "🌙";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
  });
  themeToggle.innerText = initialTheme === "dark" ? "☀️" : "🌙";
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
  });
}

if (startQuiz) {
  startQuiz.addEventListener("click", () => {
    alert("Quiz de révision bientôt disponible ! En attendant, consultez les fiches et sujets pour progresser rapidement.");
  });
}

const searchMessage = document.createElement("div");
searchMessage.className = "search-message";
searchMessage.textContent = "";
if (siteSearch && siteSearch.parentNode) {
  siteSearch.parentNode.appendChild(searchMessage);
}

function updateSearchResults() {
  const query = siteSearch ? siteSearch.value.trim().toLowerCase() : "";
  const searchItems = Array.from(document.querySelectorAll(".card, .feature, .orientation-item, .quiz-card, .contact-card, .hero-content"));
  let visibleCount = 0;

  searchItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const matches = query === "" || text.includes(query);
    item.style.display = matches ? "block" : "none";
    if (matches) visibleCount += 1;
  });

  const sections = Array.from(document.querySelectorAll(".section, .hero"));
  sections.forEach((section) => {
    const sectionText = section.textContent.toLowerCase();
    const sectionMatches = query === "" || sectionText.includes(query);
    const childItems = Array.from(section.querySelectorAll(".card, .feature, .orientation-item, .quiz-card, .contact-card, .hero-content"));
    const hasVisibleChild = childItems.some((child) => child.style.display !== "none");
    section.style.display = sectionMatches || hasVisibleChild ? "block" : "none";
  });

  if (query !== "" && visibleCount === 0) {
    searchMessage.textContent = "Aucun résultat trouvé pour votre recherche.";
  } else {
    searchMessage.textContent = "";
  }
}

if (siteSearch) {
  siteSearch.addEventListener("input", updateSearchResults);
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi...";
    }

    formStatus.textContent = "Envoi du message...";
    formStatus.className = "form-status show";

    const endpoint = contactForm.action || window.location.pathname;
    const formData = new FormData(contactForm);
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
    const useMailtoFallback = endpoint === "/" && isLocal;

    if (useMailtoFallback) {
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const messageText = formData.get("message") || "";
      const subjectInput = contactForm.querySelector("input[name='_subject']");
      const subject = subjectInput ? subjectInput.value : "Nouveau message CamerEdu";

      const body = `Nom: ${name}\nEmail: ${email}\n\n${messageText}`;
      const mailto = `mailto:camereduc@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      formStatus.textContent = "Vous êtes en local. Le client mail s'ouvre pour envoyer le message.";
      formStatus.className = "form-status success show";
      window.location.href = mailto;

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Envoyer";
      }

      window.setTimeout(() => {
        if (formStatus) {
          formStatus.classList.remove("show");
        }
      }, 7000);

      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formStatus.textContent = "Message envoyé avec succès ! Merci de votre prise de contact.";
        formStatus.className = "form-status success show";
        contactForm.reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Le service de formulaire a échoué.");
      }
    } catch (error) {
      console.error(error);
      formStatus.textContent = "Impossible d'envoyer le message pour le moment. Vérifiez votre configuration Netlify Forms.";
      formStatus.className = "form-status error show";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Envoyer";
      }
      window.setTimeout(() => {
        if (formStatus) {
          formStatus.classList.remove("show");
        }
      }, 7000);
    }
  });
}
