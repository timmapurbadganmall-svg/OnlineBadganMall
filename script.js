let cart = JSON.parse(localStorage.getItem('cart') || '[]');
cart = cart.map(item => ({...item, qty: item.qty ? Number(item.qty) : 1}));

function addToCart(name, price, photo, qty) {
    qty = Number(qty) || 1;
    const existing = cart.find(i => i.name === name);
    if(existing) existing.qty += qty;
    else cart.push({name, price: Number(price), photo, qty});
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function getTotalAmount() {
    return cart.reduce((sum,i)=> sum + (i.price*i.qty),0);
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if(!cartItems) return;
    cartItems.innerHTML = '';
    let totalAmount = 0;

    cart.forEach((item,index)=>{
        totalAmount += item.price*item.qty;
        cartItems.innerHTML += `<li>
            <img src="${item.photo}" style="width:50px;height:50px;">
            ${item.name} x ${item.qty} - ₹${item.price*item.qty}
            <button onclick="removeItem(${index})">Remove</button>
        </li>`;
    });

    document.getElementById('cart-total')?.innerText = totalAmount;
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});
