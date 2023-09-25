let products = [
    {
        'id': 1,
        'title': '哈利波特: 神秘的魔法石',
        'price': 250,
        'thumbnail': 'assets/images/harryPotter-1.webp'
    },
    {
        'id': 2,
        'title': '哈利波特: 消失的密室',
        'price': 280,
        'thumbnail': 'assets/images/harryPotter-2.webp'
    },
    {
        'id': 3,
        'title': '哈利波特: 阿茲卡班的逃犯',
        'price': 299,
        'thumbnail': 'assets/images/harryPotter-3.webp'
    }
];
let shop = {
    'allProducts': [],
    'addToCartButtons': [], // 由於此按鈕現在是被 js 加到 HTML 中的, 稍後在 getElements() 中再選擇

    'cartToggle': document.getElementById("cart-toggle"), // 選擇 #cart-toggle, 即展開/關閉購物車的 button
    'productsContainer': document.getElementById("products-container"), // 選擇 #products-container, 即裝有商品的 div
    'addedProductsContainer': document.getElementById("added-products-container"), // 選擇 #added-products-container, 即裝有購物車中商品的 div
    'cartAmount': document.getElementById("cart-amount"), // 選擇 #cart-amount, 即裝有購物車中商品數量的 span
    'cartSubtotal': document.getElementById("cart-subtotal"), // 選擇 #cart-subtotal, 即裝有購物車中商品總價的 span

    'checkoutButton': document.getElementById('checkout-button'), // 先不用選, 最後送出購物車中商品的按鈕, // 先不用選, 最後送出購物車中商品的按鈕
    'cookieName': 'cartItems',
    'urls': {
        'getProducts': 'https://cart-handler.weihaowang.work/api/products',
        'submit': 'https://cart-handler.weihaowang.work/api/cartHandler'
    },
    'cart': {
        'items': [],  // 加入購物車的商品的 id
        'subtotal': 0, // 加入購物車的商品的總價
        'amount': 0    // 加入購物車的商品的數量
    },
    'init': function (productsInCookie) {
        this.fetchProducts();
        this.renderElements();
        this.getElements();
        this.addListeners();
        if (productsInCookie) {
            // 如果有存在 cookie 的商品 id...
            /* 
                8.
                productsInCookie 為已經入購物車的商品 id 的陣列, 
                我們可以用 for 迴圈來檢視此陣列中的每個值, 
                現在要呼叫 shop 的哪個方法來把有這些 id 的商品加入購物車?
            */
            for (let i = 0; i < productsInCookie.length; i++) {
                // productsInCookie[i];
                this.updateCart(productsInCookie[i]);
            }
        }

    },
    'renderElements': function () {
        /*
            1.
        */
        for (let i = 0; i < this.allProducts.length; i++) {
            let p = this.allProducts[i];
            this.productsContainer.innerHTML += `<div class="product" id="product-` + (i + 1) + `">
            <div class="product-thumbnail-wrapper"><img class="product-thumbnail" src="` + p.thumbnail + `"></div>
            <div class="product-name">` + p.title + `</div>
            <div class="product-price-wrapper"><span class="product-price">`+ p.price + `</span> 元</div>
            <button class="add-to-cart-button" productId = "`+ p.id + `">加入購物車</button>
        </div>`

        }
    },
    'getElements': function () {
        this.addToCartButtons = document.getElementsByClassName('add-to-cart-button');
    },
    'addListeners': function () {
        /* 2 >>> */
        for (let i = 0; i < this.addToCartButtons.length; i++) {
            this.addToCartButtons[i].addEventListener('click', function () {
                let productId = this.addToCartButtons[i].getAttribute('productId');
                this.updateCart(productId);
            }.bind(this));
        }
        /* <<< 2  */
        /* 3 >>> */
        this.cartToggle.addEventListener('click', function () {
            document.body.classList.toggle('viewing-cart');
        });
        /* <<< 3  */

        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', function () {
                this.submit();
            }.bind(this));
        }
    },
    'updateCart': function (p_id) {
        console.log("updateCart(" + p_id + ")");

        for (let i = 0; i < this.allProducts.length; i++) {


            if (this.allProducts[i].id == p_id) {
                let p = this.allProducts[i];
                /* 
                    4.1
                    如果 p_id 等於 this.allProducts[i] 的 id
                    更新 this.cart.items, this.cart.subtotal, this.cart.amount
                */

                this.cart.items.push(p_id);
                this.cart.subtotal += p.price;
                this.cart.amount += 1;

                /* 
                    4.2
                    呼叫 this.updateCartUI(), 並將商品名稱跟價格傳進去
                */

                this.updateCartUI(p.title, p.price);

                /* 
                   6.
                   更新 cookie 
                   用 setCookie() 將 this.cart.items 存在 cookie 中
                   由於 cookie 的值只能是字串, 我們這裡會使用 JSON.stringify(this.cart.items) 來將陣列準換成文字且保留其格式
                   cookie 名稱儲存在 this.cookieName
                */
                // JSON.stringify(this.cart.items) ;
                setCookie(this.cookieName, JSON.stringify(this.cart.items));



            }
        }

        console.log(this.cart);
    },
    'updateCartUI': function (p_name, p_price) {
        // 更新購物車的 UI
        /*
            5.1
        */
        this.addedProductsContainer.innerHTML += `<div class="added-product">
            <span class="added-product-title">` + p_name + `</span>
            <span class="added-product-price">` + p_price + `</span>
        </div>`
        /*
            5.2
        */
        this.cartAmount.innerHTML = this.cart.amount;
        this.cartSubtotal.innerHTML = this.cart.subtotal;
    },
    'fetchProducts': function () {
        // 從資料庫請求商品資料
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState === 4 && request.status === 200) {
                this.allProducts = JSON.parse(request.responseText);
            }
        }.bind(this));
        request.open('GET', this.urls.getProducts, false);
        request.send();
    },
    'submit': function () {
        // 向資料庫傳送購物車資料
        console.log('submit');
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState === 4 && request.status === 200) {
                console.log(request.responseText);
                eraseCookie(this.cookieName); // 成功送出後記得清除 cookie
            }
        }.bind(this));
        request.open('POST', this.urls.submit, true);
        request.setRequestHeader('Content-type', 'application/json');
        let data = {
            'token': '581001ab4c2ab7916d19f29c8485a195244b5fd1aa955190e5b93977909690b8',
            'items': this.cart.items,
            'subtotal': this.cart.subtotal,
        }
        data = JSON.stringify(data);
        request.send(data);
    },
}
