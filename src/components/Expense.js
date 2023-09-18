import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

const Expense = (props) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <div>
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="p">{props.data.name}</Typography>
              <Typography variant="h6" component="p">{`$${props.data.amount}`}</Typography>
            </Stack>
            <Typography variant="subtitle2" component="span">{props.data.due_date.split('T')[0]}</Typography>
        </div>
        <div>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button variant="contained" size="medium" onClick={() => {
                  props.openEditExpModal(props.data);
                }}>Edit</Button>
                <Button variant="contained" size="medium" color="error" onClick={() => {
                  props.deleteExp(props.data.id);
                }}>Delete</Button>
            </ButtonGroup>
        </div>
    </Stack>
  )
}

export default Expense
