import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [orderAmount, setOrderAmount] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const createPayment = async () => {
    try {
      const orderId = `order_${Date.now()}`; // Generate unique order ID
      console.log("Creating payment with the following details:");
      console.log(`Order ID: ${orderId}`);
      console.log(`Order Amount: ${orderAmount}`);
      console.log(`Customer Email: ${customerEmail}`);
      console.log(`Customer Phone: ${customerPhone}`);

      const response = await axios.post("http://localhost:3333/create-payment", {
        order_id: orderId,
        order_amount: orderAmount,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      });

      console.log("Payment creation response:");
      console.log(response.data);

      setPaymentLink(response.data.payment_link || ""); // Get payment link from backend
    } catch (error) {
      console.error("Payment creation failed. Error details:");
      console.error("Error message:", error.message);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else {
        console.error("No response received from backend.");
      }

      alert("Failed to create payment. Check the console for details.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Cashfree Payment Integration</h2>
      <label>
        Order Amount:
        <input
          type="number"
          value={orderAmount}
          onChange={(e) => setOrderAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </label>
      <br />
      <label>
        Customer Email:
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Enter email"
        />
      </label>
      <br />
      <label>
        Customer Phone:
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </label>
      <br />
      <button onClick={createPayment}>Create Payment</button>
      <br />
      {paymentLink && (
        <div>
          <p>Payment link created successfully!</p>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            Pay Now
          </a>
        </div>
      )}
    </div>
  );
};

export default Payment;