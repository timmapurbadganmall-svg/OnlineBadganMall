// ------------------ Cart Initialization ------------------
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
// Ensure qty exists and numeric
cart = cart.map(item => ({...item, qty: item.qty ? Number(item.qty) : 1}));

// ------------------ Customer Side ------------------

// Add to Cart
function addToCart(name, price, photo, qty) {
    qty = Number(qty) || 1;
    // Check if product already in cart
    const existing = cart.find(i => i.name === name);
    if(existing) {
        existing.qty += qty;
    } else {
        cart.push({name, price: Number(price), photo, qty});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Remove item from cart
function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Get total amount
function getTotalAmount() {
    return cart.reduce((sum,i)=> sum + (Number(i.price)*Number(i.qty)),0);
}

// Render cart in order.html or cart sidebar
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if(!cartItems) return;
    cartItems.innerHTML = '';
    let totalAmount = 0;

    cart.forEach((item,index)=>{
        totalAmount += Number(item.price)*Number(item.qty);
        cartItems.innerHTML += `<tr>
            <td><img src="${item.photo}" alt="${item.name}"></td>
            <td>${item.name} x ${item.qty}</td>
            <td>₹${Number(item.price)*Number(item.qty)}</td>
            <td><button class="remove" onclick="removeItem(${index})">Remove</button></td>
        </tr>`;
    });

    const deliveryCharge = 10;
    const totalElem = document.getElementById('total-amount');
    const grandTotalElem = document.getElementById('grand-total');
    const orderDetailsElem = document.getElementById('order_details');
    const cartTotalElem = document.getElementById('cart-total');

    if(totalElem) totalElem.innerText = `Total Amount: ₹${totalAmount}`;
    if(grandTotalElem) grandTotalElem.innerText = `Grand Total: ₹${totalAmount + deliveryCharge}`;
    if(cartTotalElem) cartTotalElem.innerText = totalAmount;

    if(orderDetailsElem){
        orderDetailsElem.value = cart.length > 0 ?
            cart.map(i=>`${i.name} x ${i.qty} - ₹${i.price*i.qty}`).join("\n")+
            `\nTotal Amount: ₹${totalAmount}\nDelivery Charge: ₹${deliveryCharge}\nGrand Total: ₹${totalAmount + deliveryCharge}` :
            "Your cart is empty.";
    }

    updateSubmitButton();
}

// ------------------ Submit Button Logic ------------------
const nameInput = document.getElementById("name");
const addressInput = document.getElementById("address");
const mobileInput = document.getElementById("mobile");
const submitBtn = document.getElementById("submitOrderBtn");
const minOrderWarning = document.getElementById("min-order-warning");

function updateSubmitButton() {
    const totalAmount = getTotalAmount();
    const name = nameInput?.value.trim() || "";
    const address = addressInput?.value.trim() || "";

    if(minOrderWarning) minOrderWarning.style.display = (totalAmount < 500) ? 'block' : 'none';
    if(submitBtn) submitBtn.disabled = !(totalAmount >= 500 && name !== "" && address !== "");
}

// Listen to input changes
[nameInput,addressInput].forEach(input => input?.addEventListener("input", updateSubmitButton));

// Mobile validation
mobileInput?.addEventListener("input", ()=>{
    let digits = mobileInput.value.replace(/\D/g,'').substring(0,10);
    mobileInput.value = digits;
});

// ------------------ Form Submit ------------------
document.getElementById('orderForm')?.addEventListener('submit', function(e){
    const totalAmount = getTotalAmount();
    if(cart.length === 0 || totalAmount < 500){
        e.preventDefault();
        alert("Cart is empty or total amount less than ₹500!");
        return;
    }
    const digits = mobileInput.value.replace(/\D/g,'');
    if(digits.length !== 10){
        e.preventDefault();
        alert("Please enter a valid 10-digit mobile number");
        return;
    }
    setTimeout(()=>{
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        alert("Order submitted! You will receive confirmation email.");
    },100);
});

// ------------------ Admin Side ------------------
function displayOrders(){
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersUl = document.getElementById('orders');
    if(!ordersUl) return;
    ordersUl.innerHTML = '';

    orders.forEach((order,index)=>{
        let li = document.createElement('li');
        li.innerHTML = `
        <strong>${order.name}</strong> - ${order.phone}<br>
        ${order.address}<br>
        Items: ${order.items.map(i=>i.name+" ₹"+i.price).join(", ")}<br>
        Total: ₹${order.total} <br>
        Delivered: ${order.delivered ? 'Yes' : 'No'} 
        <button onclick="markDelivered(${index})">Mark Delivered</button>
        <hr>
        `;
        ordersUl.appendChild(li);
    });
}

function markDelivered(index){
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders[index].delivered = true;
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
}

// ------------------ Initialize ------------------
document.addEventListener("DOMContentLoaded", function(){
    renderCart();
    updateSubmitButton();
});
