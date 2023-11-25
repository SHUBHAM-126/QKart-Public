import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component="img" alt="green iguana" image={product.image} />
      <CardContent>
        <Typography gutterBottom variant="body1" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="body2" fontWeight={600}>
          ${product.cost}
        </Typography>
        <Rating
          name="read-only"
          value={product.rating}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" startIcon = {<AddShoppingCartOutlined />} sx={{width:'100%'}}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
