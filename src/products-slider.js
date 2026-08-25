// ==========================================
// PRODUCTS SLIDER
// ==========================================

const productsGrid =
  document.querySelector(
    ".products-grid"
  );


const productCards =
  Array.from(
    productsGrid.querySelectorAll(
      ".product-card"
    )
  );


const previousButton =
  document.querySelector(
    "#productsPrev"
  );


const nextButton =
  document.querySelector(
    "#productsNext"
  );


const productDots =
  document.querySelector(
    "#productDots"
  );


let activeProduct = 0;


// ==========================================
// CREATE DOTS
// ==========================================

productCards.forEach(
  (_, index) => {

    const dot =
      document.createElement(
        "button"
      );


    dot.className =
      "product-dot";


    dot.type =
      "button";


    dot.addEventListener(
      "click",
      () => {

        activeProduct =
          index;


        moveToProduct();
      }
    );


    productDots.appendChild(
      dot
    );
  }
);


const dots =
  productDots.querySelectorAll(
    ".product-dot"
  );


// ==========================================
// MOVE TO PRODUCT
// ==========================================

function moveToProduct() {

  const selectedCard =
    productCards[
      activeProduct
    ];


  const position =
    selectedCard.offsetLeft -
    productsGrid.offsetLeft;


  productsGrid.scrollTo({
    left: position,
    behavior: "smooth"
  });


  updateDots();
}


// ==========================================
// UPDATE DOTS
// ==========================================

function updateDots() {

  dots.forEach(
    (dot, index) => {

      dot.classList.toggle(
        "active",
        index === activeProduct
      );
    }
  );
}


// ==========================================
// NEXT PRODUCT
// ==========================================

nextButton.addEventListener(
  "click",
  () => {

    activeProduct += 1;


    if (
      activeProduct >=
      productCards.length
    ) {

      activeProduct = 0;
    }


    moveToProduct();
  }
);


// ==========================================
// PREVIOUS PRODUCT
// ==========================================

previousButton.addEventListener(
  "click",
  () => {

    activeProduct -= 1;


    if (
      activeProduct < 0
    ) {

      activeProduct =
        productCards.length - 1;
    }


    moveToProduct();
  }
);


// ==========================================
// MANUAL SWIPE
// ==========================================

productsGrid.addEventListener(
  "scroll",
  () => {

    const gap =
      parseFloat(
        getComputedStyle(
          productsGrid
        ).gap
      ) || 0;


    const cardWidth =
      productCards[0].offsetWidth +
      gap;


    activeProduct =
      Math.round(
        productsGrid.scrollLeft /
        cardWidth
      );


    activeProduct =
      Math.max(
        0,
        Math.min(
          activeProduct,
          productCards.length - 1
        )
      );


    updateDots();
  }
);


updateDots();