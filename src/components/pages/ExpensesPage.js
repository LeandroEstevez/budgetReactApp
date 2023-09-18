import CategoryList from "../CategoryList";
import ExpensesList from "../ExpensesList";
import EditExpenseForm from "../EditExpenseForm";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Container, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import NavBar from "../NavBar";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@uidotdev/usehooks";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ExpensesPage = (props) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [currCategory, setCurrCategory] = useState("All");
  const [dueDate, setDueDate] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [localStorageAccount, setLocalStorageAccount] = useState(null);
  // Create expense modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Edit expense modal
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  // Edit expense form
  const [targetExp, setTargetExp] = useState(null);
  const navigate = useNavigate();

  const [searchedExpense, setSearchedExpense] = useState("");

  // Load expenses from server
  useEffect(() => {
    if (props.account === null) {
      let localStorageAccount = JSON.parse(localStorage.getItem("account"));
      getExpenses(localStorageAccount);
      getCategories(localStorageAccount);
      calculateTotal();
    } else {
      getExpenses(props.account);
      getCategories(props.account);
      calculateTotal();
    }
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [expenses]);

  // Create expense form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      category: "",
    },
  });

  // Submit handler for create expense form
  const onSubmit = (data) => {
    const expenseObj = {
      username: props.account.username,
      name: data.name,
      due_date: dueDate.toISOString().split("T")[0],
      amount: parseFloat(data.amount),
      category: data.category,
    };
    addExpense(expenseObj);
  };

  // Create expense to send to server
  const addExpense = async (expenseObj) => {
    const res = await fetch("leo6d/budgetappapi:8080/entry", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${props.account.access_token}`,
      },
      body: JSON.stringify(expenseObj),
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

    reset();
    setDueDate(null);
    handleClose();
    setExpenses([...expenses, res.entry]);
  };

  // Get expenses from server
  const getExpenses = async (account) => {
    const res = await fetch(
      `leo6d/budgetappapi:8080/entries?username=${account.username}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${account.access_token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            setErrorText(text);
            throw new Error(text);
          });
        } else {
          return response.json();
        }
      })
      .catch((err) => {
        console.log("caught it!", err);
      });
    if (res !== undefined && res !== null) {
        setExpenses([...res]);
    } else {
        errorHandling(errorText);
    }
  };

  // Edit an expense
  const openEditExpModal = (expense) => {
    handleOpen2();
    setTargetExp(expense);
  };
  const editExpense = async (expenseObj) => {
    const res = await fetch("leo6d/budgetappapi:8080/updateEntry", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${props.account.access_token}`,
      },
      body: JSON.stringify(expenseObj),
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

    let updatedExpenses = expenses;
    updatedExpenses.forEach((expense, index) => {
      if (expense.id === expenseObj.id) {
        updatedExpenses[index] = res;
      }
    });
    setExpenses([...updatedExpenses]);
  };

  // Delete expense
  const deleteExpense = async (id) => {
    await fetch(`leo6d/budgetappapi:8080/deleteEntry/${id}`, {
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
          setExpenses(expenses.filter((expense) => expense.id !== id));
        }
      })
      .catch((err) => {
        console.log("caught it!", err);
      });
  };

  // Get categories from server
  const getCategories = async (account) => {
    const res = await fetch(
      `leo6d/budgetappapi:8080/categories?username=${account.username}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${account.access_token}`,
        },
      }
    )
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

    // Extract string from object array
    const arr = res.map((item) => {
      return item.String
    });
    arr.unshift("All");
    // // remove duplicates
    // const filteredArr = arr.filter((item,
    //   index) => arr.indexOf(item) === index);
    setCategories([...arr]);
  };

  const errorHandling = (error) => {
    if (error.includes("token has expired")) {
      console.log("token expired");
      navigate("/login");
    }
  };

  const calculateTotal = () => {
    let total = 0;
    expenses.forEach((expense) => {
      total += expense.amount
    });
    setTotal(total);
  }

  return (
    <>
      <NavBar setAccount={props.setAccount} account={props.account}></NavBar>
      <Container>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          mt="50px"
        >
          <Typography variant="h4">Your expenses</Typography>
          <Button variant="contained" size="medium" onClick={handleOpen}>
            Add
          </Button>
        </Stack>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  {...register("name", {
                    required: "This is required",
                  })}
                  error={errors.name ? true : false}
                  helperText={errors.name ? errors.name.message : null}
                  label="Name"
                  variant="outlined"
                ></TextField>
                <DatePicker
                  inputFormat="MM/DD/YYYY"
                  label="Due date"
                  value={dueDate}
                  textField={(params) => <TextField {...params} />}
                  onChange={(newValue) => setDueDate(newValue)}
                />
                <TextField
                  {...register("amount", {
                    required: "This is required",
                  })}
                  error={errors.amount ? true : false}
                  helperText={errors.amount ? errors.amount.message : null}
                  label="Amount"
                  variant="outlined"
                ></TextField>
                <TextField
                  {...register("category", {
                    required: "This is required",
                  })}
                  error={errors.category ? true : false}
                  helperText={errors.category ? errors.category.message : null}
                  label="Category"
                  variant="outlined"
                ></TextField>
                <Button type="submit" variant="contained" size="medium">
                  Add
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>
        {targetExp && <EditExpenseForm
          open={open2}
          targetExp={targetExp}
          account={props.account}
          handleClose={handleClose2}
          editExpense={editExpense}
        ></EditExpenseForm>}
        <Container maxWidth="lg" mt="50px">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          mt="50px"
        >
          <Typography variant="h4">Total: ${total}</Typography>
          <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
            <CategoryList categories={categories} setCurrCategory={setCurrCategory}></CategoryList>
            <TextField label="Search..." variant="outlined" onChange={(e) => setSearchedExpense(e.target.value)}/>
          </Stack>
        </Stack>
          <ExpensesList
            expenseList={expenses}
            openEditExpModal={openEditExpModal}
            deleteExp={deleteExpense}
            currCategory={currCategory}
            searchedExpense={searchedExpense}
          ></ExpensesList>
        </Container>
      </Container>
    </>
  );
};

export default ExpensesPage;
