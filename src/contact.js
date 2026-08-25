// ==========================================
// CONTACT FORM
// ==========================================

const contactForm =
  document.querySelector(
    "#contactForm"
  );


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      // ======================================
      // GET FORM VALUES
      // ======================================

      const name =
        document
          .querySelector("#contactName")
          .value
          .trim();


      const email =
        document
          .querySelector("#contactEmail")
          .value
          .trim();


      const phone =
        document
          .querySelector("#contactPhone")
          .value
          .trim();


      const subject =
        document
          .querySelector("#contactSubject")
          .value;


      const message =
        document
          .querySelector("#contactMessage")
          .value
          .trim();


      const submitButton =
        contactForm.querySelector(
          ".contact-submit"
        );


      // ======================================
      // VALIDATION
      // ======================================

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {

        alert(
          "Please complete all required fields."
        );

        return;
      }


      // ======================================
      // CONTACT DATA
      // ======================================

      const contactData = {
        name,
        email,
        phone,
        subject,
        message
      };


      // ======================================
      // SEND MESSAGE
      // ======================================

      try {

        submitButton.disabled = true;

        submitButton.textContent =
          "SENDING...";


        const response = await fetch(
          "http://localhost:3000/send-contact",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(
              contactData
            )
          }
        );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message ||
            "Could not send your message."
          );
        }


        alert(
          "Your message was sent successfully!"
        );


        contactForm.reset();

      } catch (error) {

        console.error(
          "Contact error:",
          error
        );


        alert(
          error.message ||
          "Something went wrong. Please try again."
        );

      } finally {

        submitButton.disabled = false;

        submitButton.textContent =
          "SEND MESSAGE";

      }

    }
  );

}