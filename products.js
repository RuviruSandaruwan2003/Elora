/* ==========================================================================
   ELORA — product catalogue
   Each product uses one real photo (1.png–8.png, one per product).
   These files must sit in the SAME folder as shop.html, named exactly
   1.png, 2.png, 3.png ... 8.png (lowercase, correct extension).
   ========================================================================== */

const ELORA_PRODUCTS = [
  { id:'trolley',   name:'Elora Classic Trolley',  category:'Luggage', price:42000, image:'T1.jpeg' },
  { id:'cabin',     name:'Elora Cabin Luggage',    category:'Luggage', price:34000, image:'T2.jpeg' },

   
  { id:'loafer',    name:'Chunky Shoes - Clean White',   category:'Shoes',   price:6990, image:'S1.jpeg', sizes:[36,37,38,39,40] },
  { id:'sneaker',   name:'Chunky Shoes - Soft Pink',  category:'Shoes',   price:6990, image:'S2.jpeg', sizes:[36,37,38,39,40] },
  { id:'oxford',    name:'Air shoes - Green',    category:'Shoes',   price:4500, image:'S3.jpeg', sizes:[42,43,44] },
   { id:'oxford',    name:'Air shoes - Black',    category:'Shoes',   price:4500, image:'S4.jpeg', sizes:[42,43,44] },
     { id:'oxford',    name:'Air shoes - Orange',    category:'Shoes',   price:4500, image:'S5.jpeg', sizes:[42,43,44] },
    { id:'oxford',    name:'Office wear -Black',    category:'Shoes',   price:8000, image:'S6.jpeg', sizes:[42,43,44] },
];

function eloraFormatPrice(n){
  return 'LKR ' + n.toLocaleString('en-LK');
}

function eloraFindProduct(id){
  return ELORA_PRODUCTS.find(p => p.id === id);
}
