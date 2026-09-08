/* ==========================================================================
   ELORA — shared front-end behaviour
   Cart persists in localStorage so it follows the shopper across pages.
   ========================================================================== */

const ELORA_CART_KEY = 'elora_cart_v1';

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
function cartAdd(productId, color, size, qty){
  qty = qty || 1;
  const items = cartLoad();
  const existing = items.find(i => i.id === productId && i.color === color && i.size === size);
  if(existing){ existing.qty += qty; }
  else{ items.push({ id: productId, color, size: size || null, qty }); }
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
        <div class="thumb">${eloraArt(p.art, item.color)}</div>
        <div class="info">
          <h4>${p.name}</h4>
          <div class="meta">${ELORA_COLORS[item.color] ? ELORA_COLORS[item.color].name : ''}${item.size ? ' · UK ' + item.size : ''}</div>
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
      <button type="button" class="btn btn-primary btn-block js-checkout">Checkout</button>
      <button type="button" class="btn btn-ghost btn-block js-clear-cart" style="margin-top:10px;">Empty bag</button>
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

  const checkoutBtn = document.querySelector('.js-checkout');
  if(checkoutBtn) checkoutBtn.addEventListener('click', () => {
    showToast('This is a demo store — checkout isn\u2019t connected to payments yet.');
  });
  const clearBtn = document.querySelector('.js-clear-cart');
  if(clearBtn) clearBtn.addEventListener('click', () => { cartSave([]); renderCartDrawer(); });
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
  const defaultColor = p.colors[0];
  return `
    <div class="product-card" data-id="${p.id}" data-color="${defaultColor}">
      <div class="product-media js-media">${eloraArt(p.art, defaultColor)}</div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price">${eloraFormatPrice(p.price)}</div>
        <div class="swatches js-swatches">
          ${p.colors.map((c,i) => `<span class="swatch ${i===0?'active':''}" data-color="${c}" style="background:${ELORA_COLORS[c].hex}" title="${ELORA_COLORS[c].name}"></span>`).join('')}
        </div>
        <button type="button" class="btn btn-primary js-add-cart">Add to Cart</button>
      </div>
    </div>`;
}

function wireProductGrid(root){
  root.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        const color = sw.dataset.color;
        card.dataset.color = color;
        card.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', s === sw));
        const p = eloraFindProduct(id);
        card.querySelector('.js-media').innerHTML = eloraArt(p.art, color);
      });
    });
    card.querySelector('.js-add-cart').addEventListener('click', () => {
      const p = eloraFindProduct(id);
      const color = card.dataset.color;
      cartAdd(id, color, null, 1);
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
