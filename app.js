/* ==========================================================================
   ELORA — shared front-end behaviour
   Cart persists in localStorage so it follows the shopper across pages.
   Checkout sends the full order straight to WhatsApp instead of a form.
   Product variants (shoe sizes / luggage weight+price options) are
   selected on the product card before adding to the bag.
   ========================================================================== */

const ELORA_CART_KEY = 'elora_cart_v3'; // bumped: cart items now store their own price per size
const ELORA_WHATSAPP_NUMBER = '94743647717'; // 074 364 7717 in international format
const ELORA_CONTACT_EMAIL = 'eloraonlineshop5@gmail.com';
const ELORA_IMG_FALLBACK = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f4efe6'/%3E%3Ctext x='100' y='104' font-family='sans-serif' font-size='13' fill='%23a08a6a' text-anchor='middle'%3EImage missing%3C/text%3E%3C/svg%3E";

/* ---------------------------- price helpers ---------------------------- */
function eloraLowestPrice(p){
  if(p.sizeOptions && p.sizeOptions.length) return Math.min(...p.sizeOptions.map(s => s.price));
  return p.price;
}

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
function cartAdd(productId, size, price, qty){
  qty = qty || 1;
  const items = cartLoad();
  const existing = items.find(i => i.id === productId && i.size === size);
  if(existing){ existing.qty += qty; }
  else{ items.push({ id: productId, size: size || null, price: price, qty }); }
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
function cartClear(){
  cartSave([]);
  renderCartDrawer();
}
function cartCount(){
  return cartLoad().reduce((sum, i) => sum + i.qty, 0);
}
function cartLineTotal(item){
  const p = eloraFindProduct(item.id);
  const unit = (typeof item.price === 'number') ? item.price : (p ? eloraLowestPrice(p) : 0);
  return unit * item.qty;
}
function cartTotal(){
  return cartLoad().reduce((sum, i) => sum + cartLineTotal(i), 0);
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
    const unit = (typeof i.price === 'number') ? i.price : eloraLowestPrice(p);
    const sizeStr = i.size ? (typeof i.size === 'number' ? ` (UK ${i.size})` : ` (${i.size})`) : '';
    return `• ${p.name}${sizeStr} x${i.qty} — ${eloraFormatPrice(unit * i.qty)}`;
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
function openWhatsAppMessage(text){
  const message = `Hello Elora, ${text}`;
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
    const unit = (typeof item.price === 'number') ? item.price : eloraLowestPrice(p);
    const lineTotal = unit * item.qty;
    const sizeLabel = item.size ? (typeof item.size === 'number' ? 'UK ' + item.size : item.size) : '';
    return `
      <div class="cart-item" data-idx="${idx}">
        <div class="thumb"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='${ELORA_IMG_FALLBACK}';"></div>
        <div class="info">
          <h4>${p.name}</h4>
          <div class="meta">${sizeLabel}</div>
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
      <button type="button" class="btn btn-outline btn-block js-clear-cart" style="margin-top:10px;">Empty Bag</button>
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

  const clearBtn = document.querySelector('.js-clear-cart');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to empty your bag?')) {
      cartClear();
    }
  });
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
  let sizeHtml = '';

  if(p.sizeOptions && p.sizeOptions.length){
    sizeHtml = `
      <div class="size-label">Select size</div>
      <div class="size-options js-size-options">
        ${p.sizeOptions.map((s, i) => `
          <button type="button" class="size-pill ${i===0?'active':''}" data-size="${s.label}" data-price="${s.price}">
            ${s.label}<span class="size-pill-price">${eloraFormatPrice(s.price)}</span>
          </button>`).join('')}
      </div>`;
  } else if(p.sizes && p.sizes.length){
    sizeHtml = `
      <div class="size-label">Select size (UK)</div>
      <div class="size-options js-size-options">
        ${p.sizes.map((s, i) => `
          <button type="button" class="size-pill size-pill-sm ${i===0?'active':''}" data-size="${s}" data-price="${p.price}">${s}</button>`).join('')}
      </div>`;
  }

  const priceDisplay = p.sizeOptions ? `From ${eloraFormatPrice(eloraLowestPrice(p))}` : eloraFormatPrice(p.price);

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-media"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${ELORA_IMG_FALLBACK}';"></div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price js-product-price">${priceDisplay}</div>
        ${sizeHtml}
        <button type="button" class="btn btn-primary js-add-cart">Add to Cart</button>
      </div>
    </div>`;
}

function wireProductGrid(root){
  root.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    const p = eloraFindProduct(id);
    const options = card.querySelector('.js-size-options');
    const priceEl = card.querySelector('.js-product-price');

    if(options){
      options.querySelectorAll('.size-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          options.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if(p.sizeOptions && priceEl){
            priceEl.textContent = eloraFormatPrice(Number(btn.dataset.price));
          }
        });
      });
    }

    card.querySelector('.js-add-cart').addEventListener('click', () => {
      let size = null, price = eloraLowestPrice(p);
      const activePill = options ? options.querySelector('.size-pill.active') : null;
      if(activePill){
        size = p.sizeOptions ? activePill.dataset.size : Number(activePill.dataset.size);
        price = Number(activePill.dataset.price);
      }
      cartAdd(id, size, price, 1);
      const sizeNote = size ? ` (${typeof size === 'number' ? 'UK ' + size : size})` : '';
      showToast(`${p.name}${sizeNote} added to your bag`);
      openCart();
    });
  });
}

/* ---------------------------- email us modal ---------------------------- */
function buildEmailModal(){
  if(document.querySelector('.js-email-modal-overlay')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="modal-overlay js-email-modal-overlay"></div>
    <div class="modal-box js-email-modal">
      <div class="modal-head">
        <h3>Email Us</h3>
        <button type="button" class="close-btn js-email-modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <p style="color:var(--ink-soft); font-size:.9rem; margin-top:0;">Write your question or comment below — it opens in your email app, addressed to ${ELORA_CONTACT_EMAIL}.</p>
        <div class="field">
          <label for="emailModalSubject">Subject</label>
          <input type="text" id="emailModalSubject" placeholder="e.g. Order enquiry">
        </div>
        <div class="field">
          <label for="emailModalMessage">Message</label>
          <textarea id="emailModalMessage" placeholder="Type your message here…" style="min-height:130px;"></textarea>
        </div>
        <button type="button" class="btn btn-primary btn-block js-email-modal-send">Send Email →</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);

  document.querySelector('.js-email-modal-close').addEventListener('click', closeEmailModal);
  document.querySelector('.js-email-modal-overlay').addEventListener('click', closeEmailModal);
  document.querySelector('.js-email-modal-send').addEventListener('click', () => {
    const subject = document.getElementById('emailModalSubject').value.trim() || 'Message from Elora website';
    const message = document.getElementById('emailModalMessage').value.trim();
    if(!message){
      showToast('Please type a message first.');
      return;
    }
    window.location.href = `mailto:${ELORA_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    closeEmailModal();
    showToast('Opening your email app…');
  });
}
function openEmailModal(){
  buildEmailModal();
  document.querySelector('.js-email-modal-overlay')?.classList.add('open');
  document.querySelector('.js-email-modal')?.classList.add('open');
}
function closeEmailModal(){
  document.querySelector('.js-email-modal-overlay')?.classList.remove('open');
  document.querySelector('.js-email-modal')?.classList.remove('open');
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

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ closeCart(); closeEmailModal(); }
  });

  document.querySelectorAll('.js-email-us').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openEmailModal();
    });
  });

  const waBtn = document.querySelector('.js-contact-whatsapp');
  if(waBtn){
    waBtn.addEventListener('click', () => {
      const textarea = document.getElementById('waMessage');
      const msg = document.querySelector('.js-contact-msg');
      const text = textarea ? textarea.value.trim() : '';
      if(!text){
        if(msg){ msg.textContent = 'Please type your comment or question first.'; msg.className = 'form-msg show err'; }
        return;
      }
      openWhatsAppMessage(text);
      if(msg){ msg.textContent = 'Opening WhatsApp with your message…'; msg.className = 'form-msg show ok'; }
      showToast('Opening WhatsApp…');
      if(textarea) textarea.value = '';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderCartCount();
});
