
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const success = document.getElementById("feedbackSuccess");

  function setError(input, message) {
    input.closest(".field").querySelector(".error").textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("feedbackName");
    const email = document.getElementById("feedbackEmail");
    const message = document.getElementById("feedbackMessage");
    const checks = [
      [name, name.value.trim().length >= 2, "Enter your name."],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "Enter a valid email."],
      [message, message.value.trim().length >= 10, "Message must be at least 10 characters."]
    ];
    let valid = true;
    checks.forEach(([input, ok, error]) => {
      setError(input, ok ? "" : error);
      if (!ok) valid = false;
    });
    if (!valid) return;

    const feedback = readStore("toyHavenFeedback", []);
    feedback.push({name:name.value.trim(), email:email.value.trim(), message:message.value.trim(), date:new Date().toISOString()});
    writeStore("toyHavenFeedback", feedback);
    success.textContent = "Thank you. Your feedback was saved successfully.";
    form.reset();
  });

  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      button.querySelector("span").textContent = open ? "−" : "+";
    });
  });
});
