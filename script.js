// ------------------ Customer Side ------------------

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to Cart
function addToCart(name, price, photo, qty){
    qty = parseInt(qty) || 1;
    const index = cart.findIndex(item => item.name === name);
    if(index >= 0){
        cart[index].qty += qty;
    } else {
        cart.push({name, price, photo, qty});
    }
    saveCart();
    alert(`${name} added to cart!`);
    renderCart(); // optional: updates order.html if open
}

// Render Cart (order.html)
function renderCart(){
    const cartItems = document.getElementById('cart-items');
    if(!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item,index)=>{
        total += item.price * item.qty;
        cartItems.innerHTML += `<tr>
            <td><img src="${item.photo}" alt="${item.name}"></td>
            <td>${item.name} x ${item.qty}</td>
            <td>₹${item.price * item.qty}</td>
            <td><button class="remove" onclick="removeItem(${index})">Remove</button></td>
        </tr>`;
    });
    document.getElementById('total').innerText = total;

    const orderDetails = document.getElementById('order_details');
    if(orderDetails){
        if(cart.length > 0){
            orderDetails.value = cart.map(i=>`${i.name} x ${i.qty} - ₹${i.price * i.qty}`).join("\n") +
                                 `\nTotal: ₹${total}`;
        } else {
            orderDetails.value = "Your cart is empty.";
        }
    }

    const submitBtn = document.getElementById('submitOrderBtn');
    if(submitBtn) submitBtn.disabled = cart.length === 0;
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

        const total = cart.reduce((sum,i)=>sum + i.price * i.qty,0);
        const orderDetailsText = cart.map(i=>`${i.name} x ${i.qty} - ₹${i.price * i.qty}`).join("\n") +
                                 `\nTotal: ₹${total}`;

        const orderDetails = document.getElementById('order_details');
        if(orderDetails) orderDetails.value = orderDetailsText;

        // Clear cart after submission
        setTimeout(()=>{
            cart = [];
            saveCart();
            renderCart();
            alert("Order submitted! You will receive confirmation email.");
        },100);
    });
}

// ------------------ Initialize ------------------
document.addEventListener("DOMContentLoaded", renderCart);
