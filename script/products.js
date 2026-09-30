document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const searchInput = document.getElementById("productSearch");
  const sortSelect = document.getElementById("sortProducts");
  const filters = [...document.querySelectorAll(".category-filter")];
  const count = document.getElementById("productCount");
  const loadMore = document.getElementById("loadMoreBtn");
  const clear = document.getElementById("clearFilters");
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  let visible = 6;

  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("search") || "";
  const initialCategory = params.get("category");
  searchInput.value = initialSearch;
  if (initialCategory) {
    filters.find(f => f.value === initialCategory)?.setAttribute("checked", "");
  }

  function filteredProducts() {
    const selected = filters.filter(f => f.checked).map(f => f.value);
    const term = searchInput.value.trim().toLowerCase();
    let list = PRODUCTS.filter(p => (!selected.length || selected.includes(p.category)) && p.name.toLowerCase().includes(term));

    if (sortSelect.value === "low") list.sort((a,b) => a.price - b.price);
    if (sortSelect.value === "high") list.sort((a,b) => b.price - a.price);
    if (sortSelect.value === "name") list.sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }

  function render() {
    const list = filteredProducts();
    const shown = list.slice(0, visible);
    count.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;
    grid.innerHTML = shown.length ? shown.map(product => productCardHTML(product)).join("") : `<div class="empty-state"><h2>No products found</h2><p>Try another search or category.</p></div>`;

    grid.querySelectorAll(".add-cart").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id)));
    grid.querySelectorAll(".add-wishlist").forEach(btn => btn.addEventListener("click", () => {
      addToWishlist(btn.dataset.id);
      btn.textContent = "♥";
    }));
    grid.querySelectorAll(".modal-trigger").forEach(btn => btn.addEventListener("click", () => openModal(btn.dataset.id)));

    loadMore.classList.toggle("hidden", visible >= list.length);
  }

  function openModal(id) {
    const product = PRODUCTS.find(p => p.id === Number(id));
    if (!product) return;
    modalContent.innerHTML = `
      <div class="modal-grid">
        <img src="${product.image}" alt="${product.name}" width="600" height="600">
        <div>
          <p class="product-meta">${product.category}</p>
          <h2 id="modalTitle">${product.name}</h2>
          <p>${product.description}</p>
          <p class="product-price">${formatPrice(product.price)}</p>
          <div class="card-actions">
            <button class="add-cart" data-id="${product.id}" type="button">Add to Cart</button>
            <button class="add-wishlist" data-id="${product.id}" type="button">♡ Wishlist</button>
          </div>
        </div>
      </div>`;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();

    modalContent.querySelector(".add-cart").addEventListener("click", () => addToCart(product.id));
    modalContent.querySelector(".add-wishlist").addEventListener("click", e => {
      addToWishlist(product.id);
      e.currentTarget.textContent = "♥ Saved";
    });
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  searchInput.addEventListener("input", () => { visible = 6; render(); });
  sortSelect.addEventListener("change", render);
  filters.forEach(filter => filter.addEventListener("change", () => { visible = 6; render(); }));

  clear.addEventListener("click", () => {
    filters.forEach(filter => filter.checked = false);
    searchInput.value = "";
    sortSelect.value = "popular";
    visible = 6;
    render();
  });

  loadMore.addEventListener("click", () => { visible += 3; render(); });
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  render();

  const initialProduct = params.get("product");
  
  if (initialProduct) openModal(initialProduct);
});
