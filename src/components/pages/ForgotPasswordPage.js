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

const ForgotPasswordPage = (props) => {
  const [credentialsInvalid, setCredentialsInvalid] = useState(false);
  const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false);
  const [errorText, setErrorText] = useState("Username is not in our system");
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const reqObj = {
      username: data.userName,
    };
    forgotPassword(reqObj);
  };

  // forgotPassword
  const forgotPassword = async (reqObj) => {
    const res = await fetch("leo6d/budgetappapi:8080/forgotpassword", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(reqObj),
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
      setResetPasswordEmailSent(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className="login" sx={{ marginTop: "40px" }}>
        {!resetPasswordEmailSent && (
          <Box
            sx={{
              padding: "30px",
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              mb={5}
            >
              <h1>Forgot Password</h1>
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
                  Submit
                </Button>
              </Stack>
            </form>
          </Box>
        )}
        {resetPasswordEmailSent && (
          <Box
            sx={{
              padding: "30px",
            }}
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              mb={5}
            >
              <h1>
                Password reset email has been sent. Please check you inbox.
              </h1>
            </Stack>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
