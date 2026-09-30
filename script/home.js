document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.getElementById("featuredGrid");
  featuredGrid.innerHTML = PRODUCTS.slice(0, 4).map(product => productCardHTML(product)).join("");

  featuredGrid.querySelectorAll(".add-cart").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id)));
  featuredGrid.querySelectorAll(".add-wishlist").forEach(btn => btn.addEventListener("click", () => {
    addToWishlist(btn.dataset.id);
    btn.textContent = "♥";
  }));

  featuredGrid.querySelectorAll(".modal-trigger").forEach(btn => btn.addEventListener("click", () => {
    window.location.href = `html/products.html?product=${btn.dataset.id}`;
  }));

  // Featured Product of the Day: deterministic by calendar date.
  const now = new Date();
  const dayKey = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
  const product = PRODUCTS[dayKey % PRODUCTS.length];

  document.getElementById("productDayText").textContent = `${product.name} — ${product.category} — ${formatPrice(product.price)}`;
  document.getElementById("productDayVisual").innerHTML = `<img src="${product.image}" alt="${product.name}" width="600" height="600">`;
  document.getElementById("productDayButton").addEventListener("click", () => {
    window.location.href = `html/products.html?product=${product.id}`;

  });

  // Auto-rotating promotional banner.
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dotsWrap = document.querySelector(".hero-dots");
  let current = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `hero-dot${index === 0 ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Show promotion ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.children];

  function showSlide(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = index;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  setInterval(() => showSlide((current + 1) % slides.length), 4500);
});
