// ------------------ Cart Management ------------------
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const deliveryCharge = 10;

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price, photo, qty) {
    qty = parseInt(qty) || 1;
    const index = cart.findIndex(item => item.name === name);
    if (index >= 0) {
        cart[index].qty += qty;
    } else {
        cart.push({name, price, photo, qty});
    }
    saveCart();
    alert(`${name} added to cart!`);
    renderCart();
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Render cart table and totals
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';
    let totalAmount = 0;

    cart.forEach((item, index) => {
        totalAmount += item.price * item.qty;
        cartItems.innerHTML += `<tr>
            <td><img src="${item.photo}" alt="${item.name}"></td>
            <td>${item.name} x ${item.qty}</td>
            <td>₹${item.price * item.qty}</td>
            <td><button class="remove" onclick="removeItem(${index})">Remove</button></td>
        </tr>`;
    });

    const totalEl = document.getElementById('total-amount');
    const grandTotalEl = document.getElementById('grand-total');
    const minOrderWarning = document.getElementById('min-order-warning');

    totalEl.innerText = `Total Amount: ₹${totalAmount}`;
    grandTotalEl.innerText = `Grand Total: ₹${totalAmount + deliveryCharge}`;

    // Update order details textarea
    const orderDetailsEl = document.getElementById('order_details');
    if(orderDetailsEl) {
        if(cart.length > 0){
            orderDetailsEl.value = cart.map(i=>`${i.name} x ${i.qty} - ₹${i.price*i.qty}`).join("\n") +
                `\nTotal Amount: ₹${totalAmount}\nDelivery Charge: ₹${deliveryCharge}\nGrand Total: ₹${totalAmount+deliveryCharge}`;
        } else {
            orderDetailsEl.value = "Your cart is empty.";
        }
    }

    // Update Submit button state
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const submitBtn = document.getElementById('submitOrderBtn');

    if(totalAmount < 500){
        minOrderWarning.style.display = 'block';
    } else {
        minOrderWarning.style.display = 'none';
    }

    if(submitBtn){
        if(totalAmount >= 500 && nameInput.value.trim() !== "" && addressInput.value.trim() !== ""){
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }
}

// ------------------ Form Submission ------------------
const orderForm = document.getElementById('orderForm');
if(orderForm){
    orderForm.addEventListener('submit', function(event){
        const totalAmount = cart.reduce((sum, i)=>sum + i.price*i.qty, 0);
        if(cart.length === 0 || totalAmount < 500){
            event.preventDefault();
            alert("Cart is empty or total amount less than ₹500!");
            return;
        }

        const mobileInput = document.getElementById('mobile');
        const digits = mobileInput.value.replace(/\D/g,'');
        if(digits.length !== 10){
            event.preventDefault();
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        // Clear cart after short delay to ensure form submits
        setTimeout(()=>{
            cart = [];
            saveCart();
            renderCart();
            alert("Order submitted! You will receive confirmation email.");
        }, 100);
    });
}

// ------------------ Admin Panel ------------------
function displayOrders(){
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersUl = document.getElementById('orders'); 
    if(!ordersUl) return;
    ordersUl.innerHTML = '';
    orders.forEach((order,index)=>{
        let li=document.createElement('li');
        li.innerHTML = `<strong>${order.name}</strong> - ${order.phone}<br>
                        ${order.address}<br>
                        Items: ${order.items.map(i=>i.name+" ₹"+i.price).join(", ")}<br>
                        Total: ₹${order.total} <br>
                        Delivered: ${order.delivered ? 'Yes' : 'No'} 
                        <button onclick="markDelivered(${index})">Mark Delivered</button><hr>`;
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
document.addEventListener("DOMContentLoaded", renderCart);
