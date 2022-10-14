var count = 0

if (document.readyState == 'loading'){
  document.addEventListener("DOMContentLoaded", ready);
  }
 else if (document.readyState == 'complete'){
   ready()
}

function ready(){ 
  var removeCartItemButtons = document.getElementsByClassName('btn-danger')
  for(var i=0; i < removeCartItemButtons.length; i++){
    var button = removeCartItemButtons[i]
    button.addEventListener('click',removeCartItem)
  }
  var quantityInputs = document.getElementsByClassName('cart-quantity-input')
  for(var i=0; i < removeCartItemButtons.length; i++){
  var input = quantityInputs[i]
  input.addEventListener('change',quantityChanged) 
  }
  var addToCartButtons = document.getElementsByClassName('cart')
  for(var i=0; i < addToCartButtons.length; i++){
    var button = addToCartButtons[i]
    button.addEventListener('click', addToCartClicked)
  }
  var buttonPurchase = document.getElementsByClassName('btn-purchase')[0]
  if (buttonPurchase != undefined){
    buttonPurchase.addEventListener('click', purchaseClicked)
  }
  if (count < 1){
    restoreCart()
    count++
  } 
}

function restoreCart() {
  var existingCartValues = JSON.parse(localStorage.getItem("CART_VALUES"))
  if (existingCartValues != null){
    existingCartValues.forEach((element, index) => {
      addItemToCart(index, element.title, element.price, element.imageSrc)
    });
  }
}
 
function purchaseClicked(){
  var existingCartValues = JSON.parse(localStorage.getItem("CART_VALUES"));
  if (existingCartValues == null || existingCartValues.length == 0){
    alert('Sorry. Your cart is empty!')
  }
  else {
    var cartItems = document.getElementsByClassName("cart-items")[0];
  if (cartItems.hasChildNodes()){
    while(cartItems.hasChildNodes()){
      cartItems.removeChild(cartItems.firstChild)
    }
    localStorage.removeItem("CART_VALUES")
      updateCartTotal()
      alert('Thank you for shopping with us!')
  }
}
  
}
function subscribed(){
  alert('Thank you for subscribing');
}
function validate(){
    alert("Thank You. We'll get back to you shortly!");
  }


function removeCartItem(event){
  var buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  var id = buttonClicked.id
  var index = id.split("_")[1]
  var existingCartValues = JSON.parse(localStorage.getItem("CART_VALUES"))
  if (existingCartValues != null){
    existingCartValues.splice(index, 1)
    localStorage.setItem("CART_VALUES", JSON.stringify(existingCartValues))
  }
  updateCartTotal()
}
function quantityChanged(event){
  var input = event.target
  if (isNaN(input.value) || input.value <= 0){
  input.value = 1
  }
  updateCartTotal()
}

function addToCartClicked(event){
  var button = event.target;
  var shopItem = button.parentElement.parentElement.parentElement;
  var title = shopItem.getElementsByClassName('pro-title')[0].innerText;
  var price = shopItem.getElementsByClassName('mprice')[0].innerText;
  var imageSrc = shopItem.getElementsByClassName('zimage')[0].src;

  var existingCartValues = JSON.parse(localStorage.getItem("CART_VALUES"))
  var cartValues = {
    "title": title,
    "price": price,
    "imageSrc": imageSrc
  }

  if (existingCartValues == null){
    existingCartValues = []
  }

  if (existingCartValues.some(e => e.title === cartValues.title)) {
    alert("This item is already added to the cart")
  }
  else  {
    var index = saveToLocalStorage(cartValues, existingCartValues)
    addItemToCart(index, title, price, imageSrc);
  }
}

function saveToLocalStorage(cartValues, existingCartValues){
  var cartValuesArray = [
    cartValues
  ]
  existingCartValues.push.apply(existingCartValues, cartValuesArray)
  localStorage.setItem("CART_VALUES", JSON.stringify(existingCartValues))
  return existingCartValues.length - 1;
}

  /*let cart = JSON.parse(localStorage.getItem('CART'));
  updateCartTotal();*/

  function addItemToCart(index, title, price, imageSrc){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
  
    if (cartItems != undefined){
      var cartRowContents = `
    <div class="cart-item cart column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
  <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger remove" id="remove_${index}" type="button">REMOVE</button>
    </div>`
    

  

    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged)
    
    updateCartTotal();
    }
    
    
  }
function updateCartTotal(){
  var cartItemContainer = document.getElementsByClassName('cart-items')[0]
  var cartRows = cartItemContainer.getElementsByClassName('cart-row')
  var total = 0;
  for(var i=0; i < cartRows.length; i++){
    var cartRow = cartRows[i]
    var priceElement = cartRow.getElementsByClassName('cart-price')[0]
    var quatityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]

    var price = parseFloat(priceElement.innerText.replace('Ksh',''))
    var quantity = quatityElement.value
    total = total + (price * quantity)
  }
  total = Math.round(total * 100)/100
  document.getElementsByClassName('cart-total-price')[0].innerText = 'Ksh ' + total

  /*localStorage.setItem('CART', JSON.stringify(cart));*/
}