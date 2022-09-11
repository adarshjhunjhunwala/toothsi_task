import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";

const ThankYou = () => {
  const { emptyCart } = useCart();
  useEffect(() => {
    emptyCart();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        margin: "180px",
        padding: "25px",
        borderRadius: "30px",
        boxShadow: "0 2px 10px rgb(0 0 0 / 0.2)",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Thank You! Your order has been successfully placed!
      </h1>
      <Link
        className="btn btn-primary mt-2 pt-3 pb-3"
        to="/"
        style={{
          height: "60px",
          borderRadius: "30px",
          width: "200px",
          marginLeft: "450px",
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ThankYou;
