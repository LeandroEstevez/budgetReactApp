import { Alert, Box } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = (props) => {
  const [credentialsInvalid, setCredentialsInvalid] = useState(false);
  const [errorText, setErrorText] = useState(
    "Credentials are invalid or account does not exit"
  );
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const loginInfoObj = {
      username: data.userName,
      password: data.password,
    };
    login(loginInfoObj);
    console.log(credentialsInvalid);
  };

  // Log into the account
  const login = async (loginInfoObj) => {
    const res = await fetch("leo6d/budgetappapi:8080/user/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginInfoObj),
    })
      .then((response) => {
        if (!response.ok) {
          setCredentialsInvalid(true);
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          return response.json();
        }
      })
      .catch((err) => {
        console.log("caught it!", err);
      });

    let data = await res;
    if (data !== undefined) {
      props.setAccount({ ...data });
      // window.localStorage.setItem('account', JSON.stringify(data));
      navigate("/expenses");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className="login" sx={{ marginTop: "40px" }}>
        <Box
          sx={{
            padding: "30px",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mb={5}
          >
            <h1>Log In</h1>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.text.primary,
              }}
              onClick={() => navigate("/")}
            >
              Create Account
            </Button>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                {...register("userName", {
                  required: "This is required",
                })}
                error={errors.userName || credentialsInvalid ? true : false}
                helperText={errors.userName ? errors.userName.message : null}
                label="User name"
                variant="outlined"
              ></TextField>
              <TextField
                {...register("password", {
                  required: "This is required",
                })}
                error={errors.password || credentialsInvalid ? true : false}
                helperText={errors.password ? errors.password.message : null}
                label="Password"
                variant="outlined"
                type="password"
              ></TextField>
              {credentialsInvalid && (
                <Alert severity="error">{errorText}</Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: theme.palette.text.primary,
                }}
              >
                Log In
              </Button>
              <Link to="/forgotPassword">Forgot password</Link>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
