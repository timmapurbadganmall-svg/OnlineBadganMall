let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const deliveryCharge = 10;

function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(name, price, photo, qty){
    qty = parseInt(qty) || 1;
    const index = cart.findIndex(item=>item.name===name);
    if(index >= 0){ cart[index].qty += qty; }
    else { cart.push({name, price, photo, qty}); }
    saveCart(); alert(`${name} added to cart!`);
    renderCart();
}

function renderCart(){
    const cartItems = document.getElementById('cart-items'); if(!cartItems) return;
    cartItems.innerHTML = ''; let totalAmount = 0;
    cart.forEach((item,index)=>{
        totalAmount += item.price * item.qty;
        cartItems.innerHTML += `<tr>
            <td><img src="${item.photo}" alt="${item.name}"></td>
            <td>${item.name} x ${item.qty}</td>
            <td>₹${item.price * item.qty}</td>
            <td><button class="remove" onclick="removeItem(${index})">Remove</button></td>
        </tr>`;
    });

    document.getElementById('total-amount').innerText = `Total Amount: ₹${totalAmount}`;
    document.getElementById('delivery-charge').innerText = `Delivery Charge: ₹${deliveryCharge}`;
    document.getElementById('grand-total').innerText = `Grand Total: ₹${totalAmount + deliveryCharge}`;

    const warning = document.getElementById('min-order-warning');
    const submitBtn = document.getElementById('submitOrderBtn');
    if(totalAmount < 500){ warning.style.display='block'; if(submitBtn) submitBtn.disabled=true; }
    else { warning.style.display='none'; if(submitBtn) submitBtn.disabled=false; }

    const orderDetails = document.getElementById('order_details');
    if(orderDetails){
        if(cart.length>0){
            orderDetails.value = cart.map(i=>`${i.name} x ${i.qty} - ₹${i.price*i.qty}`).join("\n") +
            `\nTotal Amount: ₹${totalAmount}\nDelivery Charge: ₹${deliveryCharge}\nGrand Total: ₹${totalAmount+deliveryCharge}`;
        } else { orderDetails.value="Your cart is empty."; }
    }
}

function removeItem(index){ cart.splice(index,1); saveCart(); renderCart(); }

const orderForm = document.getElementById('orderForm');
if(orderForm){
    orderForm.addEventListener('submit',function(event){
        const totalAmount = cart.reduce((sum,i)=>sum + i.price*i.qty,0);
        if(cart.length===0 || totalAmount<500){ event.preventDefault(); alert("Cart is empty or total amount less than ₹500!"); return; }
        const orderDetailsText = cart.map(i=>`${i.name} x ${i.qty} - ₹${i.price*i.qty}`).join("\n") +
                                 `\nTotal Amount: ₹${totalAmount}\nDelivery Charge: ₹${deliveryCharge}\nGrand Total: ₹${totalAmount+deliveryCharge}`;
        const orderDetails = document.getElementById('order_details');
        if(orderDetails) orderDetails.value = orderDetailsText;
        setTimeout(()=>{ cart=[]; saveCart(); renderCart(); alert("Order submitted! You will receive confirmation email."); },100);
    });
}

// ------------------ Admin Side ------------------
function displayOrders(){
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersUl = document.getElementById('orders'); if(!ordersUl) return;
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

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", renderCart);
