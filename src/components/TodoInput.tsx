import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useCreateTodoMutation } from "../store/api/todoApi.ts";
import { useAppDispatch } from "../store/hooks";
import { openSuccessSnackbar, openErrorSnackbar } from "../store/slices/snackbarSlice.ts";

function TodoInput() {
    const [todoName, setTodoName] = useState('')
    const dispatch = useAppDispatch();

    const [createTodo] = useCreateTodoMutation()

    const addTodo = () => {
        createTodo(todoName).unwrap()
            .then(() => dispatch(openSuccessSnackbar("Todo created successfully")))
            .catch(() => dispatch(openErrorSnackbar("Unable to create todo")))
            .finally(() => setTodoName(''));
    }

    return (
        <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
                label="Add a new task..."
                variant="outlined"
                fullWidth
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
                sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&.Mui-focused fieldset': {
                            borderColor: '#42a5f5',
                        },
                    },
                }}
            />
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addTodo}
                disabled={todoName === ''}
                sx={{
                    bgcolor: '#42a5f5',
                    '&:hover': {
                        bgcolor: '#1e88e5',
                    },
                    borderRadius: '8px',
                    boxShadow: '0px 4px 15px rgba(66, 165, 245, 0.4)',
                    p: '12px 20px',
                    fontSize: '1rem',
                }}>
                Add
            </Button>
        </Box>

    )
}

export default TodoInput