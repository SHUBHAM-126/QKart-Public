import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Typography } from "@mui/material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Cart from "./Cart";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import { useHistory } from "react-router-dom";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [timer, setTimer] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const history = useHistory();

  // let username = localStorage.getItem("username");
  let token = localStorage.getItem("token");

  const performAPICall = async (url) => {
    setNoProductsFound(false);
    setLoading(true);
    try {
      const res = await axios.get(url);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      if (err.response.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else if (err.response.status === 404) {
        setNoProductsFound(true);
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
    return [];
  };

  useEffect(() => {
    const getProducts = async () => {
      const res = await performAPICall(`${config.endpoint}/products`);
      if (res.length > 0) {
        setProducts(res);
        console.log(products);
      }
    };

    getProducts();
  }, []);

  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    const res = await performAPICall(
      `${config.endpoint}/products/search?value=${text}`
    );
    return res;
  };

  // useEffect(() => {
  //   if (searchTerm !== "") {
  //     const getProducts = async () => {
  //       const res = await performSearch(searchTerm);
  //       //console.log(res);
  //       setProducts(res);
  //     };

  //     getProducts();
  //   }
  // }, [searchTerm]);

  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (event, debounceTimeout) => {
    const timerId = setTimeout(async () => {
      console.log("ran");
      const res = await performSearch(event.target.value);
      setProducts(res);
    }, debounceTimeout);
    setTimer(timerId);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  //Fetching cart data
  useEffect(() => {
    fetchCart(token);
  }, []);

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const data = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(data);
      console.log("cart item",data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {

    if(!items.data.length){
      return false
    }

    let present = false;

    items.data.forEach((item) => {
      //console.log(item.productId, productId)
      if (item.productId == productId) {
        present = true
      }
    });

    return present;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return 
    }

    try {
      const data = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      //console.log("POST", data);
      setCartItems(data)
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Failed to update the cart!", {
          variant: "error",
        });
      }
      return null;
    }
  };

  return (
    <div>
      <Header
        hasSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        debounceSearch={debounceSearch}
      />

      <TextField
        className="search-mobile"
        placeholder="Search for items/categories"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        fullwidth
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          debounceSearch(e, 500);
        }}
      />

      {/* PRODUCTS & CART CONTAINER */}

      <Grid container spacing={0} mt={0}>
        {/* PRODUCTS CONTAINER */}

        <Grid item md={token ? 9 : 12} py={0}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India's{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>

          {products.length > 0 && !loading && (
            <Grid container spacing={2} py={5} px={{ xs: 1, md: 2 }}>
              {products.map((product) => {
                return (
                  <Grid item xs={12} md={3} key={product.name}>
                    <ProductCard
                      product={product}
                      handleAddToCart={() =>
                        addToCart(
                          token,
                          cartItems,
                          products,
                          product._id,
                          1,
                          { preventDuplicate: true }
                        )
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}

          {loading && (
            <Box
              minHeight={400}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress />
              <Typography>Loading Products...</Typography>
            </Box>
          )}

          {noProductsFound && (
            <Box
              minHeight={400}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <SentimentDissatisfied />
              <Typography>No Products Found</Typography>
            </Box>
          )}
        </Grid>

        {/* Cart container */}
        {token && (
          <Grid item md={3} style={{ background: "#E9F5E1" }}>
            {cartItems && <Cart products={products} items={cartItems.data} handleQuantity = {addToCart} />}
          </Grid>
        )}
      </Grid>

      {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}

      <Footer />
    </div>
  );
};

export default Products;
