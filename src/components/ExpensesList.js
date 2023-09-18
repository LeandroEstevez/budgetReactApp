import Expense from "./Expense";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

const ExpenseList = (props) => {
  const [filtered, setFiltered] = useState(false);
  const [displayList, setDisplayList] = useState("block");
  const [displaySearch, setDisplaySearch] = useState("block");

  useEffect(() => {
    if (props.currCategory === "All") {
      setFiltered(false);
    } else {
      setFiltered(true);
    }
  }, [props.currCategory]);

  useEffect(() => {
    if (props.searchedExpense !== "") {
      setDisplayList("none");
      setDisplaySearch("block");
    } else {
      setDisplayList("block");
      setDisplaySearch("none");
    }
  }, [props.searchedExpense]);

  const displayFullList = () => {
    return props.expenseList.map((expense) => (
      <Expense
        key={expense.id}
        data={expense}
        deleteExp={props.deleteExp}
        openEditExpModal={props.openEditExpModal}
      ></Expense>
    ));
  };

  const displayFilteredList = () => {
    const filteredExpenseList = props.expenseList.filter(
      (expense) => {
        return expense.category.String === props.currCategory}
    );
    return filteredExpenseList.map((expense) => (
      <Expense
        key={expense.id}
        data={expense}
        deleteExp={props.deleteExp}
        openEditExpModal={props.openEditExpModal}
      ></Expense>
    ));
  };

  const displaySearchedExpenses = () => {
    const filteredExpenseList = props.expenseList.filter(
      (expense) => expense.name.includes(props.searchedExpense)
    );
    return filteredExpenseList.map((expense) => (
      <Expense
        key={expense.id}
        data={expense}
        deleteExp={props.deleteExp}
        openEditExpModal={props.openEditExpModal}
      ></Expense>
    ));
  };

  return (
    <>
      <Box mt="50px" display={displayList}>
        {filtered ? displayFilteredList() : displayFullList()}
      </Box>
      <Box mt="50px" display={displaySearch}>
          {displaySearchedExpenses()}
      </Box>
    </>
  );
};

export default ExpenseList;
