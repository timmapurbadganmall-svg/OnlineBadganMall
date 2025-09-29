// Customer Side
let cart = [];

function addToCart(name, price){
    cart.push({name, price});
    renderCart();
}

function renderCart(){
    const cartItems = document.getElementById('cart-items');
    if(!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item,index)=>{
        total += item.price;
        cartItems.innerHTML += `<li>${item.name} - ₹${item.price} <button class="remove" onclick="removeItem(${index})">Remove</button></li>`;
    });
    document.getElementById('total').innerText = total;
}

function removeItem(index){
    cart.splice(index,1);
    renderCart();
}

// Submit Order and send email via Formspree
document.getElementById('orderForm').addEventListener('submit', function(event){
    if(cart.length===0){
        event.preventDefault();
        alert("Cart is empty!");
        return;
    }

    const orderDetails = cart.map(i=>`${i.name} - ₹${i.price}`).join("\n") +
                         `\nTotal: ₹${cart.reduce((sum,i)=>sum+i.price,0)}`;

    document.getElementById('order_details').value = orderDetails;

    // Clear cart after short delay to ensure form submits
    setTimeout(()=>{
        cart = [];
        renderCart();
        alert("Order submitted! You will receive confirmation email.");
    }, 100);
});

// Admin Side (localStorage orders)
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
