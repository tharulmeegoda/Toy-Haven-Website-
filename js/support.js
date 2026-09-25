

// ============================================================
// FEEDBACK FORM
// ============================================================
function showSupportError(inputId, message) {
  const errorEl = document.getElementById(inputId + "-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }
}

function clearSupportError(inputId) {
  const errorEl = document.getElementById(inputId + "-error");
  if (errorEl) errorEl.classList.remove("visible");
}

function validateFeedbackForm() {
  let isValid = true;

  const name = document.getElementById("feedback-name").value.trim();
  const email = document.getElementById("feedback-email").value.trim();
  const message = document.getElementById("feedback-message").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name === "") {
    showSupportError("feedback-name", "Please enter your name.");
    isValid = false;
  } else {
    clearSupportError("feedback-name");
  }

  if (email === "") {
    showSupportError("feedback-email", "Please enter your email.");
    isValid = false;
  } else if (!emailPattern.test(email)) {
    showSupportError("feedback-email", "Enter a valid email address.");
    isValid = false;
  } else {
    clearSupportError("feedback-email");
  }

  if (message === "") {
    showSupportError("feedback-message", "Please enter a message.");
    isValid = false;
  } else {
    clearSupportError("feedback-message");
  }

  return isValid;
}

// Saves every submitted feedback message to localStorage, same
// pattern as order history in checkout.js — an array that grows
// with each new entry, keyed by its own storage name.
function saveFeedback(name, email, message) {
  const feedbackList = JSON.parse(localStorage.getItem("toyhaven_feedback")) || [];

  feedbackList.push({
    date: new Date().toISOString(),
    name: name,
    email: email,
    message: message,
  });

  localStorage.setItem("toyhaven_feedback", JSON.stringify(feedbackList));
}

function initFeedbackForm() {
  const form = document.getElementById("feedback-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateFeedbackForm()) return;

    const name = document.getElementById("feedback-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const message = document.getElementById("feedback-message").value.trim();

    saveFeedback(name, email, message);

    // Show confirmation, then clear the form for a fresh entry
    const confirmationEl = document.getElementById("feedback-confirmation");
    confirmationEl.classList.add("visible");
    form.reset();
  });
}

// ============================================================
// FAQ ACCORDION
// ------------------------------------------------------------
// Each question toggles its own answer open/closed. Uses
// max-height (set in CSS) so the open/close has a smooth
// transition instead of an instant jump.
// ============================================================
function initFaqAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  if (questions.length === 0) return;

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains("open");

      if (isOpen) {
        question.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        question.classList.add("open");
        // scrollHeight gives the exact height needed to show all the
        // text inside, so the transition animates to the right size
        // instead of a guessed fixed number.
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFeedbackForm();
  initFaqAccordion();
});
