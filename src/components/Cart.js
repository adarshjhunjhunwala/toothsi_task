import React from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";

const Cart = () => {
  const { isEmpty, items, cartTotal, updateItem, removeItem, emptyCart } =
    useCart();
  const showAlert = (message, type) => {
    document.getElementById("alert").classList.add(type);
    document.getElementById("alert").innerText = message;
    document.getElementById("alert").classList.remove("modal");
    setTimeout(() => {
      document.getElementById("alert").classList.remove(type);
      document.getElementById("alert").innerText = "";
      document.getElementById("alert").classList.add("modal");
    }, 1500);
  };
  const columns = [
    {
      selector: (row) => (
        <span style={{ cursor: "pointer" }}>
          <i
            className="fa-solid fa-xmark"
            onClick={() => {
              removeItem(row.id);
              showAlert("Product removed from cart", "alert-success");
            }}
          ></i>
        </span>
      ),
    },
    {
      selector: (row) => (
        <img
          style={{ height: "50px", width: "50px" }}
          src={row.image}
          alt={row.name}
        />
      ),
    },
    {
      name: "Product",
      selector: (row) => row.name,
    },
    {
      name: "Price",
      selector: (row) => "$" + row.price.toFixed(2),
    },
    {
      name: "Quantity",
      selector: (row) => (
        <span>
          <i
            className="fa-solid fa-minus me-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              let itemIndex = items.findIndex((x) => x.id === row.id);
              if (row.quantity - 1 === 0) {
                removeItem(row.id);
                showAlert("Product removed from cart", "alert-success");
              } else {
                updateItem(row.id, {
                  quantity: row.quantity - 1,
                  updatedAvailableQuantity:
                    items[itemIndex]["updatedAvailableQuantity"] + 1,
                });
              }
            }}
          ></i>
          {row.quantity}
          <i
            className="fa-solid fa-plus ms-2"
            style={{ cursor: "pointer" }}
            onClick={() => {
              let itemIndex = items.findIndex((x) => x.id === row.id);
              if (items[itemIndex]["updatedAvailableQuantity"] - 1 < 0)
                showAlert(
                  "Specified quantity of product is not available",
                  "alert-danger"
                );
              else {
                updateItem(row.id, {
                  quantity: row.quantity + 1,
                  updatedAvailableQuantity:
                    items[itemIndex]["updatedAvailableQuantity"] - 1,
                });
              }
            }}
          ></i>
        </span>
      ),
    },
    {
      name: "Subtotal",
      selector: (row) => (
        <span style={{ color: "blue" }}>{"$" + row.itemTotal.toFixed(2)}</span>
      ),
    },
  ];

  const handleCheckout = (event) => {
    emptyCart();
    console.log(event.currentTarget);
  };

  return (
    <>
      <div
        className="alert alert-dismissible fade show modal mt-2"
        id="alert"
        role="alert"
      ></div>
      <div
        className="container mt-3"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <DataTable columns={columns} data={items} />
        <div
          className="ms-2 mt-3 p-2"
          style={{
            width: "400px",
            height: "280px",
            boxShadow: "0 2px 10px rgb(0 0 0 / 0.2)",
          }}
        >
          <h3>Cart totals</h3>
          Subtotal
          <span className="float-end" style={{ color: "blue" }}>
            ${cartTotal}
          </span>
          <hr />
          <h5>
            Total
            <span className="float-end mb-2" style={{ color: "blue" }}>
              ${cartTotal}
            </span>
          </h5>
          <br />
          {!isEmpty && (
            <Link
              className="btn btn-primary pt-2 pb-2"
              onClick={() => handleCheckout()}
              to="/thankyou"
              style={{ height: "50px", borderRadius: "25px", width: "300px" }}
            >
              PROCEED TO CHECKOUT
            </Link>
          )}
          <Link
            className="btn btn-primary mt-2 pt-2 pb-2"
            to="/"
            style={{ height: "50px", borderRadius: "25px", width: "300px" }}
          >
            GO BACK
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
