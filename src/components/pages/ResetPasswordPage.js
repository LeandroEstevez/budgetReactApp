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
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const ResetPasswordPage = (props) => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [alert, setAlert] = useState(false);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();
  const token = useParams();
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
    const obj = {
      password: data.password
    };
    resetPassword(obj);
  };

  // Reset password on the backend
  const resetPassword = async (obj) => {
    const res = await fetch("leo6d/budgetappapi:8080/resetPassword", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
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

    console.log("Heeeeeeeeyyyyyy");
    let data = await res;
    console.log(data);
    if (data !== undefined) {
      navigate("/login");
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
    console.log(error);
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
            <h1>Reset Password</h1>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
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
                Submit
              </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
