document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  const panels = [...document.querySelectorAll(".checkout-panel")];
  const steps = [...document.querySelectorAll(".step")];
  const itemsWrap = document.getElementById("checkoutItems");
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const shippingEl = document.getElementById("checkoutShipping");
  const totalEl = document.getElementById("checkoutTotal");
  const cardFields = document.getElementById("cardFields");
  let activeStep = "address";

  if (!getCart().length) {
    showToast("Your cart is empty");
  }

  function cartSubtotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function shippingCost() {
    return Number(form.querySelector('input[name="shipping"]:checked')?.dataset.cost || 0);
  }

  function renderSummary() {
    const cart = getCart();
    itemsWrap.innerHTML = cart.map(item => `
      <article class="checkout-mini">
        <img src="${item.image}" alt="${item.name}" width="70" height="70">
        <div><strong>${item.name}</strong><p>Qty: ${item.quantity}</p><p>${formatPrice(item.price * item.quantity)}</p></div>
      </article>`).join("");

    const subtotal = cartSubtotal();
    const shipping = shippingCost();

    subtotalEl.textContent = formatPrice(subtotal);
    shippingEl.textContent = formatPrice(shipping);
    totalEl.textContent = formatPrice(subtotal + shipping);
  }

  function showPanel(name) {
    activeStep = name;
    panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === name));
    steps.forEach(step => step.classList.toggle("active", step.dataset.step === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setError(input, message) {
    const field = input.closest(".field");
    if (!field) return;
    field.querySelector(".error").textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateAddress() {
    let valid = true;
    const checks = [
      ["fullName", v => v.trim().length >= 3, "Enter your full name."],
      ["email", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email."],
      ["address", v => v.trim().length >= 6, "Enter a valid delivery address."],
      ["city", v => v.trim().length >= 2, "Enter your city."],
      ["country", v => v !== "", "Choose a country."],
      ["zip", v => /^\d{5}$/.test(v), "Zip code must contain 5 digits."]
    ];

    checks.forEach(([id, test, message]) => {
      const input = document.getElementById(id);
      const ok = test(input.value);
      setError(input, ok ? "" : message);
      if (!ok) valid = false;
    });

    return valid;
  }

  function validatePayment() {
    const method = form.querySelector('input[name="paymentMethod"]:checked').value;
    if (method === "Cash on Delivery") return true;
    let valid = true;

    const checks = [
      ["cardName", v => v.trim().length >= 3, "Enter the cardholder name."],
      ["cardNumber", v => /^\d{16}$/.test(v.replace(/\s/g,"")), "Enter a 16-digit card number."],
      ["expiryMonth", v => v !== "", "Choose month."],
      ["expiryYear", v => v !== "", "Choose year."],
      ["cvc", v => /^\d{3,4}$/.test(v), "Enter a valid CVC."]
    ];

    checks.forEach(([id, test, message]) => {
      const input = document.getElementById(id);
      const ok = test(input.value);
      setError(input, ok ? "" : message);
      if (!ok) valid = false;
    });

    return valid;
  }

  document.querySelectorAll(".next-step").forEach(btn => btn.addEventListener("click", () => {
    if (activeStep === "address" && !validateAddress()) return;
    const next = btn.dataset.next;
    const nextStep = steps.find(step => step.dataset.step === next);
    nextStep.disabled = false;
    showPanel(next);
  }));

  document.querySelectorAll(".prev-step").forEach(btn => btn.addEventListener("click", () => showPanel(btn.dataset.prev)));

  form.querySelectorAll('input[name="shipping"]').forEach(radio => radio.addEventListener("change", () => {
    document.querySelectorAll(".shipping-option").forEach(label => label.classList.toggle("selected", label.contains(radio) && radio.checked));
    renderSummary();
  }));

  form.querySelectorAll('input[name="paymentMethod"]').forEach(radio => radio.addEventListener("change", () => {
    const isCard = form.querySelector('input[name="paymentMethod"]:checked').value === "Card";
    cardFields.classList.toggle("hidden", !isCard);
  }));

  document.getElementById("cardNumber").addEventListener("input", e => {
    const digits = e.target.value.replace(/\D/g,"").slice(0,16);
    e.target.value = digits.replace(/(\d{4})(?=\d)/g,"$1 ");
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!getCart().length) {
      showToast("Add products before checkout");
      return;
    }
    if (!validateAddress() || !validatePayment()) return;

    const cart = getCart();
    const order = {
      id: `TH-${Date.now()}`,
      date: new Date().toISOString(),
      customer: {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        country: document.getElementById("country").value,
        zip: document.getElementById("zip").value.trim()
      },
      shippingMethod: form.querySelector('input[name="shipping"]:checked').value,
      paymentMethod: form.querySelector('input[name="paymentMethod"]:checked').value,
      items: cart,
      subtotal: cartSubtotal(),
      shipping: shippingCost(),
      total: cartSubtotal() + shippingCost()
    };

    const history = readStore("toyHavenOrderHistory", []);
    history.push(order);
    writeStore("toyHavenOrderHistory", history);
    saveCart([]);

    const success = document.getElementById("successOverlay");
    success.classList.add("show");
    success.setAttribute("aria-hidden","false");
  });

  renderSummary();
});
