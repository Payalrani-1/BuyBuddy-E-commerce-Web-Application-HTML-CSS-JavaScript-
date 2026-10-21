/* index.js - home page: show products, search, add to cart */

const grid = document.querySelector('.products-grid');
const searchTerm = (new URLSearchParams(location.search).get('search') || '').trim().toLowerCase();

// Keep products whose name or keywords contain every word typed
function matches(product) {
  const text = (product.name + ' ' + product.keywords.join(' ')).toLowerCase();
  return searchTerm.split(/\s+/).every(word => text.includes(word));
}

function renderProducts() {
  const list = searchTerm ? products.filter(matches) : products;

  if (searchTerm) {
    const note = document.createElement('div');
    note.className = 'search-note';
    note.textContent = list.length
      ? list.length + ' result(s) for "' + searchTerm + '"'
      : 'No products found for "' + searchTerm + '". ';
    if (!list.length) {
      const back = document.createElement('a');
      back.href = 'index.html';
      back.textContent = 'Show all products';
      note.appendChild(back);
    }
    grid.parentNode.insertBefore(note, grid);
  }

  let html = '';
  list.forEach(p => {
    html += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${p.image}" alt="">
        </div>
        <div class="product-name limit-text-to-2-lines"></div>
        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${Math.round(p.rating.stars * 10)}.png">
          <div class="product-rating-count link-primary">${p.rating.count}</div>
        </div>
        <div class="product-price">${formatMoney(p.priceCents)}</div>
        <div class="product-quantity-container">
          <select class="quantity-select">
            <option selected value="1">1</option><option value="2">2</option>
            <option value="3">3</option><option value="4">4</option>
            <option value="5">5</option><option value="6">6</option>
            <option value="7">7</option><option value="8">8</option>
            <option value="9">9</option><option value="10">10</option>
          </select>
        </div>
        <div class="product-spacer"></div>
        <div class="added-to-cart"><img src="images/icons/checkmark.png"> Added</div>
        <button class="add-to-cart-button button-primary" data-product-id="${p.id}">Add to Cart</button>
      </div>`;
  });
  grid.innerHTML = html;

  // set names with textContent (safe way to insert text)
  grid.querySelectorAll('.product-container').forEach((box, i) => {
    box.querySelector('.product-name').textContent = list[i].name;
  });
}

grid.addEventListener('click', e => {
  const button = e.target.closest('.add-to-cart-button');
  if (!button) return;

  const box = button.closest('.product-container');
  const quantity = Number(box.querySelector('.quantity-select').value);
  addToCart(button.dataset.productId, quantity);
  document.querySelector('.cart-quantity').textContent = cartCount();

  // show "Added" for 1.5 seconds
  const msg = box.querySelector('.added-to-cart');
  msg.style.opacity = 1;
  clearTimeout(msg.timer);
  msg.timer = setTimeout(() => { msg.style.opacity = 0; }, 1500);
});

initHeader();
renderProducts();
