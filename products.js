/* ==========================================================================
   ELORA — product catalogue
   Each product uses one real photo (1.png–8.png, one per product).
   These files must sit in the SAME folder as shop.html, named exactly
   1.png, 2.png, 3.png ... 8.png (lowercase, correct extension).
   ========================================================================== */

const ELORA_PRODUCTS = [
  { id:'trolley',   name:'Elora Classic Trolley',  category:'Luggage', price:42000, image:'1.png' },
  { id:'cabin',     name:'Elora Cabin Luggage',    category:'Luggage', price:34000, image:'2.png' },
  { id:'backpack',  name:'Elora Travel Backpack',  category:'Luggage', price:18900, image:'3.png' },
  { id:'duffel',    name:'Elora Travel Duffel',    category:'Luggage', price:38500, image:'4.png' },
  { id:'weekender', name:'Elora Weekender Bag',    category:'Luggage', price:24500, image:'5.png' },
  { id:'loafer',    name:'Clean White',   category:'Shoes',   price:6990, image:'S1.jpeg', sizes:[36,37,38,39,40] },
  { id:'sneaker',   name:'Soft Pink',  category:'Shoes',   price:6990, image:'S2.png', sizes:[36,37,38,39,40] },
  { id:'oxford',    name:'Elora Formal Oxford',    category:'Shoes',   price:28000, image:'8.png', sizes:[6,7,8,9,10] },
];

function eloraFormatPrice(n){
  return 'LKR ' + n.toLocaleString('en-LK');
}

function eloraFindProduct(id){
  return ELORA_PRODUCTS.find(p => p.id === id);
}
