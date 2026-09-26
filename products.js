/* ==========================================================================
   ELORA — product catalogue
   Each product photo must sit in the SAME folder as shop.html, named
   exactly as given in the "image" field below.

   - Shoes use "sizes": an array of UK sizes — same price for every size.
   - Luggage uses "sizeOptions": each size/weight has its OWN price, shown
     as selectable pills on the product card (7–10kg / 15–20kg / 23–30kg).
   ========================================================================== */

const ELORA_PRODUCTS = [
  {
    id:'trolley', name:'Elora Classic Trolley', category:'Luggage',
    price:10000, image:'T1.jpeg',
    sizeOptions:[
      { label:'7–10 kg',  price:10000 },
      { label:'15–20 kg', price:15000 },
      { label:'23–30 kg', price:20000 }
    ]
  },
  {
    id:'cabin', name:'Elora Cabin Luggage', category:'Luggage',
    price:10000, image:'T2.jpeg',
    sizeOptions:[
      { label:'7–10 kg',  price:10000 },
      { label:'15–20 kg', price:15000 },
      { label:'23–30 kg', price:20000 }
    ]
  },
  { id:'loafer',        name:'Chunky Shoes - Clean White', category:'Shoes', price:6990, image:'S1.jpeg', sizes:[36,37,38,39,40] },
  { id:'sneaker',       name:'Chunky Shoes - Soft Pink',   category:'Shoes', price:6990, image:'S2.jpeg', sizes:[36,37,38,39,40] },
  { id:'oxford-green',  name:'Air Shoes - Green',          category:'Shoes', price:4500, image:'S3.jpeg', sizes:[42,43,44] },
  { id:'oxford-black',  name:'Air Shoes - Black',          category:'Shoes', price:4500, image:'S4.jpeg', sizes:[42,43,44] },
  { id:'oxford-orange', name:'Air Shoes - Orange',         category:'Shoes', price:4500, image:'S5.jpeg', sizes:[42,43,44] },
  { id:'office-black',  name:'Office Wear - Black',        category:'Shoes', price:8000, image:'S6.jpeg', sizes:[42,43,44] },
];

function eloraFormatPrice(n){
  return 'LKR ' + n.toLocaleString('en-LK');
}

function eloraFindProduct(id){
  return ELORA_PRODUCTS.find(p => p.id === id);
}
