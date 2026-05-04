// ================= GLOBAL =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentImages = [];
let currentImageIndex = 0;

// ================= CART =================
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = document.getElementById("cart-count");
  if (!count) return;

  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  count.textContent = totalQty;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ================= CART TOGGLE =================
function toggleCart() {
  document.getElementById("floatingCart").classList.toggle("show");
}

// ================= WHATSAPP ORDER =================
function checkoutWhatsApp() {
  let message = "🛍 *New Order* %0A%0A";

  cart.forEach(item => {
    message += `• ${item.name} x${item.qty} - ₹${item.price * item.qty}%0A`;
  });

  message += `%0A💰 Total: ₹${getCartTotal()}%0A`;

  const phone = "918592894615";
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

// ================= SWIPE =================
function enableSwipe(imgElement) {
  let startX = 0;

  imgElement.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  imgElement.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    } else if (endX - startX > 50) {
      currentImageIndex =
        (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    }

    imgElement.src = currentImages[currentImageIndex];
  });
}

// ================= ZOOM =================
function enableZoom(img) {
  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(2)";
  });

  img.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
  });
}

// ================= ADD TO CART ANIMATION =================
function animateAddToCart(event) {
  const icon = document.createElement("div");
  icon.innerHTML = "🛒";
  icon.className = "cart-pop";

  icon.style.left = event.clientX + "px";
  icon.style.top = event.clientY + "px";

  document.body.appendChild(icon);
  setTimeout(() => icon.remove(), 800);
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});