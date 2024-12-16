import React, { useState } from 'react';

const PaymentComponent = () => {
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const initiatePayment = async () => {
        try {
            // Call your backend to create an order
            const response = await fetch('http://localhost:3001/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: `ORDER_${Date.now()}`,
                    orderAmount: amount,
                    customerName,
                    customerEmail,
                    customerPhone,
                }),
            });
            const data = await response.json();

            if (data && data.order_token) {
                // Initiate Cashfree payment
                const cashfree = new window.Cashfree();
                cashfree.init({
                    orderToken: data.order_token,
                    onSuccess: (paymentData) => {
                        console.log('Payment Successful:', paymentData);
                        alert('Payment Successful');
                    },
                    onFailure: (errorData) => {
                        console.error('Payment Failed:', errorData);
                        alert('Payment Failed');
                    },
                });
            } else {
                alert('Failed to initiate payment. Please try again.');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h3>Enter Payment Details</h3>
            <input
                type="text"
                placeholder="Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <input
                type="tel"
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={initiatePayment}>Pay Now</button>
        </div>
    );
};

export default PaymentComponent;