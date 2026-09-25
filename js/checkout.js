

// ============================================================
// ORDER SUMMARY (reads the cart, same way cart.html does)
// ============================================================
function renderOrderSummary() {
  const container = document.getElementById("order-summary-items");
  const totalEl = document.getElementById("order-total");
  if (!container || !totalEl) return;

  const cart = getShoppingCart(); // from shopping-cart.js
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem;">Your cart is empty.</p>`;
  } else {
    container.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return "";
        const lineTotal = product.price * item.quantity;
        total += lineTotal;
        return `
          <div class="summary-row">
            <span>${product.name} &times; ${item.quantity}</span>
            <span>$${lineTotal.toFixed(2)}</span>
          </div>
        `;
      })
      .join("");
  }

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// ============================================================
// VALIDATION
// ------------------------------------------------------------
// Each check returns true/false and shows/hides its own error
// message. Keeping one function per field makes it easy to explain
// each rule individually in a viva, instead of one giant if-block.
// ============================================================
function showFieldError(inputId, message) {
  const errorEl = document.getElementById(inputId + "-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }
}

function clearFieldError(inputId) {
  const errorEl = document.getElementById(inputId + "-error");
  if (errorEl) {
    errorEl.classList.remove("visible");
  }
}

function validateFullName() {
  const value = document.getElementById("full-name").value.trim();
  if (value === "") {
    showFieldError("full-name", "Full name is required.");
    return false;
  }
  clearFieldError("full-name");
  return true;
}

function validateEmail() {
  const value = document.getElementById("checkout-email").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showFieldError("checkout-email", "Email is required.");
    return false;
  }
  if (!emailPattern.test(value)) {
    showFieldError("checkout-email", "Enter a valid email address.");
    return false;
  }
  clearFieldError("checkout-email");
  return true;
}

function validateAddress() {
  const value = document.getElementById("delivery-address").value.trim();
  if (value === "") {
    showFieldError("delivery-address", "Delivery address is required.");
    return false;
  }
  clearFieldError("delivery-address");
  return true;
}

function validatePaymentMethod() {
  const value = document.getElementById("payment-method").value;
  if (value === "") {
    showFieldError("payment-method", "Please choose a payment method.");
    return false;
  }
  clearFieldError("payment-method");
  return true;
}

// ============================================================
// CARD FIELDS — shown only when "Card" is selected
// ============================================================

// Shows/hides the Card Number, Expiry, and CVV fields depending on
// which payment method is selected. "Cash on Delivery" doesn't need
// card details at all.
function togglePaymentFields() {
  const paymentMethod = document.getElementById("payment-method").value;
  const cardFields = document.getElementById("card-fields");
  if (!cardFields) return;

  if (paymentMethod === "Card") {
    cardFields.style.display = "block";
  } else {
    cardFields.style.display = "none";
    // Clear out anything typed and any leftover error messages if the
    // user switches away from Card, so nothing stale gets validated.
    document.getElementById("card-number").value = "";
    document.getElementById("card-expiry").value = "";
    document.getElementById("card-cvv").value = "";
    clearFieldError("card-number");
    clearFieldError("card-expiry");
    clearFieldError("card-cvv");
  }
}

// Card number: strip spaces, must be 13–19 digits (covers all major
// card formats — Visa/Mastercard are 16, Amex is 15, etc.)
function validateCardNumber() {
  const value = document.getElementById("card-number").value.replace(/\s/g, "");
  const cardNumberPattern = /^\d{13,19}$/;

  if (value === "") {
    showFieldError("card-number", "Card number is required.");
    return false;
  }
  if (!cardNumberPattern.test(value)) {
    showFieldError("card-number", "Enter a valid card number (13–19 digits).");
    return false;
  }
  clearFieldError("card-number");
  return true;
}

// Expiry date: must match MM/YY format AND not already be in the past.
function validateCardExpiry() {
  const value = document.getElementById("card-expiry").value.trim();
  const expiryPattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  const match = value.match(expiryPattern);

  if (value === "") {
    showFieldError("card-expiry", "Expiry date is required.");
    return false;
  }
  if (!match) {
    showFieldError("card-expiry", "Use MM/YY format (e.g. 08/27).");
    return false;
  }

  // Check it isn't already expired. Card expiry means "valid through
  // the LAST day of that month," so we compare against the first day
  // of the FOLLOWING month.
  const expiryMonth = Number(match[1]);
  const expiryYear = 2000 + Number(match[2]);
  const expiryDate = new Date(expiryYear, expiryMonth, 1); // 1st of the month AFTER expiry
  const today = new Date();

  if (expiryDate <= today) {
    showFieldError("card-expiry", "This card has expired.");
    return false;
  }

  clearFieldError("card-expiry");
  return true;
}

// CVV: 3 digits for Visa/Mastercard, 4 for Amex — accept either.
function validateCardCvv() {
  const value = document.getElementById("card-cvv").value.trim();
  const cvvPattern = /^\d{3,4}$/;

  if (value === "") {
    showFieldError("card-cvv", "CVV is required.");
    return false;
  }
  if (!cvvPattern.test(value)) {
    showFieldError("card-cvv", "CVV must be 3 or 4 digits.");
    return false;
  }
  clearFieldError("card-cvv");
  return true;
}

// ============================================================
// ORDER HISTORY (localStorage)
// ------------------------------------------------------------
// Every confirmed order gets saved to its own localStorage key,
// separate from the cart. This satisfies the "order history in
// localStorage" requirement even though we don't build a page to
// browse past orders — the data is there and inspectable via
// DevTools > Application > Local Storage during your viva.
// ============================================================
function saveOrderToHistory(customerDetails, cart, total) {
  const orders = JSON.parse(localStorage.getItem("toyhaven_orders")) || [];

  orders.push({
    date: new Date().toISOString(),
    customer: customerDetails,
    items: cart,
    total: total,
  });

  localStorage.setItem("toyhaven_orders", JSON.stringify(orders));
}

// ============================================================
// FORM SUBMIT
// ============================================================
function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isAddressValid = validateAddress();
    const isPaymentValid = validatePaymentMethod();

    // Only validate card details if "Card" was actually chosen —
    // Cash on Delivery doesn't need them at all.
    const paymentMethod = document.getElementById("payment-method").value;
    let isCardValid = true;
    if (paymentMethod === "Card") {
      const isCardNumberValid = validateCardNumber();
      const isExpiryValid = validateCardExpiry();
      const isCvvValid = validateCardCvv();
      isCardValid = isCardNumberValid && isExpiryValid && isCvvValid;
    }

    if (!isNameValid || !isEmailValid || !isAddressValid || !isPaymentValid || !isCardValid) {
      return; // stop here — at least one field failed validation
    }

    const cart = getShoppingCart();
    if (cart.length === 0) {
      alert("Your cart is empty — add a product before checking out.");
      return;
    }

    // Calculate the final total the same way renderOrderSummary() did
    let total = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) total += product.price * item.quantity;
    });

    const customerDetails = {
      fullName: document.getElementById("full-name").value.trim(),
      email: document.getElementById("checkout-email").value.trim(),
      address: document.getElementById("delivery-address").value.trim(),
      paymentMethod: paymentMethod,
    };

    // SECURITY NOTE: we deliberately do NOT save the full card number
    // or CVV anywhere — not to localStorage, not in the order object.
    // Real systems never store CVV at all (it exists only to prove you
    // have the physical card in hand at the moment of payment), and a
    // full card number sitting in localStorage would be a real risk if
    // this were a live site. We only keep the last 4 digits, purely
    // for the customer's own reference — the same masked format shown
    // on real receipts (e.g. "Card ending in 4242").
    if (paymentMethod === "Card") {
      const fullCardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
      customerDetails.cardLastFour = fullCardNumber.slice(-4);
    }

    saveOrderToHistory(customerDetails, cart, total);
    clearCart(); // from shopping-cart.js — empties cart + updates badge

    // Hide the form, show the success panel with its animation
    document.getElementById("checkout-form-section").style.display = "none";
    const confirmedPanel = document.getElementById("order-confirmed");
    confirmedPanel.classList.add("visible");
  });
}

// ============================================================
// INPUT FORMATTING (nice-to-have, not required for validation)
// ------------------------------------------------------------
// These just reformat what's already been typed, e.g. turning
// "4242424242424242" into "4242 4242 4242 4242" as you type. They
// don't validate anything — validateCardNumber()/validateCardExpiry()
// still do that separately on submit.
// ============================================================
function initCardInputFormatting() {
  const cardNumberInput = document.getElementById("card-number");
  const expiryInput = document.getElementById("card-expiry");

  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", () => {
      // Strip everything except digits, cap at 19 (longest card
      // number format), then re-insert a space every 4 digits.
      const digitsOnly = cardNumberInput.value.replace(/\D/g, "").slice(0, 19);
      cardNumberInput.value = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    });
  }

  if (expiryInput) {
    expiryInput.addEventListener("input", () => {
      const digitsOnly = expiryInput.value.replace(/\D/g, "").slice(0, 4);
      if (digitsOnly.length >= 3) {
        expiryInput.value = digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2);
      } else {
        expiryInput.value = digitsOnly;
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
  initCheckoutForm();
  initCardInputFormatting();

  const paymentSelect = document.getElementById("payment-method");
  if (paymentSelect) {
    paymentSelect.addEventListener("change", togglePaymentFields);
  }
});
