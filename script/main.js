document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  const menuButton = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  const globalSearch = document.getElementById("globalSearch");
  globalSearch?.addEventListener("keydown", event => {
    if (event.key === "Enter" && globalSearch.value.trim()) {
      window.location.href = `html/products.html?search=${encodeURIComponent(globalSearch.value.trim())}`;
    }
  });

  document.querySelectorAll(".newsletter-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const message = form.querySelector(".form-message");
      const email = input.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.textContent = "Enter a valid email address.";
        return;
      }

      const emails = readStore("toyHavenNewsletter", []);
      if (!emails.includes(email)) emails.push(email);
      writeStore("toyHavenNewsletter", emails);
      message.textContent = "Subscribed successfully!";
      input.value = "";
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

});
