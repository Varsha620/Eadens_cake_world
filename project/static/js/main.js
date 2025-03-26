// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(cakeId, name, price) {
    cart.push({ id: cakeId, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Added to cart!');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Custom cake form handling
const customCakeForm = document.getElementById('customize-form');
if (customCakeForm) {
    customCakeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(customCakeForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (result.status === 'success') {
                showNotification('Order placed successfully!');
                customCakeForm.reset();
            }
        } catch (error) {
            showNotification('Error placing order. Please try again.');
        }
    });
}

// File upload preview
const photoInput = document.getElementById('reference-photo');
const photoPreview = document.getElementById('photo-preview');

if (photoInput && photoPreview) {
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Cart page functionality
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `₹${total.toFixed(2)}`;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>₹${item.price}</span>
            <button onclick="removeFromCart(${index})" class="btn-remove">Remove</button>
        </div>
    `).join('');
    
    updateCartTotal();
}

// Initialize cart page if we're on it
if (window.location.pathname === '/cart') {
    renderCart();
}

// Date and time validation
const deliveryDateInput = document.getElementById('delivery-date');
if (deliveryDateInput) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2); // Minimum 2 days advance booking
    
    deliveryDateInput.min = minDate.toISOString().split('T')[0];
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30); // Maximum 30 days advance booking
    deliveryDateInput.max = maxDate.toISOString().split('T')[0];
}
