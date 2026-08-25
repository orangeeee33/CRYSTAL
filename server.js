import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());




// ==========================================
// SEND CONTACT MESSAGE
// ==========================================

app.post(
  "/send-contact",
  async (request, response) => {

    try {

      const {
        name,
        email,
        phone,
        subject,
        message
      } = request.body;


      // CHECK REQUIRED INFORMATION

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {

        return response
          .status(400)
          .json({
            success: false,
            message:
              "Please complete all required fields."
          });

      }


      // SUBJECT NAMES

      const subjectNames = {
        question: "General Question",
        complaint: "Complaint",
        suggestion: "Suggestion",
        collaboration: "Collaboration",
        other: "Other"
      };


      const selectedSubject =
        subjectNames[subject] ||
        subject;


      // EMAIL CONNECTION

      const transporter =
        nodemailer.createTransport({

          service: "gmail",

          auth: {
            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASSWORD
          }

        });


      // SEND EMAIL

      await transporter.sendMail({

        from:
          `"CRYSTAL Contact" <${process.env.EMAIL_USER}>`,

        to:
          process.env.ORDER_EMAIL,

        replyTo:
          email,

        subject:
          `CRYSTAL ${selectedSubject} — ${name}`,

        html: `
          <h2>
            New CRYSTAL Contact Message
          </h2>

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone || "Not provided"}
          </p>

          <p>
            <strong>Subject:</strong>
            ${selectedSubject}
          </p>

          <h3>Message</h3>

          <p>
            ${message}
          </p>
        `

      });


      response.json({
        success: true,
        message:
          "Message sent successfully."
      });

    } catch (error) {

      console.error(
        "Contact error:",
        error
      );


      response
        .status(500)
        .json({
          success: false,
          message:
            "Could not send the message."
        });

    }

  }
);

// ==========================================
// SEND ORDER
// ==========================================

app.post("/send-order", async (request, response) => {

  try {

    const {
      customer,
      cart,
      total,
      paymentMethod,
      transactionNumber
    } = request.body;


    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !cart?.length
    ) {
      return response.status(400).json({
        success: false,
        message: "Missing order information."
      });
    }


    const productsHtml = cart.map((item) => {

      const itemTotal =
        Number(item.price) *
        Number(item.quantity);

      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${Number(item.price).toFixed(2)}</td>
          <td>$${itemTotal.toFixed(2)}</td>
        </tr>
      `;

    }).join("");


    const paymentName =
      paymentMethod === "cash"
        ? "Cash on Delivery"
        : "Whish Money";


    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }

      });


    await transporter.sendMail({

      from:
        `"CRYSTAL Orders" <${process.env.EMAIL_USER}>`,

      to:
        process.env.ORDER_EMAIL,

      subject:
        `New CRYSTAL Order — ${customer.name}`,

      html: `
        <h2>New CRYSTAL Order</h2>

        <h3>Customer</h3>

        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Address:</strong> ${customer.address}</p>

        <h3>Payment</h3>

        <p>
          <strong>Method:</strong>
          ${paymentName}
        </p>

        ${
          paymentMethod === "whish"
            ? `
              <p>
                <strong>Transaction number:</strong>
                ${transactionNumber || "Not provided"}
              </p>
            `
            : ""
        }

        <h3>Products</h3>

        <table
          border="1"
          cellpadding="10"
          cellspacing="0"
        >
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>

          ${productsHtml}
        </table>

        <h2>
          Total: $${Number(total).toFixed(2)}
        </h2>
      `

    });


    response.json({
      success: true,
      message: "Order sent successfully."
    });

  } catch (error) {

    console.error(error);

    response.status(500).json({
      success: false,
      message: "Could not send the order."
    });

  }

});


// ==========================================
// START SERVER
// ==========================================

app.listen(3000, () => {

  console.log(
    "Order server running on http://localhost:3000"
  );

});