

// ============================================================
// 1. MOBILE NAVIGATION (hamburger menu)
// ============================================================
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");
  if (!hamburger || !nav) return;

  function openMenu() {
    nav.classList.add("mobile-open");
    hamburger.classList.add("open");
  }

  function closeMenu() {
    nav.classList.remove("mobile-open");
    hamburger.classList.remove("open");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); // don't let this same click immediately re-trigger the outside-tap listener below
    if (nav.classList.contains("mobile-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu if the user taps a link (better mobile UX)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu if the user taps anywhere outside it — e.g. taps
  // the page content behind the open dropdown, instead of the
  // hamburger or a nav link.
  document.addEventListener("click", (e) => {
    const clickedInsideNav = nav.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);
    if (!clickedInsideNav && !clickedHamburger && nav.classList.contains("mobile-open")) {
      closeMenu();
    }
  });
}

// ============================================================
// 2. REUSABLE PRODUCT CARD BUILDER
// ------------------------------------------------------------
// This is our "reusable JS function used across multiple pages"
// requirement. It takes ONE product object and returns the HTML
// string for a product card. main.js uses it for Home page
// sections; products-page.js and collection.js call this SAME
// function for the Products and Collection pages.
// ============================================================
function createProductCardHTML(product) {
  // Build a simple star string from the rating number, e.g. 4.8 -> "★★★★★"
  const starCount = Math.round(product.rating);
  const stars = "★".repeat(starCount) + "☆".repeat(5 - starCount);

  // Show a "NEW" or "COMING SOON" tag only if the product has that status
  let tagHTML = "";
  if (product.status === "New") {
    tagHTML = `<span class="product-tag">NEW</span>`;
  } else if (product.status === "Coming Soon") {
    tagHTML = `<span class="product-tag coming-soon">COMING SOON</span>`;
  }

  // isInWishlist() comes from collection.js — heart shows filled/active
  // if this product is already saved to the Collection page.
  const inWishlist = typeof isInWishlist === "function" && isInWishlist(product.id);

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card-image">
        ${tagHTML}
        <button class="wishlist-btn ${inWishlist ? "active" : ""}" data-id="${product.id}" aria-label="Add to wishlist">${inWishlist ? "♥" : "♡"}</button>
        <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.classList.add('image-missing');">
        <span class="image-placeholder">PRODUCT IMAGE</span>
      </div>
      <div class="product-card-body">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-rating">${stars}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
}

// ============================================================
// 3. HOME PAGE — NEWLY RELEASED / COMING SOON / PRODUCT OF THE DAY
// ============================================================
function renderNewlyReleased() {
  const container = document.getElementById("newly-released-grid");
  if (!container) return; // only runs on index.html

  const newItems = products.filter((p) => p.status === "New").slice(0, 4);
  container.innerHTML = newItems.map(createProductCardHTML).join("");
}

function renderComingSoon() {
  const container = document.getElementById("coming-soon-grid");
  if (!container) return;

  const comingItems = products.filter((p) => p.status === "Coming Soon").slice(0, 4);
  container.innerHTML = comingItems.map(createProductCardHTML).join("");
}

// "Product of the Day" — picks ONE product based on today's date, so
// it's the same all day and changes tomorrow (easy to explain in a viva:
// "day-of-year number, modulo the array length").
function renderProductOfDay() {
  const container = document.getElementById("product-of-day");
  if (!container) return;

  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((new Date() - startOfYear) / 86400000);
  const product = products[dayOfYear % products.length];

  container.innerHTML = createProductCardHTML(product);
}

// ============================================================
// 4. HERO CAROUSEL (auto-rotating + dot navigation)
// ============================================================
function initHeroCarousel() {
  const heroSection = document.querySelector(".hero-full");
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoRotateTimer;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));
    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
    currentIndex = index;

    // Each slide stores its own background image path in data-bg.
    // We apply it to the outer .hero-full section (not the slide
    // itself) so the image spans the full edge-to-edge banner width,
    // not just the padded content area. If the file doesn't exist
    // yet, the browser just shows nothing and .hero-full's own
    // background-color shows through instead — no broken-image icon.
    const bgPath = slides[index].dataset.bg;
    if (heroSection && bgPath) {
      heroSection.style.backgroundImage = `url('${bgPath}')`;
    }
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function startAutoRotate() {
    autoRotateTimer = setInterval(nextSlide, 5000); // every 5 seconds
  }

  // Clicking a dot jumps straight to that slide and restarts the timer
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      clearInterval(autoRotateTimer);
      startAutoRotate();
    });
  });

  showSlide(0);
  startAutoRotate();
}

// ============================================================
// 5. NEWSLETTER SIGNUP (footer, stored in localStorage)
// ============================================================
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    const message = document.getElementById("newsletter-message");
    const email = emailInput.value.trim();

    // Basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      message.textContent = "Please enter your email address.";
      message.style.color = "var(--error)";
    } else if (!emailPattern.test(email)) {
      message.textContent = "Please enter a valid email address.";
      message.style.color = "var(--error)";
    } else {
      // Save subscribed email in localStorage (avoid duplicates)
      const subscribers = JSON.parse(localStorage.getItem("toyhaven_newsletter")) || [];
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem("toyhaven_newsletter", JSON.stringify(subscribers));
      }
      message.textContent = "Thanks for subscribing!";
      message.style.color = "var(--success)";
      emailInput.value = "";
    }

    message.classList.add("visible");
  });
}

// ============================================================
// 6. SCROLL REVEAL ANIMATION
// ------------------------------------------------------------
// Elements with class "reveal" fade/slide in the first time they
// scroll into view. IntersectionObserver is the simple built-in
// browser tool for "has this element entered the viewport yet?"
// ============================================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// ============================================================
// 7. SERVICE WORKER REGISTRATION (PWA installability)
// ------------------------------------------------------------
// Guarded with a feature check ("serviceWorker" in navigator)
// because older browsers don't support this — trying to register
// on an unsupported browser would throw an error otherwise.
// ============================================================
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("service-worker.js").catch((error) => {
    console.log("Service worker registration failed:", error);
  });
}

// ============================================================
// RUN EVERYTHING ONCE THE PAGE HAS LOADED
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  updateCartCount(); // from shopping-cart.js — runs on every page
  renderNewlyReleased();
  renderComingSoon();
  renderProductOfDay();
  initHeroCarousel();
  initNewsletterForm();
  initScrollReveal();
  registerServiceWorker();

  // Delegated click listener: catches "Add to Cart" and wishlist-heart
  // clicks anywhere on the page, instead of attaching one listener
  // per button (buttons get re-created every time a grid re-renders).
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productId = Number(e.target.dataset.id);
      addToCart(productId);
    }

    if (e.target.classList.contains("wishlist-btn")) {
      const productId = Number(e.target.dataset.id);
      toggleWishlist(productId); // from collection.js
      const nowInWishlist = isInWishlist(productId);
      e.target.classList.toggle("active", nowInWishlist);
      e.target.textContent = nowInWishlist ? "♥" : "♡";
    }
  });
});
