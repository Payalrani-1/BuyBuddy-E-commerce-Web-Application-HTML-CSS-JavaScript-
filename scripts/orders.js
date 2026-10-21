/* orders.js - order history + confirmation message */

const ordersGrid = document.querySelector('.orders-grid');
const placedId = new URLSearchParams(location.search).get('placed');

function renderOrders() {
  const orders = getOrders();

  // confirmation message right after placing an order
  const justPlaced = orders.find(o => o.id === placedId);
  if (justPlaced) {
    const banner = document.createElement('div');
    banner.className = 'order-confirmation';
    banner.innerHTML = `
      <div class="order-confirmation-title">&#10003; Order placed successfully!</div>
      <div>Order ID: <strong>${justPlaced.id}</strong> &middot; Total: <strong>${formatMoney(justPlaced.totalCents)}</strong></div>`;
    ordersGrid.parentNode.insertBefore(banner, ordersGrid);
  }

  if (orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="empty-message">
        <p>You have no orders yet.</p>
        <a class="button-primary link-button" href="index.html">Start shopping</a>
      </div>`;
    return;
  }

  ordersGrid.innerHTML = orders.map(order => {
    const rows = order.items.map(item => {
      const p = getProduct(item.productId);
      if (!p) return '';
      return `
        <div class="product-image-container"><img src="${p.image}" alt=""></div>
        <div class="product-details">
          <div class="product-name" data-id="${p.id}"></div>
          <div class="product-quantity">Quantity: ${item.quantity}</div>
          <div class="product-quantity">Price: ${formatMoney(p.priceCents)}</div>
        </div>`;
    }).join('');

    return `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date"><div class="order-header-label">Order Placed:</div><div>${order.date}</div></div>
            <div class="order-total"><div class="order-header-label">Total:</div><div>${formatMoney(order.totalCents)}</div></div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div><div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">${rows}</div>
      </div>`;
  }).join('');

  ordersGrid.querySelectorAll('.product-name').forEach(el => {
    el.textContent = getProduct(el.dataset.id).name;
  });
}

initHeader();
renderOrders();
