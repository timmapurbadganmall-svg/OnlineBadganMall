// =================== CART SYSTEM =================== //
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart
function addToCart(name, price, photo, qtyInputId) {
    let qty = parseInt(document.getElementById(qtyInputId).value) || 1;
    if (qty < 1) qty = 1;

    let cart = getCart();
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, photo, qty });
    }

    saveCart(cart);
    renderCart();
    alert(`${qty} x ${name} added to cart`);
}

// Render cart (for index.html sidebar cart)
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    let cart = getCart();
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.qty;
        total += itemTotal;

        cartItems.innerHTML += `
            <li>
              <img src="${item.photo}" width="40" height="40"> 
              ${item.name} x ${item.qty} = ₹${itemTotal}
              <button class="remove" onclick="removeItem(${index})">Remove</button>
            </li>`;
    });

    const totalEl = document.getElementById('total');
    if (totalEl) totalEl.innerText = total;
}

// Remove single item
function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// =================== QTY BUTTONS =================== //
function increaseQty(inputId) {
    let input = document.getElementById(inputId);
    let val = parseInt(input.value) || 1;
    input.value = val + 1;
}

function decreaseQty(inputId) {
    let input = document.getElementById(inputId);
    let val = parseInt(input.value) || 1;
    if (val > 1) input.value = val - 1;
}

// =================== INIT =================== //
document.addEventListener("DOMContentLoaded", () => {
    renderCart(); // sidebar cart show on page load
});
