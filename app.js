/* ==========================================================================
   ELORA — shared front-end behaviour
   Cart persists in localStorage so it follows the shopper across pages.
   Checkout now sends the full order straight to WhatsApp instead of a form.
   ========================================================================== */

const ELORA_CART_KEY = 'elora_cart_v2';
const ELORA_WHATSAPP_NUMBER = '94743647717'; // 074 364 7717 written in international format

/* ---------------------------- cart storage ---------------------------- */
function cartLoad(){
  try{
    const raw = localStorage.getItem(ELORA_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function cartSave(items){
  localStorage.setItem(ELORA_CART_KEY, JSON.stringify(items));
  renderCartCount();
}
function cartAdd(productId, size, qty){
  qty = qty || 1;
  const items = cartLoad();
  const existing = items.find(i => i.id === productId && i.size === size);
  if(existing){ existing.qty += qty; }
  else{ items.push({ id: productId, size: size || null, qty }); }
  cartSave(items);
  renderCartDrawer();
}
function cartRemove(index){
  const items = cartLoad();
  items.splice(index, 1);
  cartSave(items);
  renderCartDrawer();
}
function cartSetQty(index, qty){
  const items = cartLoad();
  if(!items[index]) return;
  items[index].qty = Math.max(1, qty);
  cartSave(items);
  renderCartDrawer();
}
function cartCount(){
  return cartLoad().reduce((sum, i) => sum + i.qty, 0);
}
function cartTotal(){
  return cartLoad().reduce((sum, i) => {
    const p = eloraFindProduct(i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}
function renderCartCount(){
  document.querySelectorAll('.js-cart-count').forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

/* ---------------------------- WhatsApp checkout ---------------------------- */
function buildWhatsAppOrderMessage(){
  const items = cartLoad();
  const lines = items.map(i => {
    const p = eloraFindProduct(i.id);
    if(!p) return '';
    const sizeStr = i.size ? ` (UK ${i.size})` : '';
    return `• ${p.name}${sizeStr} x${i.qty} — ${eloraFormatPrice(p.price * i.qty)}`;
  }).filter(Boolean).join('\n');

  const subtotal = cartTotal();
  const shipping = subtotal >= 15000 || subtotal === 0 ? 0 : 950;
  const total = subtotal + shipping;

  return [
    'Hello Elora! I would like to place this order:',
    '',
    lines,
    '',
    `Subtotal: ${eloraFormatPrice(subtotal)}`,
    `Delivery: ${shipping === 0 ? 'Free' : eloraFormatPrice(shipping)}`,
    `Total: ${eloraFormatPrice(total)}`,
    '',
    'My Name: ',
    'My Delivery Address: ',
    'Contact Number: ',
    '',
    'Please confirm availability and how to proceed. Thank you!'
  ].join('\n');
}
function openWhatsAppOrder(){
  const message = buildWhatsAppOrderMessage();
  const url = `https://wa.me/${ELORA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

/* ---------------------------- cart drawer UI ---------------------------- */
function renderCartDrawer(){
  const itemsWrap = document.querySelector('.js-cart-items');
  const summaryWrap = document.querySelector('.js-cart-summary');
  if(!itemsWrap) return;

  const items = cartLoad();

  if(items.length === 0){
    itemsWrap.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 5h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.4"/><circle cx="17" cy="21" r="1.4"/></svg>
        <p>Your bag is empty.</p>
        <a href="shop.html" class="btn btn-outline btn-sm">Start shopping</a>
      </div>`;
    if(summaryWrap) summaryWrap.innerHTML = '';
    return;
  }

  itemsWrap.innerHTML = items.map((item, idx) => {
    const p = eloraFindProduct(item.id);
    if(!p) return '';
    const lineTotal = p.price * item.qty;
    return `
      <div class="cart-item" data-idx="${idx}">
        <div class="thumb"><img src="${p.image}" alt="${p.name}"></div>
        <div class="info">
          <h4>${p.name}</h4>
          <div class="meta">${item.size ? 'UK ' + item.size : ''}</div>
          <div class="row-actions">
            <div class="qty-control">
              <button type="button" class="js-qty-minus" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button type="button" class="js-qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <span class="item-total">${eloraFormatPrice(lineTotal)}</span>
          </div>
          <button type="button" class="remove-btn js-remove">Remove</button>
        </div>
      </div>`;
  }).join('');

  const subtotal = cartTotal();
  const shipping = subtotal >= 15000 || subtotal === 0 ? 0 : 950;
  const total = subtotal + shipping;

  if(summaryWrap){
    summaryWrap.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${eloraFormatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${shipping === 0 ? 'Free' : eloraFormatPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${eloraFormatPrice(total)}</span></div>
      <button type="button" class="btn btn-primary btn-block js-whatsapp-order">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align:-3px; margin-right:6px;"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z"/></svg>
        Place Order via WhatsApp
      </button>
    `;
  }

  itemsWrap.querySelectorAll('.cart-item').forEach(el => {
    const idx = Number(el.dataset.idx);
    el.querySelector('.js-qty-minus').addEventListener('click', () => {
      const items = cartLoad();
      if(!items[idx]) return;
      if(items[idx].qty - 1 <= 0){ cartRemove(idx); }
      else{ cartSetQty(idx, items[idx].qty - 1); }
    });
    el.querySelector('.js-qty-plus').addEventListener('click', () => {
      const items = cartLoad();
      cartSetQty(idx, items[idx].qty + 1);
    });
    el.querySelector('.js-remove').addEventListener('click', () => cartRemove(idx));
  });

  const whatsappBtn = document.querySelector('.js-whatsapp-order');
  if (whatsappBtn) whatsappBtn.addEventListener('click', openWhatsAppOrder);
}

function openCart(){
  document.querySelector('.js-cart-overlay')?.classList.add('open');
  document.querySelector('.js-cart-drawer')?.classList.add('open');
  renderCartDrawer();
}
function closeCart(){
  document.querySelector('.js-cart-overlay')?.classList.remove('open');
  document.querySelector('.js-cart-drawer')?.classList.remove('open');
}

/* ---------------------------- toast ---------------------------- */
let toastTimer;
function showToast(msg){
  const el = document.querySelector('.js-toast');
  if(!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------------------- product card builder ---------------------------- */
function buildProductCard(p){
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price">${eloraFormatPrice(p.price)}</div>
        <button type="button" class="btn btn-primary js-add-cart">Add to Cart</button>
      </div>
    </div>`;
}

function wireProductGrid(root){
  root.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.js-add-cart').addEventListener('click', () => {
      const p = eloraFindProduct(id);
      cartAdd(id, null, 1);
      showToast(`${p.name} added to your bag`);
      openCart();
    });
  });
}

/* ---------------------------- nav: search flyout + mobile menu ---------------------------- */
function initNav(){
  const searchToggle = document.querySelector('.js-search-toggle');
  const flyout = document.querySelector('.js-search-flyout');
  if(searchToggle && flyout){
    searchToggle.addEventListener('click', () => {
      flyout.classList.toggle('open');
      if(flyout.classList.contains('open')) flyout.querySelector('input')?.focus();
    });
  }
  const searchForm = document.querySelector('.js-search-form');
  if(searchForm){
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchForm.querySelector('input').value.trim();
      window.location.href = 'shop.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    });
  }

  const burger = document.querySelector('.js-burger');
  const navLinks = document.querySelector('.js-nav-links');
  if(burger && navLinks){
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  document.querySelectorAll('.js-cart-open').forEach(btn => btn.addEventListener('click', openCart));
  document.querySelector('.js-cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.js-cart-overlay')?.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeCart(); });

  document.querySelectorAll('.js-newsletter').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if(input && input.value.trim()){
        showToast('Thanks for subscribing! Watch your inbox for new arrivals.');
        form.reset();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderCartCount();
});
