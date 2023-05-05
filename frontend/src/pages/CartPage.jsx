import React from "react";
import Layoutt from "../components/Layout/Layoutt";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //   delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      // if id is equal then gives true
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1); // from index 1 item delete
      setCart(myCart);
      // As when we delete in local storage still it exists , so when we refresh the again it comes so in local storage also we are removing the items
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.error("Item removed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layoutt>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  } `
                : "Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          {/* show cart items  */}
          <div className="col-md-8">
            <div className="row">
              {cart?.map((p) => (
                <div className="row mb-2 p-3 card flex-row">
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      height={"150px"}
                    />
                  </div>
                  <div className="col-md-8">
                    <p>
                      <b>{p.name}</b>
                    </p>
                    <p>{p.description}</p>
                    <p>Price: {p.price}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For checkout and card Payment  */}
          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Totoa | Checkout | Payment</p>
            <hr />
            <h3>Total : {totalPrice()}</h3>

            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart", // it means after login cart page will open
                        })
                      }
                    >
                      {" "}
                      Please login to Checkout
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layoutt>
  );
};

export default CartPage;
