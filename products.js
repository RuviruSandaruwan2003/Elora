/* ==========================================================================
   ELORA — product catalogue + generated illustrations
   No external image files: every product image is an SVG drawn on the fly
   in the colour the shopper selects, so swapping the swatch swaps the art.
   ========================================================================== */

const ELORA_COLORS = {
  tan:    { name: 'Tan',    hex: '#C9A27E', shade: '#A9754A' },
  brown:  { name: 'Brown',  hex: '#7C4E2E', shade: '#4A2E1C' },
  black:  { name: 'Black',  hex: '#2B2420', shade: '#12100D' },
  gray:   { name: 'Grey',   hex: '#9A958C', shade: '#6E6a62' },
  olive:  { name: 'Olive',  hex: '#6E7A5B', shade: '#4B5540' },
  white:  { name: 'White',  hex: '#F1EBDF', shade: '#CBBFA9' },
};

/* ---- SVG illustrations (flat, brand-toned, generated per colour) ---- */
const ELORA_ART = {
trolley(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="30" width="90" height="130" rx="14" fill="${s.hex}"/>
      <rect x="55" y="30" width="90" height="130" rx="14" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <line x1="80" y1="30" x2="80" y2="160" stroke="${s.shade}" stroke-width="2" opacity=".6"/>
      <line x1="120" y1="30" x2="120" y2="160" stroke="${s.shade}" stroke-width="2" opacity=".6"/>
      <rect x="88" y="16" width="24" height="16" rx="4" fill="none" stroke="${s.shade}" stroke-width="4"/>
      <rect x="70" y="70" width="60" height="10" rx="5" fill="${s.shade}" opacity=".8"/>
      <circle cx="72" cy="168" r="8" fill="${s.shade}"/>
      <circle cx="128" cy="168" r="8" fill="${s.shade}"/><img src="1.jpeg">
    </svg>`;
  },
  cabin(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="80" height="120" rx="16" fill="${s.hex}"/>
      <rect x="60" y="40" width="80" height="120" rx="16" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <rect x="94" y="26" width="12" height="18" rx="4" fill="none" stroke="${s.shade}" stroke-width="4"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke="${s.shade}" stroke-width="3" opacity=".7"/>
      <path d="M100 84 v32 M84 100 h32" stroke="${s.shade}" stroke-width="3" opacity=".7"/>
      <circle cx="76" cy="166" r="7" fill="${s.shade}"/>
      <circle cx="124" cy="166" r="7" fill="${s.shade}"/>
    </svg>`;
  },
  backpack(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 70 Q65 35 100 35 Q135 35 135 70 V150 Q135 165 120 165 H80 Q65 165 65 150 Z" fill="${s.hex}"/>
      <path d="M65 70 Q65 35 100 35 Q135 35 135 70 V150 Q135 165 120 165 H80 Q65 165 65 150 Z" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <path d="M78 70 Q100 55 122 70" stroke="${s.shade}" stroke-width="3" fill="none" opacity=".8"/>
      <rect x="86" y="90" width="28" height="36" rx="6" fill="${s.shade}" opacity=".55"/>
      <path d="M74 60 Q70 100 76 150" stroke="${s.shade}" stroke-width="6" fill="none" opacity=".5"/>
      <path d="M126 60 Q130 100 124 150" stroke="${s.shade}" stroke-width="6" fill="none" opacity=".5"/>
    </svg>`;
  },
  duffel(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="90" width="120" height="70" rx="26" fill="${s.hex}"/>
      <rect x="40" y="90" width="120" height="70" rx="26" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <path d="M70 90 V72 Q70 60 82 60 H118 Q130 60 130 72 V90" fill="none" stroke="${s.shade}" stroke-width="6"/>
      <path d="M75 95 L60 60 M125 95 L140 60" stroke="${s.shade}" stroke-width="4" opacity=".6"/>
      <circle cx="100" cy="122" r="4" fill="${s.shade}"/>
      <rect x="85" y="112" width="30" height="6" rx="3" fill="${s.shade}" opacity=".6"/>
    </svg>`;
  },
  weekender(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="95" width="130" height="62" rx="14" fill="${s.hex}"/>
      <rect x="35" y="95" width="130" height="62" rx="14" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <path d="M65 95 V78 Q65 66 78 66 H122 Q135 66 135 78 V95" fill="none" stroke="${s.shade}" stroke-width="6"/>
      <path d="M72 100 L55 68 M128 100 L145 68" stroke="${s.shade}" stroke-width="4" opacity=".6"/>
      <rect x="88" y="115" width="24" height="22" rx="4" fill="${s.shade}" opacity=".6"/>
    </svg>`;
  },
  loafer(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 145 Q35 120 60 112 Q90 102 110 88 Q124 78 140 82 Q160 88 162 112 Q164 132 150 140 Q120 152 70 152 Q42 152 35 145 Z" fill="${s.hex}"/>
      <path d="M35 145 Q35 120 60 112 Q90 102 110 88 Q124 78 140 82 Q160 88 162 112 Q164 132 150 140 Q120 152 70 152 Q42 152 35 145 Z" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <path d="M78 112 Q95 100 112 92" stroke="${s.shade}" stroke-width="3" fill="none" opacity=".7"/>
      <rect x="86" y="104" width="18" height="10" rx="3" fill="${s.shade}" opacity=".85"/>
      <path d="M35 145 Q90 158 150 140" stroke="${s.shade}" stroke-width="4" fill="none" opacity=".5"/>
    </svg>`;
  },
  sneaker(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 148 Q32 128 55 118 L100 96 Q116 88 132 94 L150 101 Q166 106 168 122 Q170 138 156 144 Q120 156 70 156 Q40 156 32 148 Z" fill="${s.hex}"/>
      <path d="M32 148 Q32 128 55 118 L100 96 Q116 88 132 94 L150 101 Q166 106 168 122 Q170 138 156 144 Q120 156 70 156 Q40 156 32 148 Z" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <path d="M60 118 L78 106 M74 122 L92 110 M88 126 L106 114" stroke="${s.shade}" stroke-width="3" opacity=".7"/>
      <path d="M32 148 Q90 162 168 122" stroke="${s.shade}" stroke-width="5" fill="none" opacity=".55"/>
    </svg>`;
  },
  oxford(c){
    const s = ELORA_COLORS[c];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M34 146 Q34 122 58 114 Q86 106 104 90 Q116 80 132 84 L152 90 Q166 96 166 116 Q166 134 152 141 Q118 152 66 152 Q40 152 34 146 Z" fill="${s.hex}"/>
      <path d="M34 146 Q34 122 58 114 Q86 106 104 90 Q116 80 132 84 L152 90 Q166 96 166 116 Q166 134 152 141 Q118 152 66 152 Q40 152 34 146 Z" fill="none" stroke="${s.shade}" stroke-width="3"/>
      <path d="M80 108 L64 100 M92 100 L78 91" stroke="${s.shade}" stroke-width="3" opacity=".8"/>
      <circle cx="70" cy="103" r="2.4" fill="${s.shade}"/>
      <circle cx="82" cy="95" r="2.4" fill="${s.shade}"/>
      <path d="M34 146 Q90 160 166 116" stroke="${s.shade}" stroke-width="5" fill="none" opacity=".5"/>
    </svg>`;
  }
};

/* ---- catalogue ---- */
const ELORA_PRODUCTS = [
  { id:'trolley',   name:'Elora Classic Trolley',   category:'Luggage', price:42000, art:'trolley',   colors:['tan','gray','black'] },
  { id:'cabin',     name:'Elora Cabin Luggage',     category:'Luggage', price:34000, art:'cabin',     colors:['olive','tan','gray'] },
  { id:'backpack',  name:'Elora Travel Backpack',   category:'Luggage', price:18900, art:'backpack',  colors:['black','brown','gray'] },
  { id:'duffel',    name:'Elora Travel Duffel',     category:'Luggage', price:38500, art:'duffel',    colors:['brown','tan','black'] },
  { id:'weekender', name:'Elora Weekender Bag',     category:'Luggage', price:24500, art:'weekender', colors:['brown','tan','black'] },
  { id:'loafer',    name:'Elora Leather Loafer',    category:'Shoes',   price:26500, art:'loafer',    colors:['brown','black','tan'], sizes:[6,7,8,9,10] },
  { id:'sneaker',   name:'Elora Casual Sneakers',   category:'Shoes',   price:22000, art:'sneaker',   colors:['white','gray','black'], sizes:[6,7,8,9,10] },
  { id:'oxford',    name:'Elora Formal Oxford',     category:'Shoes',   price:28000, art:'oxford',    colors:['black','brown','gray'], sizes:[6,7,8,9,10] },
];

function eloraArt(artKey, colorKey){
  const fn = ELORA_ART[artKey] || ELORA_ART.trolley;
  return fn(ELORA_COLORS[colorKey] ? colorKey : 'tan');
}

function eloraFormatPrice(n){
  return 'LKR ' + n.toLocaleString('en-LK');
}

function eloraFindProduct(id){
  return ELORA_PRODUCTS.find(p => p.id === id);
}
