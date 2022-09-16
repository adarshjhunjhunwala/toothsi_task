import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import productData from "./products";
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";

function ProductList() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantity, setQuantity] = useState(
    productData.map((prod) => {
      return { id: prod.id, qty: 1 };
    })
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");

  const { items, addItem, updateItem } = useCart();

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

  const getProducts = () => {
    try {
      setProducts(productData);
      setFilteredProducts(productData);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          style={{ height: "50px", width: "50px" }}
          src={row.image}
          alt={row.name}
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Color",
      selector: (row) => row.color,
      sortable: true,
    },
    {
      name: "Size",
      selector: (row) => row.size,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) =>
        row.inStock ? (
          <span style={{ color: "green" }}>
            <i className="fa-solid fa-face-smile"></i> In stock
          </span>
        ) : (
          <span style={{ color: "red" }}>
            <i className="fa-solid fa-face-frown"></i> Out of stock
          </span>
        ),
    },
    {
      name: "Total Available Quantity",
      selector: (row) =>
        items.some((item) => item["id"] === row.id)
          ? items[items.findIndex((x) => x.id === row.id)][
              "updatedAvailableQuantity"
            ]
          : row.totalAvailableQuantity,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => "$" + row.price.toFixed(2),
      sortable: true,
    },
    {
      name: "Buy",
      cell: (row) => (
        <>
          <input
            style={{ width: "60px", height: "33px", borderRadius: "0px" }}
            className="form-control me-1"
            type="number"
            value={quantity[row.id - 1].qty}
            onChange={(event) => {
              let updatedQty = [...quantity];
              updatedQty[row.id - 1].qty =
                isNaN(event.target.value) || !event.target.value
                  ? 0
                  : parseInt(event.target.value);
              setQuantity(updatedQty);
            }}
          />
          <button
            style={{
              width: "60px",
              height: "30px",
              borderRadius: "0px",
              paddingBottom: "25px",
            }}
            className="btn btn-dark me-2"
            onClick={() => {
              if (quantity[row.id - 1].qty < 1)
                showAlert(
                  "Product quantity should be greater than 0",
                  "alert-danger"
                );
              else if (quantity[row.id - 1].qty > row.totalAvailableQuantity)
                showAlert(
                  "Specified quantity of product is not available",
                  "alert-danger"
                );
              else if (!document.getElementById(row.id).checked)
                showAlert("Checkbox must be checked", "alert-danger");
              else if (items.some((item) => item["id"] === row.id)) {
                let itemIndex = items.findIndex((x) => x.id === row.id);
                if (
                  quantity[row.id - 1].qty >
                  items[itemIndex]["updatedAvailableQuantity"]
                )
                  showAlert(
                    "Specified quantity of product is not available",
                    "alert-danger"
                  );
                else {
                  updateItem(row.id, {
                    quantity:
                      items[itemIndex]["quantity"] + quantity[row.id - 1].qty,
                    updatedAvailableQuantity:
                      items[itemIndex]["updatedAvailableQuantity"] -
                      quantity[row.id - 1].qty,
                  });
                  showAlert(
                    "Product quantity updated in cart",
                    "alert-success"
                  );
                  document.getElementById(row.id).checked = false;
                }
              } else {
                addItem(
                  {
                    id: row.id,
                    image: row.image,
                    name: row.name,
                    price: row.price,
                    updatedAvailableQuantity:
                      row.totalAvailableQuantity - quantity[row.id - 1].qty,
                  },
                  quantity[row.id - 1].qty
                );
                showAlert("Product added to cart", "alert-success");
                document.getElementById(row.id).checked = false;
              }
            }}
          >
            <i className="fa-solid fa-cart-shopping fa-xs"></i>
          </button>
          <input type="checkbox" key={row.id} id={row.id} />
        </>
      ),
    },
  ];

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    let resl;
    if (search) {
      resl = products.filter((product) => {
        return (
          product.name.toLowerCase().match(search.toLowerCase()) ||
          product.name
            .replace(/-/g, "")
            .toLowerCase()
            .match(search.replace(/-/g, "").toLowerCase())
        );
      });

      setFilteredProducts(resl);
    }

    if (categoryFilter) {
      resl = products.filter((product) => {
        return sizeFilter
          ? product.size.toLowerCase() === sizeFilter.toLowerCase() &&
              product.category.toLowerCase() === categoryFilter.toLowerCase()
          : product.category.toLowerCase() === categoryFilter.toLowerCase();
      });

      setFilteredProducts(resl);

      if (search) {
        resl = filteredProducts.filter((product) => {
          return (
            product.name.toLowerCase().match(search.toLowerCase()) ||
            product.name
              .replace(/-/g, "")
              .toLowerCase()
              .match(search.replace(/-/g, "").toLowerCase())
          );
        });

        setFilteredProducts(resl);
      }
    }
    if (sizeFilter) {
      resl = products.filter((product) => {
        return categoryFilter
          ? product.category.toLowerCase() === categoryFilter.toLowerCase() &&
              product.size.toLowerCase() === sizeFilter.toLowerCase()
          : product.size.toLowerCase() === sizeFilter.toLowerCase();
      });

      setFilteredProducts(resl);

      if (search) {
        resl = filteredProducts.filter((product) => {
          return (
            product.name.toLowerCase().match(search.toLowerCase()) ||
            product.name
              .replace(/-/g, "")
              .toLowerCase()
              .match(search.replace(/-/g, "").toLowerCase())
          );
        });

        setFilteredProducts(resl);
      }
    }

    !search &&
      !categoryFilter &&
      !sizeFilter &&
      setFilteredProducts(productData);
    // eslint-disable-next-line
  }, [search, categoryFilter, sizeFilter]);

  return (
    <div className="container mt-2">
      <h2 style={{ textAlign: "center" }}>Product List</h2>
      <div
        className="alert alert-dismissible fade show modal"
        id="alert"
        role="alert"
      ></div>
      <DataTable
        columns={columns}
        data={filteredProducts}
        fixedHeader
        selectableRowsHighlight
        highlightOnHover
        subHeader
        subHeaderComponent={
          <>
            <select
              className="form-select me-1"
              style={{ width: "140px", borderRadius: "0px" }}
              name="category"
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="" disabled>
                Category
              </option>
              <option value="hoodie">Hoodie</option>
              <option value="t-shirt">T-Shirt</option>
            </select>
            <select
              className="form-select me-3"
              style={{ width: "140px", borderRadius: "0px" }}
              name="size"
              id="size"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="" disabled>
                Size
              </option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setFilteredProducts(productData);
                setCategoryFilter("");
                setSizeFilter("");
              }}
            >
              <i className="fa-solid fa-arrow-rotate-left"></i> Reset
            </span>
            <span style={{ marginLeft: "440px" }}>Search:</span>{" "}
            <input
              type="text"
              style={{ width: "200px", borderRadius: "0px" }}
              className="form-control ms-1 me-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link
              className="btn btn-primary"
              to="/cart"
              style={{ borderRadius: "0px" }}
            >
              Add to Cart
            </Link>
          </>
        }
        subHeaderAlign="left"
      />
    </div>
  );
}

export default ProductList;