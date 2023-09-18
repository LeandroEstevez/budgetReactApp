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
import Modal from "@mui/material/Modal";
import userEvent from "@testing-library/user-event";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AccountPage = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
        userName: props.account.username,
        fullName: props.account.full_name,
        email: props.account.email
    }
});

  const onSubmit = (data) => {
    const accountObj = {
      origusername: props.account.username,
      username: data.userName,
      full_name: data.fullName,
      email: data.email,
    };
    updateAccount(accountObj)
  };

  // Delete Acccount
  const deleteAccount = async (username) => {
    await fetch(`leo6d/budgetappapi:8080/deleteUser/${username}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${props.account.access_token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("caught it!", err);
      });

    localStorage.removeItem("account");
    props.setAccount(null);
  };

  // Update Account
  const updateAccount = async (accountObj) => {
    const res = await fetch("leo6d/budgetappapi:8080/updateAccount", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${props.account.access_token}`,
      },
      body: JSON.stringify(accountObj),
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
        console.log("caught it!", err);
      });
    
    let data = await res;
    console.log(data);
    let newAccountObj = props.account
    newAccountObj.username = data.username
    newAccountObj.full_name = data.full_name
    newAccountObj.email = data.email
    console.log(newAccountObj);
    props.setAccount(newAccountObj);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={0} className="login" sx={{ marginTop: "40px" }}>
        {props.account && <Box
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
            <h1>Account information</h1>
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
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  backgroundColor: theme.palette.text.primary,
                }}
              >
                Update info
              </Button>
            </Stack>
          </form>
        </Box>}
        <Box
          sx={{
            padding: "30px",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            size="large"
            color="error"
            onClick={() => handleOpen()}
          >
            Delete Account
          </Button>
          <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                mb={5}
              >
                <h1>Are you sure?</h1>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Button type="submit" variant="contained" size="medium" onClick={() => deleteAccount(props.account.username)}>
                  Yes
                </Button>
                <Button type="submit" variant="contained" size="medium" onClick={() => handleClose()}>
                  No
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountPage;
