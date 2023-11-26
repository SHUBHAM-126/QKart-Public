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
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [timer, setTimer] = useState("");

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
      }
    };

    getProducts();
  }, []);

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

  return (
    <div>
      <Header
        hasSearch={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        debounceSearch={debounceSearch}
      />

      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>

      {products.length > 0 && !loading && (
        <Grid container spacing={2} py={5} px={{ xs: 1, md: 2 }}>
          {products.map((product) => {
            return (
              <Grid item xs={12} md={3} key={product.name}>
                <ProductCard product={product} />
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

      <Footer />
    </div>
  );
};

export default Products;
