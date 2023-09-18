import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

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

const EditExpense = (props) => {
    // Edit expense modal
    const [dueDate, setDueDate] = useState(null);

    // Edit expense form
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: props.targetExp.name,
            amount: props.targetExp.amount,
            category: props.targetExp.category.String
        }
    });

    // Submit handler for edit expense form
    const onSubmit = (data) => {
        const expenseObj = {
            username: props.account.username,
            id: props.expTargetID,
            name: data.name,
            due_date: dueDate.toISOString().split('T')[0],
            amount: parseFloat(data.amount),
            category: data.category,
        }
        props.editExpense(expenseObj);
        reset();
        setDueDate(null);
        props.handleClose();
    };

    return (
        <Modal
            open={props.open}
            onClose={() => props.handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField {...register("name", {
                            required: "This is required"
                        })} 
                            // value={props.targetExp ? props.targetExp.name : null}
                            error={errors.name ? true : false}
                            helperText={errors.name ? errors.name.message : null}
                            label="Name"
                            variant="outlined">
                        </TextField>
                        <DatePicker
                            inputFormat="MM/DD/YYYY"
                            label="Due date"
                            value={dueDate}
                            textField={(params) => <TextField {...params} />}
                            onChange={(newValue) => setDueDate(newValue)} />
                        <TextField {...register("amount", {
                            required: "This is required"
                        })}
                            // value={props.targetExp ? props.targetExp.amount : null}
                            error={errors.amount ? true : false}
                            helperText={errors.amount ? errors.amount.message : null}
                            label="Amount"
                            variant="outlined">
                        </TextField>
                        <TextField {...register("category", {
                            required: "This is required"
                        })}
                            // value={props.targetExp ? props.targetExp.category.String : null}
                            error={errors.category ? true : false}
                            helperText={errors.category ? errors.category.message : null}
                            label="Category"
                            variant="outlined">
                        </TextField>
                        <Button type='submit' variant="contained" size="medium">Edit</Button>
                    </Stack>
                </form>
            </Box>
        </Modal>
    )
}

export default EditExpense
