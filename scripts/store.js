/* ==========================================================
   store.js  -  cart + orders logic, saved in localStorage.
   Loaded on every page (after data/products.js).
   ========================================================== */

const CART_KEY = 'buddy-cart';
const ORDERS_KEY = 'buddy-orders';

/* ---------- small helpers ---------- */

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { /* storage blocked - ignore */ }
}

function formatMoney(cents) {
  return '$' + (cents / 100).toFixed(2);
}

function getProduct(id) {
  return products.find(p => p.id === id);
}

/* ---------- CART ----------
   cart = [ { productId: '...', quantity: 2 }, ... ] */

let cart = readStorage(CART_KEY).filter(item => getProduct(item.productId));

function saveCart() {
  writeStorage(CART_KEY, cart);
}

function addToCart(productId, quantity) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += quantity;       // already in cart -> increase
  } else {
    cart.push({ productId, quantity });
  }
  saveCart();
}

// returns true if the new quantity was valid (whole number 1-99)
function updateQuantity(productId, quantity) {
  quantity = Number(quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return false;
  const item = cart.find(i => i.productId === productId);
  if (!item) return false;
  item.quantity = quantity;
  saveCart();
  return true;
}

function deleteFromCart(productId) {
  cart = cart.filter(i => i.productId !== productId);
  saveCart();
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + getProduct(i.productId).priceCents * i.quantity, 0);
}

/* ---------- ORDERS ----------
   order = { id, date, totalCents, items: [ { productId, quantity } ] } */

function getOrders() {
  return readStorage(ORDERS_KEY);
}

function placeOrder() {
  if (cart.length === 0) return null;

  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    totalCents: cartTotal(),
    items: cart.map(i => ({ productId: i.productId, quantity: i.quantity }))
  };

  const orders = getOrders();
  orders.unshift(order);               // newest order first
  writeStorage(ORDERS_KEY, orders);

  cart = [];                           // empty the cart
  saveCart();
  return order;
}

/* ---------- header (cart badge + search box) ---------- */

function initHeader() {
  const badge = document.querySelector('.cart-quantity');
  if (badge) badge.textContent = cartCount();

  const input = document.querySelector('.search-bar');
  const button = document.querySelector('.search-button');
  if (!input || !button) return;

  const params = new URLSearchParams(location.search);
  if (document.body.dataset.page === 'home') input.value = params.get('search') || '';

  function search() {
    const term = input.value.trim();
    location.href = 'index.html' + (term ? '?search=' + encodeURIComponent(term) : '');
  }
  button.addEventListener('click', search);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
}
