import { Alert, Box } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

const CreateAccountPage = (props) => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [alert, setAlert] = useState(false);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const debouncedPassword = useDebounce(confirmPassword, 500);
  useEffect(() => {
    const checkPasswords = async () => {
      if (debouncedPassword) {
        if (debouncedPassword !== password) {
          setAlert(true);
          setErrorText("Password do not match");
        } else {
          setAlert(false);
        }
      }
    };
    checkPasswords();
  }, [debouncedPassword]);

  const onSubmit = (data) => {
    const accountObj = {
      username: data.userName,
      full_name: data.fullName,
      email: data.email,
      password: data.password,
    };
    createAccount(accountObj);
  };

  // Create account on the backend
  const createAccount = async (accountObj) => {
    const res = await fetch("leo6d/budgetappapi:8080/user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(accountObj),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            // setErrorText(text);
            throw new Error(text);
          });
        } else {
          return response.json();
        }
      })
      .catch((err) => {
        errorHandling(err.message);
        console.log("caught it!", err);
      });

    if (res !== undefined && res !== null) {
      props.setAccount({ ...res });
      navigate("/expenses");
    }
  };

  const errorHandling = (error) => {
    if (error.includes("duplicate key value") && error.includes("users_email_key")) {
      setAlert(true);
      setErrorText("Looks like you already have an account with this email");
    } else if (error.includes("duplicate key value") && error.includes("users_pkey")) {
      setAlert(true);
      setErrorText("Looks like you already have an account with this user name");
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
            <h1>Create Account</h1>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.text.primary,
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                {...register("userName", {
                  required: "This is required",
                })}
                error={errors.userName ? true : false}
                helperText={errors.userName ? errors.userName.message : null}
                label="User name"
                variant="outlined"
              ></TextField>
              <TextField
                {...register("fullName", {
                  required: "This is required",
                })}
                error={errors.fullName ? true : false}
                helperText={errors.fullName ? errors.fullName.message : null}
                label="Full name"
                variant="outlined"
              ></TextField>
              <TextField
                {...register("email", {
                  required: "This is required",
                })}
                error={errors.email ? true : false}
                helperText={errors.email ? errors.email.message : null}
                label="Email"
                variant="outlined"
                type="email"
              ></TextField>
              <TextField
                {...register("password", {
                  required: "This is required",
                })}
                error={errors.password ? true : false}
                helperText={errors.password ? errors.password.message : null}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                variant="outlined"
                type="password"
              ></TextField>
              <TextField
                {...register("confirmPassword", {
                  required: "This is required",
                })}
                error={errors.confirmPassword ? true : false}
                helperText={
                  errors.confirmPassword ? errors.confirmPassword.message : null
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm password"
                variant="outlined"
                type="password"
              ></TextField>
              {alert && <Alert severity="error">{errorText}</Alert>}
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  backgroundColor: theme.palette.text.primary,
                }}
              >
                Create Account
              </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAccountPage;
