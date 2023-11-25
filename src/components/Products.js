import { Search, SentimentDissatisfied } from "@mui/icons-material";
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
  const data = [
    {
      name: "Tan Leatherette Weekender Duffle",
      category: "Fashion",
      cost: 150,
      rating: 4,
      image:
        "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
      _id: "PmInA797xJhMIPti",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  async function performAPICall(url) {
    setLoading(true);
    try {
      const data = await axios.get(url);
      setProducts(data)
      return data;
    } catch (err) {
      console.log(err);
    }

    setLoading(false);

    return [];
  }

  useEffect(() => {
    performAPICall(`${config.endpoint}/products`);
  }, []);

  return (
    <div>
      <Header />

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

      {products && (
        <Grid container spacing={2} py={5} px={{ xs: 1, md: 2 }}>
          {products.map((product) => {
            return (
              <Grid item xs={12} md={3}>
                <ProductCard product={product} />
              </Grid>
            );
          })}
        </Grid>
      )}

      <Footer />
    </div>
  );
};

export default Products;
