// ------------------ Customer Side ------------------

// Load cart from localStorage if exists
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price){
    // Check if product already in cart
    const index = cart.findIndex(item => item.name === name);
    if(index >= 0){
        cart[index].price += price; // increase price if duplicate
    } else {
        cart.push({name, price});
    }
    saveCart();
    renderCart();
}

function renderCart(){
    const cartItems = document.getElementById('cart-items');
    if(!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item,index)=>{
        total += item.price;
        cartItems.innerHTML += `<li>${item.name} - ₹${item.price} 
            <button class="remove" onclick="removeItem(${index})">Remove</button>
        </li>`;
    });
    document.getElementById('total').innerText = total;

    // Update Place Order page submit button dynamically if exists
    const submitBtn = document.getElementById('submitOrderBtn');
    if(submitBtn) submitBtn.disabled = cart.length === 0;

    // Update textarea if exists (order.html)
    const orderDetails = document.getElementById('order_details');
    if(orderDetails){
        if(cart.length > 0){
            orderDetails.value = cart.map(i=>`${i.name} - ₹${i.price}`).join("\n");
        } else {
            orderDetails.value = "Your cart is empty.";
        }
    }
}

function removeItem(index){
    cart.splice(index,1);
    saveCart();
    renderCart();
}

// ------------------ Submit Order ------------------
const orderForm = document.getElementById('orderForm');
if(orderForm){
    orderForm.addEventListener('submit', function(event){
        if(cart.length===0){
            event.preventDefault();
            alert("Cart is empty!");
            return;
        }

        const orderDetailsText = cart.map(i=>`${i.name} - ₹${i.price}`).join("\n") +
                         `\nTotal: ₹${cart.reduce((sum,i)=>sum+i.price,0)}`;

        const orderDetails = document.getElementById('order_details');
        if(orderDetails) orderDetails.value = orderDetailsText;

        // Optional: Clear cart after form submission
        setTimeout(()=>{
            cart = [];
            saveCart();
            renderCart();
            alert("Order submitted! You will receive confirmation email.");
        },100);
    });
}

// ------------------ Admin Side (localStorage orders) ------------------
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
document.addEventListener("DOMContentLoaded", renderCart);
