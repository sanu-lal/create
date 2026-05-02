// cart.js
// Manage Cart state with localStorage and handle WhatsApp integration + Floating Cart

let cart = JSON.parse(localStorage.getItem('woodenStoreCart')) || [];

// Update Cart Count in Navbar
function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countSpan.textContent = totalItems;
    }
}

// Add Item to Cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price: parseInt(price), quantity: 1 });
    }
    saveCart();
    updateCartCount();
    
    // Open the mini-cart
    openCart();
}

// Remove Item from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart(); 
    updateCartCount();
}

// Increase/Decrease Quantity
function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
            updateCartCount();
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('woodenStoreCart', JSON.stringify(cart));
}

// Floating Cart Logic
function toggleCart() {
    const cartEl = document.getElementById('floatingCart');
    if (cartEl.classList.contains('show')) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartEl = document.getElementById('floatingCart');
    if (cartEl) {
        cartEl.classList.add('show');
        renderCart();
    }
}

function closeCart() {
    const cartEl = document.getElementById('floatingCart');
    if (cartEl) {
        cartEl.classList.remove('show');
    }
}

// Render Cart in Floating Widget
function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total-price');
    
    if (!cartContainer || !cartTotalElement) return;

    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center mt-3 text-muted">Your cart is empty.</p>';
        cartTotalElement.textContent = '₹0';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price} x ${item.quantity} = ₹${itemTotal}</div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary me-1 px-2" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="mx-1">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary ms-1 px-2" onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
        `;
        cartContainer.appendChild(itemEl);
    });

    cartTotalElement.textContent = `₹${total}`;
}

// WhatsApp Checkout Logic
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "👋 *Hey, I want to place an order*\n\n";
    message += " *Order Details*\n\n";
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        message += `${index + 1}. ${item.name}\n`;
        message += `   ₹${item.price} × ${item.quantity} = ₹${itemTotal}\n\n`;
    });

    message += ` *Grand Total: ₹${grandTotal}*\n\n`;
    message += "Please confirm my order.";

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "8592894615";

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Bind search functionality if the search input exists
    const searchInput = document.getElementById('navSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (window.location.pathname.includes('products.html')) {
                // If on products page, filter directly
                if (typeof filterProductsBySearch === 'function') {
                    filterProductsBySearch(term);
                }
            } else {
                // On index.html, listen for Enter key to redirect
            }
        });

       searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const term = e.target.value.trim();

        // Only redirect if user actually typed something manually
        if (term.length > 0 && !window.location.pathname.includes('products.html')) {
            window.location.href = `products.html?search=${encodeURIComponent(term)}`;
        }
    }
});
    }
});
cart = [];
saveCart();
renderCart();
updateCartCount();