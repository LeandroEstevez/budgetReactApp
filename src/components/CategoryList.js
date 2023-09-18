import Category from "./Category";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

const CategoryList = (props) => {
  const [currCategory, setCurrCategory] = useState("All");

  const categoryList = props.categories.map((category, index) => <MenuItem key={index} value={category}>{category}</MenuItem>);

  const handleChange = (event) => {
    setCurrCategory(event.target.value);
    props.setCurrCategory(event.target.value);
  };

  return (
    // <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt="50px">
    //     <Category></Category>
    //     <Category></Category>
    //     <Category></Category>
    // </Stack>
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={currCategory}
          label="Category"
          onChange={handleChange}
        >
          {categoryList}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategoryList;
