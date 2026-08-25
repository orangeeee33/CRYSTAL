// ==========================================
// CART ELEMENTS
// ==========================================

const cartButton =
  document.querySelector("#cartButton");

const closeCartButton =
  document.querySelector("#closeCart");

const cartPanel =
  document.querySelector("#cartPanel");

const cartOverlay =
  document.querySelector("#cartOverlay");

const cartItemsContainer =
  document.querySelector("#cartItems");

const cartCount =
  document.querySelector("#cartCount");

const cartTotal =
  document.querySelector("#cartTotal");

const addToCartButtons =
  document.querySelectorAll(".add-to-cart");


// ==========================================
// LOAD CART
// ==========================================

function loadCart() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "crystalCart"
      )
    ) || [];

  } catch (error) {

    localStorage.removeItem(
      "crystalCart"
    );

    return [];
  }
}


let cart =
  loadCart();


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

  localStorage.setItem(
    "crystalCart",
    JSON.stringify(cart)
  );
}


// ==========================================
// OPEN AND CLOSE CART
// ==========================================

function openCart() {

  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
}


function closeCart() {

  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}


cartButton.addEventListener(
  "click",
  openCart
);


closeCartButton.addEventListener(
  "click",
  closeCart
);


cartOverlay.addEventListener(
  "click",
  closeCart
);


// ==========================================
// ADD PRODUCT
// ==========================================

addToCartButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const product = {
          id: button.dataset.id,
          name: button.dataset.name,
          price: Number(
            button.dataset.price
          ),
          image: button.dataset.image,
          quantity: 1
        };


        const existingProduct =
          cart.find(
            (item) =>
              item.id === product.id
          );


        if (existingProduct) {

          existingProduct.quantity += 1;

        } else {

          cart.push(product);
        }


        saveCart();
        renderCart();
        openCart();
      }
    );
  }
);


// ==========================================
// CHANGE QUANTITY OR REMOVE
// ==========================================

cartItemsContainer.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest("button");


    if (!button) {
      return;
    }


    const productId =
      button.dataset.id;


    const product =
      cart.find(
        (item) =>
          item.id === productId
      );


    if (
      button.classList.contains(
        "increase-item"
      )
    ) {

      product.quantity += 1;
    }


    if (
      button.classList.contains(
        "decrease-item"
      )
    ) {

      product.quantity -= 1;


      if (product.quantity <= 0) {

        cart = cart.filter(
          (item) =>
            item.id !== productId
        );
      }
    }


    if (
      button.classList.contains(
        "remove-item"
      )
    ) {

      cart = cart.filter(
        (item) =>
          item.id !== productId
      );
    }


    saveCart();
    renderCart();
  }
);


// ==========================================
// DISPLAY CART
// ==========================================

function renderCart() {

  if (cart.length === 0) {

    cartItemsContainer.innerHTML = `
      <p class="empty-cart">
        Your cart is empty.
      </p>
    `;

  } else {

    cartItemsContainer.innerHTML =
      cart.map(
        (item) => {

          const itemTotal =
            item.price *
            item.quantity;


          return `
            <div class="cart-item">

              <img
                src="${item.image}"
                alt="${item.name}"
              >


              <div>

                <h3>
                  ${item.name}
                </h3>

                <p class="cart-item-price">
                  $${itemTotal.toFixed(2)}
                </p>


                <div class="cart-quantity">

                  <button
                    class="decrease-item"
                    data-id="${item.id}"
                    type="button"
                  >
                    −
                  </button>


                  <span>
                    ${item.quantity}
                  </span>


                  <button
                    class="increase-item"
                    data-id="${item.id}"
                    type="button"
                  >
                    +
                  </button>

                </div>

              </div>


              <button
                class="remove-item"
                data-id="${item.id}"
                type="button"
                aria-label="Remove product"
              >
                ×
              </button>

            </div>
          `;
        }
      ).join("");
  }


  const totalQuantity =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );


  cartCount.textContent =
    totalQuantity;


  cartTotal.textContent =
    `$${totalPrice.toFixed(2)}`;
}


// ==========================================
// FIRST DISPLAY
// ==========================================

renderCart();