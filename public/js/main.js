function sendHttpRequest(method, url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.onload = function () {
            resolve(xhr.response);
        }
        xhr.send();
    });
    return promise;
}


function removeProduct(productId) {
    // const test = productId;
    debugger;
    sendHttpRequest('GET', `/admin/removeProduct/${productId}`).then(responseData => {
        console.log(responseData);
        const productElement = document.getElementById(productId);
        productElement.remove();
        const alert = new Alert(AlertType.Success, 'Moving operation is not fully done, please try again!');
        alert.show();
    });
}
function addToCart(productId) {
    sendHttpRequest('GET', `/addToCart/${productId}`).then(responseData => {
        if (responseData.success) {
            debugger;
            const alert = new Alert(AlertType.Success, 'this product has been added to your cart!');
            alert.show();
            const cartBoxElement = document.getElementById('cart__box');
            cartBoxElement.innerText = parseInt(responseData.quantity);
        }
        console.log(responseData);
    });
}
function decreaseQty(productId) {
    sendHttpRequest('GET', `/decreaseQty/${productId}`).then(responseData => {
        if (responseData.success) {
            // const el = this.target.closest('.decrement__qty__btn');
            // const alert = new Alert(AlertType.Success, 'this product has been added to your cart!');
            // alert.show();
            // const cartBoxElement = document.getElementById('cart__box');
            // cartBoxElement.innerText = responseData.quantity;
            // document.get
            const decrementQtyBtn = document.getElementById(`decrement_qty__btn_${responseData.cartItemId}`);
            const row = decrementQtyBtn.closest('tr');
            // const cartBoxElement = document.getElementById('cart__box');
            // cartBoxElement.innerText = responseData.quantity
            if (responseData.quantity === 0) {
                row.remove();
            }
            else {
                row.querySelector('.productPriceInQty_data').textContent = formatMoney(responseData.newPriceInQty);
                row.querySelector('.qty_data').textContent = parseInt(responseData.quantity);

                // decrementQtyBtn.parentElement.getElementsByClassName('qty_data')[0].innerText = responseData.quantity;
            }
            document.getElementById('totalPrice__cart').innerText = formatMoney(responseData.totalPrice);
            const cartBoxElement = document.getElementById('cart__box');
            cartBoxElement.innerText = parseInt(responseData.cartQuantity);
            new DialogMessage().dettach();
        }
        console.log(responseData);
    });
}

const removeProductButtons = document.getElementsByClassName('removeProduct__Btn');
for (const el of removeProductButtons) {
    const productId = el.getAttribute('data-val');
    el.addEventListener('click', removeProduct.bind(null, productId));
}

const addToCartButtons = document.getElementsByClassName('addToCart__Btn');
for (const el of addToCartButtons) {
    const productId = el.getAttribute('data-val');
    el.addEventListener('click', addToCart.bind(null, productId));
}

const decrementQtyButtons = document.getElementsByClassName('decrement__qty__btn');
for (const el of decrementQtyButtons) {
    // el.addEventListener('click', showDialogMessage.bind(this,el));
    el.onclick = function (e) {
        e.preventDefault();
        console.log(el.id);
        const cartItemId = el.getAttribute('data-val');
        const dgMessage = new DialogMessage(el.id, 'Are you sure, you want to decrease the quantity of this product?', decreaseQty.bind(this, cartItemId), 'dialog__message');
        dgMessage.attach();
        return;
    };
}

function showDialogMessage(el) {
    console.log(el.id);
    const cartItemId = el.getAttribute('data-val');
    const dgMessage = new DialogMessage(el.id, 'Are you sure, you want to decrease the quantity of this product?', decreaseQty.bind(this, cartItemId), 'dialog__message');
    dgMessage.attach();
}



function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};