import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  let username = localStorage.getItem("username");
  let token = localStorage.getItem("token");
  // let balance = localStorage.getItem("balance");

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      )}
      {!token && !hasHiddenAuthButtons && (
        <Stack direction="row" spacing={2}>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="contained">Register</Button>
          </Link>
        </Stack>
      )}
      {token && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src="./avatar.png" alt={username} />
            <p>{username}</p>
          </Stack>
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
