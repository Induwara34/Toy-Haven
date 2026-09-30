
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");

  function render() {
    const wishlist = getWishlist();
    empty.classList.toggle("hidden", wishlist.length > 0);
    grid.innerHTML = wishlist.map(item => `
      <article class="product-card">
        <div class="product-media"><img src="${item.image}" alt="${item.name}" width="600" height="600" loading="lazy"></div>
        <div class="product-body">
          <p class="product-meta">${item.category}</p>
          <h2>${item.name}</h2>
          <p class="product-price">${formatPrice(item.price)}</p>
          <label for="status-${item.id}">Collection status</label>
          <select class="status-select" id="status-${item.id}" data-id="${item.id}">
            <option ${item.status==="Interested"?"selected":""}>Interested</option>
            <option ${item.status==="Owned"?"selected":""}>Owned</option>
            <option ${item.status==="Not Interested"?"selected":""}>Not Interested</option>
          </select>
          <div class="card-actions">
            <button class="add-cart" data-id="${item.id}" type="button">Add to Cart</button>
            <button class="remove-wishlist" data-id="${item.id}" type="button">Remove</button>
          </div>
        </div>
      </article>`).join("");

    grid.querySelectorAll(".status-select").forEach(select => select.addEventListener("change", () => {
      const list = getWishlist();
      const item = list.find(item => item.id === Number(select.dataset.id));
      if (item) item.status = select.value;
      saveWishlist(list);
      showToast("Collection status updated");
    }));
    
    grid.querySelectorAll(".add-cart").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id)));
    grid.querySelectorAll(".remove-wishlist").forEach(btn => btn.addEventListener("click", () => {
      saveWishlist(getWishlist().filter(item => item.id !== Number(btn.dataset.id)));
      render();
    }));
  }
  render();
});
