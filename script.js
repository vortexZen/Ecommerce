
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');

  // Toggle Drawer
  document.getElementById('cart-toggle').addEventListener('click', () => {
    cartDrawer.style.transform = 'translateX(0)';
    renderCart();
  });

  document.getElementById('cart-close').addEventListener('click', () => {
    cartDrawer.style.transform = 'translateX(100%)';
  });

  // Add to Cart
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const quantity = parseInt(btn.previousElementSibling.value);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ name, price, quantity });
      }

      saveCart();
      updateCartCount();
      renderCart();
    });
  });

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Update cart badge count
  function updateCartCount() {
    $('#cart-count').addClass('pulse');
    setTimeout(() => $('#cart-count').removeClass('pulse'), 300);

    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  }

  // Render cart drawer content
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-muted">Your cart is empty.</p>';   
      $('#cart-total').text('0.00');
      return;
    }
    
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'd-flex justify-content-between align-items-center mb-2';
      itemEl.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="form-control form-control-sm qty-input" style="width: 60px;">
        </div>
        <div>
          $${(item.price * item.quantity).toFixed(2)}<br>
          <button class="btn btn-sm btn-danger remove-item" data-index="${index}">✖</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    saveCart();
    updateCartCount();

    // Quantity change handler
    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const i = e.target.dataset.index;
        cart[i].quantity = parseInt(e.target.value);
        renderCart();
      });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.index;
        cart.splice(i, 1);
        renderCart();
      });
    });
  }

  // Initialize on load
  renderCart();
  updateCartCount();

$('#checkout-btn').click(function () {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  if (confirm('Proceed to checkout?')) {
    cart = [];
    saveCart();
    renderCart();
    alert('Thank you for your purchase!');
  }
});
