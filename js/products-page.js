/*
  PRODUCTS-PAGE.JS
  ------------------------------------------------------------------
  Runs ONLY on products.html: search box, category filter pills,
  the product grid, and the quick-view modal. Uses createProductCardHTML()
  from main.js — the SAME function Home page uses — so a card looks
  identical everywhere without copying the HTML string twice.
*/

let currentCategory = "All";
let currentSearchTerm = "";

// Filters the master `products` array (from products.js) based on
// whatever search text and category are currently active, then
// re-draws the grid.
function filterAndRenderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const filtered = products.filter((product) => {
    const matchesCategory =
      currentCategory === "All" || product.category === currentCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(currentSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-secondary);">No products match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(createProductCardHTML).join("");
}

// ============================================================
// SEARCH BOX
// ============================================================
function initSearch() {
  const searchInput = document.getElementById("product-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value;
    filterAndRenderProducts();
  });
}

// ============================================================
// FILTER PILLS
// ============================================================
function initFilterPills() {
  const pills = document.querySelectorAll(".filter-pill");
  if (pills.length === 0) return;

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.category;
      filterAndRenderProducts();
    });
  });
}

// ============================================================
// QUICK-VIEW MODAL
// ------------------------------------------------------------
// Clicking a product card (but NOT its Add to Cart button) opens
// a modal with the same details, larger. Satisfies "filtering and
// modal display" in the marking scheme.
// ============================================================
function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("product-modal");
  const modalBody = document.getElementById("product-modal-body");

  const starCount = Math.round(product.rating);
  const stars = "★".repeat(starCount) + "☆".repeat(5 - starCount);

  modalBody.innerHTML = `
    <div class="product-card-image" style="aspect-ratio: 16/10; margin-bottom: var(--space-md);">
      <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.classList.add('image-missing');">
      <span class="image-placeholder">PRODUCT IMAGE</span>
    </div>
    <h2 style="margin-bottom: 6px;">${product.name}</h2>
    <p class="product-category">${product.category}${product.subcategory ? " • " + product.subcategory : ""}</p>
    <p class="product-rating" style="margin: var(--space-xs) 0;">${stars}</p>
    <p class="product-price" style="font-size: 1.3rem; margin-bottom: var(--space-md);">$${product.price.toFixed(2)}</p>
    <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
  `;

  modal.classList.add("active");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.remove("active");
}

function initProductModal() {
  const grid = document.getElementById("products-grid");
  const modal = document.getElementById("product-modal");
  const closeBtn = document.getElementById("product-modal-close");
  if (!grid || !modal) return;

  // Event delegation: one listener on the grid catches clicks on any
  // card, even cards that get re-rendered after a filter/search.
  grid.addEventListener("click", (e) => {
    // If they clicked "Add to Cart", let main.js's global handler deal
    // with it and don't open the modal.
    if (e.target.classList.contains("add-to-cart-btn")) return;

    const card = e.target.closest(".product-card");
    if (card) {
      openProductModal(Number(card.dataset.id));
    }
  });

  closeBtn.addEventListener("click", closeProductModal);

  // Click on the dark overlay (outside the box) also closes it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeProductModal();
  });
}

// ============================================================
// PRE-SELECT CATEGORY FROM URL
// ------------------------------------------------------------
// When a link includes a query string like products.html?category=Toys
// (used by the Home page's "Shop by Category" tiles), read that value
// on load and select the matching filter pill automatically — instead
// of always landing on "All" and making the user click the filter
// themselves.
// ============================================================
function applyCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  if (!requestedCategory) return; // no ?category= in the URL — leave "All" selected

  const pills = document.querySelectorAll(".filter-pill");
  const matchingPill = Array.from(pills).find(
    (pill) => pill.dataset.category === requestedCategory
  );

  if (matchingPill) {
    pills.forEach((p) => p.classList.remove("active"));
    matchingPill.classList.add("active");
    currentCategory = requestedCategory;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyCategoryFromURL(); // must run BEFORE the first render, so the
  filterAndRenderProducts(); // grid opens already filtered correctly
  initSearch();
  initFilterPills();
  initProductModal();
});
