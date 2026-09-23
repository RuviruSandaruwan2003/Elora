/* ==========================================================================
   ELORA — product catalogue
   Each product now uses one real photo instead of generated cartoon art.
   Replace the "image" path below with your own product photo file.
   Recommended photo size: square, at least 800x800px, saved inside an
   "images" folder next to this file (e.g. images/trolley.jpg).
   ========================================================================== */

const ELORA_PRODUCTS = [
  { id:'trolley',   name:'Elora Classic Trolley',  category:'Luggage', price:42000, image:'images/trolley.jpg' },
  { id:'cabin',     name:'Elora Cabin Luggage',    category:'Luggage', price:34000, image:'images/cabin.jpg' },
  { id:'backpack',  name:'Elora Travel Backpack',  category:'Luggage', price:18900, image:'images/backpack.jpg' },
  { id:'duffel',    name:'Elora Travel Duffel',    category:'Luggage', price:38500, image:'images/duffel.jpg' },
  { id:'weekender', name:'Elora Weekender Bag',    category:'Luggage', price:24500, image:'images/weekender.jpg' },
  { id:'loafer',    name:'Elora Leather Loafer',   category:'Shoes',   price:26500, image:'images/loafer.jpg',  sizes:[6,7,8,9,10] },
  { id:'sneaker',   name:'Elora Casual Sneakers',  category:'Shoes',   price:22000, image:'images/sneaker.jpg', sizes:[6,7,8,9,10] },
  { id:'oxford',    name:'Elora Formal Oxford',    category:'Shoes',   price:28000, image:'images/oxford.jpg',  sizes:[6,7,8,9,10] },
];

function eloraFormatPrice(n){
  return 'LKR ' + n.toLocaleString('en-LK');
}

function eloraFindProduct(id){
  return ELORA_PRODUCTS.find(p => p.id === id);
}
