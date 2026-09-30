document.addEventListener("DOMContentLoaded", () => {
  const itemsWrap = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");

  function renderCart() {
    const cart = getCart();
    if (!cart.length) {
      itemsWrap.innerHTML = `<div class="empty-state"><h2>Your cart is empty</h2><p>Add a product from the shop.</p><a class="btn" href="products.html">Continue shopping</a></div>`;
    } else {
      itemsWrap.innerHTML = cart.map(item => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}" width="120" height="120">
          <div>
            <h2>${item.name}</h2>
            <p>${item.category}</p>
            <p>${formatPrice(item.price)} each</p>
            <div class="quantity-control" aria-label="Quantity controls for ${item.name}">
              <button class="qty-minus" data-id="${item.id}" type="button" aria-label="Decrease quantity">−</button>
              <strong>${item.quantity}</strong>
              <button class="qty-plus" data-id="${item.id}" type="button" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-button" data-id="${item.id}" type="button">Remove</button>
          </div>
          <div class="cart-line-total">${formatPrice(item.price * item.quantity)}</div>
        </article>`).join("");
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);
    bindButtons();
  }

  function changeQuantity(id, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === Number(id));
    if (!item) return;
    item.quantity += change;
    const updated = cart.filter(item => item.quantity > 0);
    saveCart(updated);
    renderCart();
  }

  function bindButtons() {
    itemsWrap.querySelectorAll(".qty-minus").forEach(btn => btn.addEventListener("click", () => changeQuantity(btn.dataset.id, -1)));
    itemsWrap.querySelectorAll(".qty-plus").forEach(btn => btn.addEventListener("click", () => changeQuantity(btn.dataset.id, 1)));
    itemsWrap.querySelectorAll(".remove-button").forEach(btn => btn.addEventListener("click", () => {
      saveCart(getCart().filter(item => item.id !== Number(btn.dataset.id)));
      renderCart();
    }));
  }

  document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (!getCart().length) return;
    if (confirm("Clear all products from your cart?")) {
      saveCart([]);
      renderCart();
    }
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!getCart().length) {
      showToast("Your cart is empty");
      return;
    }
    location.href = "checkout.html";
  });

  renderCart();
});
