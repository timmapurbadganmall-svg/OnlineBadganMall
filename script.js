// Get Cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Save Cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to Cart
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

// Render Cart Sidebar
function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  if (!cartItems || !totalEl) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    cartItems.innerHTML += `
      <li>
        <img src="${item.photo}" alt="${item.name}" style="width:40px;height:40px;vertical-align:middle;margin-right:5px;">
        ${item.name} (${item.qty} kg) - ₹${itemTotal}
        <button class="remove" onclick="removeItem(${index})">X</button>
      </li>
    `;
  });

  totalEl.innerText = total;
}

// Remove Item
function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Qty Buttons
function increaseQty(id) {
  let input = document.getElementById(id);
  input.value = parseInt(input.value) + 1;
}
function decreaseQty(id) {
  let input = document.getElementById(id);
  let val = parseInt(input.value);
  if (val > 1) input.value = val - 1;
}

// Init
document.addEventListener("DOMContentLoaded", renderCart);
