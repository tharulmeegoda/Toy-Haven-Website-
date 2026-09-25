

const CART_STORAGE_KEY = "toyhaven_cart";

// ============================================================
// DATA FUNCTIONS (used site-wide)
// ============================================================

// Reads the cart from localStorage.
// The cart is stored as an array of { id, quantity } — NOT full
// product objects. We look up name/price/image from products.js
// whenever we need to display something. This avoids storing
// duplicate/outdated product data in localStorage.
function getShoppingCart() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Saves the cart array back to localStorage.
// localStorage only stores strings, so we JSON.stringify the array.
function saveShoppingCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Adds a product to the cart by id. If it's already in the cart,
// increase its quantity instead of adding a duplicate row.
// Called from the Products page "Add to Cart" button.
function addToCart(productId) {
  const cart = getShoppingCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveShoppingCart(cart);
  updateCartCount();
  displayCart(); // if we're on the cart page, refresh it immediately
}

// Adds up the quantity of every item in the cart — the number shown
// in the little badge on the cart icon.
function getCartCount() {
  const cart = getShoppingCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Updates the header cart badge on whichever page is currently open.
function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

// ============================================================
// DISPLAY FUNCTIONS (cart.html only)
// ============================================================

// Builds the HTML for one cart row. Looks up the full product
// details (name/price/image) from the `products` array using the
// id stored in the cart, then combines it with the quantity.
function createCartItemHTML(cartItem) {
  const product = products.find((p) => p.id === cartItem.id);
  if (!product) return ""; // safety check in case product data changed

  const subtotal = product.price * cartItem.quantity;

  return `
    <div class="cart-item" data-id="${product.id}">
      <div class="cart-item-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.classList.add('image-missing');">
        <span class="image-placeholder">PRODUCT</span>
      </div>
      <div class="cart-item-details">
        <h3>${product.name}</h3>
        <p class="cart-item-price">$${product.price.toFixed(2)} each</p>
        <p class="cart-item-subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
      </div>
      <div class="qty-stepper">
        <button class="qty-decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
        <span>${cartItem.quantity}</span>
        <button class="qty-increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove-item-btn" data-id="${product.id}" aria-label="Remove item" style="color: var(--text-muted); font-size: 1.1rem; margin-left: var(--space-sm);">&times;</button>
    </div>
  `;
}

// Renders every row in the cart, plus the summary totals. This is
// the main "draw the whole cart page" function — called on load and
// again after every change (add/remove/qty change) so the page
// always matches what's in localStorage.
function displayCart() {
  const container = document.getElementById("cart-items");
  if (!container) return; // only runs on cart.html

  const cart = getShoppingCart();

  if (cart.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary);">Your cart is empty. <a href="products.html" style="color: var(--accent);">Browse products</a></p>`;
  } else {
    container.innerHTML = cart.map(createCartItemHTML).join("");
  }

  updateCartTotals(cart);
}

// Calculates and displays the subtotal and total in the summary box.
// (In this project subtotal and total are the same figure — no tax
// or shipping is required by the assignment brief — but they're kept
// as separate lines to match the Figma "Cart Summary" layout.)
function updateCartTotals(cart) {
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  if (!subtotalEl || !totalEl) return;

  let total = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) total += product.price * item.quantity;
  });

  subtotalEl.textContent = `$${total.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Changes a product's quantity by +1 or -1. If quantity would drop
// to 0, remove the item from the cart entirely instead.
function changeQuantity(productId, amount) {
  const cart = getShoppingCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveShoppingCart(cart);
  updateCartCount();
  displayCart();
}

// Removes one product entirely from the cart, regardless of quantity.
function removeFromCart(productId) {
  let cart = getShoppingCart();
  cart = cart.filter((item) => item.id !== productId);
  saveShoppingCart(cart);
  updateCartCount();
  displayCart();
}

// Empties the cart completely — used by the "Clear Cart" button.
function clearCart() {
  saveShoppingCart([]);
  updateCartCount();
  displayCart();
}

// Sets up all the click handling for the cart page: qty buttons,
// remove buttons, and Clear Cart. Uses event delegation on the
// cart items container so it still works after displayCart()
// re-renders the rows (a listener attached directly to a button
// would be destroyed and lost every time innerHTML is replaced).
function initCartPageEvents() {
  const container = document.getElementById("cart-items");
  const clearBtn = document.getElementById("clear-cart-btn");
  if (!container) return; // not on cart.html

  container.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("qty-increase")) {
      changeQuantity(id, 1);
    } else if (e.target.classList.contains("qty-decrease")) {
      changeQuantity(id, -1);
    } else if (e.target.classList.contains("remove-item-btn")) {
      removeFromCart(id);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  initCartPageEvents();
});
