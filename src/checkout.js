// ==========================================
// CHECKOUT ELEMENTS
// ==========================================

const checkoutButton =
  document.querySelector(".checkout-button");

const paymentOverlay =
  document.querySelector("#paymentOverlay");

const paymentModal =
  document.querySelector("#paymentModal");

const closePaymentButton =
  document.querySelector("#closePayment");

const paymentMethods =
  document.querySelectorAll(
    'input[name="paymentMethod"]'
  );

const paymentDetails =
  document.querySelector("#paymentDetails");

const confirmOrderButton =
  document.querySelector("#confirmOrder");

const customerName =
  document.querySelector("#customerName");

const customerPhone =
  document.querySelector("#customerPhone");

const customerAddress =
  document.querySelector("#customerAddress");

const whishFields =
  document.querySelector("#whishFields");

const transactionNumber =
  document.querySelector("#transactionNumber");

function loadStoredCart(){
  try {
    return JSON.parse(
      localStorage.getItem(
        "crystalCart"
      )
    ) || [];
  }catch (error){
    localStorage.removeItem(
      "crystalCart"
    );
    return[];
  }
}
 
// ==========================================
// OPEN PAYMENT MODAL
// ==========================================

function openPaymentModal() {

  const cart = loadStoredCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }


  // إظهار نافذة الدفع أولًا

  paymentOverlay.classList.add("show");
  paymentModal.classList.add("show");


  // إغلاق السلة بعد إظهار الدفع

  const cartPanel =
    document.querySelector("#cartPanel");

  const cartOverlay =
    document.querySelector("#cartOverlay");

  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}

// ==========================================
// CLOSE PAYMENT MODAL
// ==========================================
function closePaymentModal() {

  paymentOverlay.classList.remove("show");
  paymentModal.classList.remove("show");


}


// ==========================================
// OPEN AND CLOSE EVENTS
// ==========================================

checkoutButton.addEventListener(
  "click",
  openPaymentModal
);


closePaymentButton.addEventListener(
  "click",
  closePaymentModal
);


paymentOverlay.addEventListener(
  "click",
  closePaymentModal
);


// ==========================================
// PAYMENT METHOD
// ==========================================

paymentMethods.forEach((method) => {

  method.addEventListener("change", () => {

    confirmOrderButton.disabled = false;


    if (method.value === "cash") {

      whishFields.hidden = true;

      paymentDetails.innerHTML = `
        <strong>Cash on Delivery</strong>

        <p>
          Pay in cash when your order arrives.
        </p>
      `;
    }


    if (method.value === "whish") {

      whishFields.hidden = false;

      paymentDetails.innerHTML = `
        <strong>Whish Money</strong>

        <p>
          Transfer the payment through Whish Money,
          then enter the transaction number.
        </p>
      `;
    }

  });

});


// ==========================================
// SEND ORDER
// ==========================================

confirmOrderButton.addEventListener(
  "click",
  async () => {

    const selectedMethod =
      document.querySelector(
        'input[name="paymentMethod"]:checked'
      );


    if (
      !customerName.value.trim() ||
      !customerPhone.value.trim() ||
      !customerAddress.value.trim()
    ) {

      alert(
        "Please enter your name, phone number and address."
      );

      return;
    }


    if (!selectedMethod) {

      alert("Please select a payment method.");
      return;
    }


    if (
      selectedMethod.value === "whish" &&
      !transactionNumber.value.trim()
    ) {

      alert(
        "Please enter the Whish transaction number."
      );

      return;
    }


    const cart = loadStoredCart();


    if (cart.length === 0) {

      alert("Your cart is empty.");
      return;
    }


    const total =
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
          Number(item.quantity),
        0
      );


    const orderData = {

      customer: {
        name: customerName.value.trim(),
        phone: customerPhone.value.trim(),
        address: customerAddress.value.trim()
      },

      cart,

      total,

      paymentMethod:
        selectedMethod.value,

      transactionNumber:
        selectedMethod.value === "whish"
          ? transactionNumber.value.trim()
          : ""

    };


    try {

      confirmOrderButton.disabled = true;
      confirmOrderButton.textContent =
        "SENDING...";


      const response = await fetch(
        "http://localhost:3000/send-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(orderData)
        }
      );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Could not send the order."
        );
      }


      alert(
        "Your order was sent successfully!"
      );


      localStorage.removeItem(
        "crystalCart"
      );


      closePaymentModal();

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert(
        "The order could not be sent. Make sure the Node server is running."
      );


      confirmOrderButton.disabled = false;
      confirmOrderButton.textContent =
        "CONFIRM ORDER";
    }

  }
);