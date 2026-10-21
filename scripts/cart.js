/* cart.js - cart page: update quantity, delete, place order */

const itemsEl = document.querySelector('.order-summary');
const summaryEl = document.querySelector('.payment-summary');
const placeBtn = document.querySelector('.place-order-button');

function renderCart() {
  const count = cartCount();
  document.querySelector('.return-to-home-link').textContent = count + (count === 1 ? ' item' : ' items');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-message">
        <p>Your cart is empty.</p>
        <a class="button-primary link-button" href="index.html">Continue shopping</a>
      </div>`;
    placeBtn.disabled = true;
  } else {
    placeBtn.disabled = false;
    itemsEl.innerHTML = cart.map(item => {
      const p = getProduct(item.productId);
      return `
        <div class="cart-item-container" data-product-id="${p.id}">
          <div class="cart-item-details-grid">
            <img class="product-image" src="${p.image}" alt="">
            <div class="cart-item-details">
              <div class="product-name"></div>
              <div class="product-price">${formatMoney(p.priceCents)}</div>
              <div class="product-quantity">
                <span>Quantity: <span class="quantity-label">${item.quantity}</span></span>
                <input class="quantity-input" type="number" min="1" max="99" value="${item.quantity}">
                <span class="update-quantity-link link-primary">Update</span>
                <span class="delete-quantity-link link-primary">Delete</span>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    itemsEl.querySelectorAll('.cart-item-container').forEach(box => {
      box.querySelector('.product-name').textContent = getProduct(box.dataset.productId).name;
    });
  }

  summaryEl.querySelector('.payment-summary-rows').innerHTML = `
    <div class="payment-summary-row"><div>Items (${count}):</div><div class="payment-summary-money">${formatMoney(cartTotal())}</div></div>
    <div class="payment-summary-row total-row"><div>Order total:</div><div class="payment-summary-money">${formatMoney(cartTotal())}</div></div>`;
}

// Save the typed quantity (called by "Save" click or Enter key)
function saveQuantity(box) {
  const input = box.querySelector('.quantity-input');
  if (updateQuantity(box.dataset.productId, input.value)) {
    renderCart();
  } else {
    alert('Please enter a whole number between 1 and 99.');
  }
}

itemsEl.addEventListener('click', e => {
  const box = e.target.closest('.cart-item-container');
  if (!box) return;

  if (e.target.closest('.delete-quantity-link')) {
    deleteFromCart(box.dataset.productId);
    renderCart();
  }

  const updateLink = e.target.closest('.update-quantity-link');
  if (updateLink) {
    if (updateLink.textContent === 'Update') {
      // switch to edit mode
      box.classList.add('is-editing');
      updateLink.textContent = 'Save';
      box.querySelector('.quantity-input').focus();
    } else {
      saveQuantity(box);
    }
  }
});

itemsEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('quantity-input')) {
    saveQuantity(e.target.closest('.cart-item-container'));
  }
});

placeBtn.addEventListener('click', () => {
  const order = placeOrder();
  if (order) location.href = 'orders.html?placed=' + encodeURIComponent(order.id);
});

renderCart();
