

const WISHLIST_STORAGE_KEY = "toyhaven_wishlist";

// ============================================================
// DATA FUNCTIONS (used site-wide)
// ============================================================

// The wishlist is stored as an array of { id, status } — same
// pattern as the cart. Default status when first added is
// "Interested"; the user can change it later on the Collection page.
function getWishlist() {
  const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
}

function isInWishlist(productId) {
  return getWishlist().some((item) => item.id === productId);
}

// Called by the heart button on a product card. Adds with status
// "Interested" if not already saved, or removes entirely if it is
// (a simple on/off toggle — changing status happens on Collection page).
function toggleWishlist(productId) {
  let list = getWishlist();
  const exists = list.find((item) => item.id === productId);

  if (exists) {
    list = list.filter((item) => item.id !== productId);
  } else {
    list.push({ id: productId, status: "Interested" });
  }

  saveWishlist(list);
  renderCollectionColumns(); // no-op if we're not on collection.html
}

// ============================================================
// DISPLAY FUNCTIONS (collection.html only)
// ============================================================

// Builds one wishlist card: the standard product card (from main.js,
// reused again) plus a status dropdown and a remove button underneath.
function createWishlistItemHTML(item) {
  const product = products.find((p) => p.id === item.id);
  if (!product) return "";

  return `
    <div class="wishlist-item">
      ${createProductCardHTML(product)}
      <div class="status-controls">
        <select class="status-select" data-id="${product.id}">
          <option value="Interested" ${item.status === "Interested" ? "selected" : ""}>Interested</option>
          <option value="Owned" ${item.status === "Owned" ? "selected" : ""}>Owned</option>
          <option value="Not Interested" ${item.status === "Not Interested" ? "selected" : ""}>Not Interested</option>
        </select>
        <button class="remove-wishlist-btn" data-id="${product.id}">Remove</button>
      </div>
    </div>
  `;
}

// Splits the wishlist into its three status groups and draws each
// into its own column. Called on load AND after every change
// (add/remove/status change) so all three columns always match
// what's in localStorage.
function renderCollectionColumns() {
  const interestedCol = document.getElementById("collection-interested");
  if (!interestedCol) return; // not on collection.html

  const ownedCol = document.getElementById("collection-owned");
  const notInterestedCol = document.getElementById("collection-not-interested");
  const wishlist = getWishlist();

  const renderColumn = (container, status) => {
    const items = wishlist.filter((item) => item.status === status);
    container.innerHTML = items.length
      ? items.map(createWishlistItemHTML).join("")
      : `<p style="color: var(--text-secondary); font-size: 0.85rem;">Nothing here yet.</p>`;
  };

  renderColumn(interestedCol, "Interested");
  renderColumn(ownedCol, "Owned");
  renderColumn(notInterestedCol, "Not Interested");
}

// Moves an item to a different status column.
function updateWishlistStatus(productId, newStatus) {
  const list = getWishlist();
  const item = list.find((i) => i.id === productId);
  if (!item) return;

  item.status = newStatus;
  saveWishlist(list);
  renderCollectionColumns();
}

// Removes an item from the wishlist completely (not just moving it —
// this deletes it, used by the "Remove" button under each card).
function removeFromWishlistCompletely(productId) {
  let list = getWishlist();
  list = list.filter((item) => item.id !== productId);
  saveWishlist(list);
  renderCollectionColumns();
}

// Event delegation for the status dropdown (change event) and the
// Remove button (click event) — one listener on the shared parent
// instead of one per card, since cards get replaced on every render.
function initCollectionPageEvents() {
  const wrapper = document.getElementById("collection-columns");
  if (!wrapper) return;

  wrapper.addEventListener("change", (e) => {
    if (e.target.classList.contains("status-select")) {
      const id = Number(e.target.dataset.id);
      updateWishlistStatus(id, e.target.value);
    }
  });

  wrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-wishlist-btn")) {
      const id = Number(e.target.dataset.id);
      removeFromWishlistCompletely(id);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCollectionColumns();
  initCollectionPageEvents();
});
