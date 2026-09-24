/* ==========================================================================
   ELORA — product catalogue
   Each product uses one real photo (1.png–8.png, one per product).
   ========================================================================== */

const ELORA_PRODUCTS = [
  { id:'trolley',   name:'Elora Classic Trolley',  category:'Luggage', price:42000, image:'1.png' },
  { id:'cabin',     name:'Elora Cabin Luggage',    category:'Luggage', price:34000, image:'2.png' },
  { id:'backpack',  name:'Elora Travel Backpack',  category:'Luggage', price:18900, image:'3.png' },
  { id:'duffel',    name:'Elora Travel Duffel',    category:'Luggage', price:38500, image:'4.png' },
  { id:'weekender', name:'Elora Weekender Bag',    category:'Luggage', price:24500, image:'5.png' },
  { id:'loafer',    name:'Elora Leather Loafer',   category:'Shoes',   price:26500, image:'6.png', sizes:[6,7,8,9,10] },
  { id:'sneaker',   name:'Elora Casual Sneakers',  category:'Shoes',   price:22000, image:'7.png', sizes:[6,7,8,9,10] },
  { id:'oxford',    name:'Elora Formal Oxford',    category:'Shoes',   price:28000, image:'8.png', sizes:[6,7,8,9,10] },
];

function eloraFormatPrice(n){
  return 'LKR ' + n.toLocaleString('en-LK');
}

function eloraFindProduct(id){
  return ELORA_PRODUCTS.find(p => p.id === id);
}
