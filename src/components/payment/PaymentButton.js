import React from 'react';

const PaymentButton = () => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.instamojo.com/v1/button.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a
      href="https://www.instamojo.com/@ritesh_w11/l72efdc9f70b147c393de19d0630d1c72/"
      rel="im-checkout"
      data-text="Book Now"
      data-css-style="color:#ffffff; background:#008b02; width:300px; border-radius:4px"
      data-layout="vertical"
    >
    </a>
  );
};

export default PaymentButton;