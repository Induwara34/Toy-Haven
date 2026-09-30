const PRODUCTS = [
  {
    "id": 1,
    "name": "Diecast Sports Car",
    "category": "Diecast Cars",
    "price": 4500,
    "image": "assets/images/diecast sports car.jpg",
    "description": "Diecast Sports Car from the diecast cars collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 2,
    "name": "Classic Teddy Bear",
    "category": "Toys",
    "price": 3200,
    "image": "assets/images/teddy bear.jpg",
    "description": "Classic Teddy Bear from the toys collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 3,
    "name": "Family Board Game",
    "category": "Board Games",
    "price": 5800,
    "image": "assets/images/family board game.jpg",
    "description": "Family Board Game from the board games collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 4,
    "name": "Robot Explorer",
    "category": "Toys",
    "price": 7600,
    "image": "assets/images/robot toy.jpg",
    "description": "Robot Explorer from the toys collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 5,
    "name": "Collector Figurine",
    "category": "Figurines",
    "price": 6900,
    "image": "assets/images/hero figurine.jpg",
    "description": "Collector Figurine from the figurines collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 6,
    "name": "Mini Racing Set",
    "category": "Diecast Cars",
    "price": 5200,
    "image": "assets/images/mini racing set.jpg",
    "description": "Mini Racing Set from the diecast cars collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 7,
    "name": "Fantasy Strategy Game",
    "category": "Board Games",
    "price": 6400,
    "image": "assets/images/fantasy strategy game.jpg",
    "description": "Fantasy Strategy Game from the board games collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 8,
    "name": "Space Hero Figurine",
    "category": "Figurines",
    "price": 7200,
    "image": "assets/images/space hero figurine.jpg",
    "description": "Space Hero Figurine from the figurines collection. Designed for an enjoyable Toy Haven browsing experience."
  },
  {
    "id": 9,
    "name": "Building Blocks",
    "category": "Toys",
    "price": 4100,
    "image": "assets/images/building blocks.jpg",
    "description": "Building Blocks from the toys collection. Designed for an enjoyable Toy Haven browsing experience."
  }
];

/* Reusable helpers used on multiple pages */
function readStore(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function formatPrice(value) {
  return `LKR ${Number(value).toLocaleString("en-LK")}`;
}
function getCart() {
  return readStore("toyHavenCart", []);
}
function saveCart(cart) {
  writeStore("toyHavenCart", cart);
  updateCartCount();
}
function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart(cart);
  showToast(`${product.name} added to cart`);
}
function getWishlist() {
  return readStore("toyHavenWishlist", []);
}
function saveWishlist(list) {
  writeStore("toyHavenWishlist", list);
}
function addToWishlist(productId) {
  const product = PRODUCTS.find(p => p.id === Number(productId));
  if (!product) return;
  const wishlist = getWishlist();
  if (!wishlist.some(item => item.id === product.id)) {
    wishlist.push({ ...product, status: "Interested" });
    saveWishlist(wishlist);
    showToast(`${product.name} added to wishlist`);
  } else {
    showToast("Product is already in your wishlist");
  }
}
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function productCardHTML(product, options = {}) {
  const wishlist = getWishlist();
  const saved = wishlist.some(item => item.id === product.id);
  return `
    <article class="product-card">
      <button class="product-media modal-trigger" data-id="${product.id}" type="button" aria-label="View details for ${product.name}">
        <img src="${product.image}" alt="${product.name}" width="600" height="600" loading="lazy">
      </button>
      <div class="product-body">
        <p class="product-meta">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="card-actions">
          <button class="add-cart" data-id="${product.id}" type="button">Add to Cart</button>
          <button class="add-wishlist" data-id="${product.id}" type="button" aria-label="Add ${product.name} to wishlist">${saved ? "♥" : "♡"}</button>
        </div>
      </div>
    </article>`;
}
