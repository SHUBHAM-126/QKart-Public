import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    if (
      validateInput({
        username: `${username}`,
        password: `${password}`,
        confirmPassword: `${confirmPassword}`,
      })
    ) {
      const body = {
        username: `${username}`,
        password: `${password}`,
      };

      try {
        setLoading(true);
        const res = await axios.post(`${config.endpoint}/auth/register`, body);

        if (res.status === 201) {
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          enqueueSnackbar("Registered successfully", { variant: "success" });
          history.push('/login', {from: 'Register'})
        }
      } catch (err) {
        if (err.response.data.message) {
          enqueueSnackbar(err.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
      }
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username == "") {
      enqueueSnackbar("Username is a required field", {
        variant: "warning",
      });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password == "") {
      enqueueSnackbar("Password is a required field", {
        variant: "warning",
      });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          {!loading && (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}

          {loading && (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to='/login'>
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
