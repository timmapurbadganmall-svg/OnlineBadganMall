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
// For index.html product cards
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

// =================== ORDER PAGE =================== //
function renderOrderCart() {
    let cart = getCart();
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <li class="cart-item">
                <img src="${item.photo}" alt="${item.name}">
                ${item.name} x ${item.qty} - ₹${item.price * item.qty}
            </li>`;
    });

    const deliveryCharge = 10;
    const grandTotal = total + deliveryCharge;

    const totalAmount = document.getElementById('total-amount');
    const deliveryEl = document.getElementById('delivery-charge');
    const grandEl = document.getElementById('grand-total');

    if (totalAmount) totalAmount.innerText = `Total Amount: ₹${total}`;
    if (deliveryEl) deliveryEl.innerText = `Delivery Charge: ₹${deliveryCharge}`;
    if (grandEl) grandEl.innerText = `Grand Total: ₹${grandTotal}`;

    const orderDetails = document.getElementById('order_details');
    if (orderDetails) {
        orderDetails.value =
            cart.map(i => `${i.name} x ${i.qty} - ₹${i.price * i.qty}`).join("\n") +
            `\nTotal Amount: ₹${total}\nDelivery Charge: ₹${deliveryCharge}\nGrand Total: ₹${grandTotal}`;
    }

    updateSubmitButton();
}

// Get cart total
function getCartTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

// Enable/disable submit order button
function updateSubmitButton() {
    const name = document.getElementById('name')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const mobile = document.getElementById('mobile')?.value.trim();
    const total = getCartTotal();
    const digits = mobile ? mobile.replace(/\D/g, '') : '';

    const btn = document.getElementById('submitOrderBtn');
    if (btn) {
        btn.disabled = !(name && address && digits.length === 10 && total >= 500);
    }
}

// Validate mobile input
function setupMobileValidation() {
    const mobileInput = document.getElementById('mobile');
    if (!mobileInput) return;

    mobileInput.addEventListener("input", function () {
        let digits = this.value.replace(/\D/g, "").substring(0, 10);
        this.value = digits;
        updateSubmitButton();
    });
}

// Order form submit
function setupOrderForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener("submit", function (e) {
        const total = getCartTotal();
        const digits = document.getElementById("mobile").value.replace(/\D/g, "");

        if (total < 500) {
            e.preventDefault();
            alert("Minimum order amount is ₹500");
            return;
        }
        if (digits.length !== 10) {
            e.preventDefault();
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        setTimeout(() => {
            localStorage.removeItem("cart");
            renderOrderCart();
            alert("Order submitted! You will receive a confirmation email.");
        }, 100);
    });
}

// =================== INIT =================== //
document.addEventListener("DOMContentLoaded", () => {
    renderCart();       // for index.html
    renderOrderCart();  // for order.html
    setupMobileValidation();
    setupOrderForm();

    // Attach input listeners for form validation
    ['name', 'address', 'mobile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateSubmitButton);
    });
});
