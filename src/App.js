import "./App.css";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import ThankYou from "./components/ThankYou";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "react-use-cart";

function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route exact path="/" element={<CartProvider><ProductList /></CartProvider>}></Route>
            <Route exact path="/cart" element={<CartProvider><Cart /></CartProvider>}></Route>
            <Route exact path="/thankyou" element={<ThankYou />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
