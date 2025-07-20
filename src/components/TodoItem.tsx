import type { Todo } from '../types/Todo.ts'
import { Paper, ListItem, Box, Checkbox, IconButton, ListItemText, TextField, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import {
    useDeleteTodoMutation,
    useMarkTodoAsCompleteMutation,
    useMarkTodoAsIncompleteMutation, useUpdateTodoTextMutation
} from "../store/api/todoApi.ts";
import { useAppDispatch } from "../store/hooks.ts";
import { openSuccessSnackbar, openErrorSnackbar } from "../store/slices/snackbarSlice.ts";
import { useState } from "react";

interface TodoProps {
    todo: Todo
}

function TodoItem({ todo }: TodoProps) {
    const [markTodoAsComplete] = useMarkTodoAsCompleteMutation()
    const [markTodoAsIncomplete] = useMarkTodoAsIncompleteMutation()
    const [deleteTodo] = useDeleteTodoMutation()
    const [updateTodo] = useUpdateTodoTextMutation()

    const [inEditMode, setInEditMode] = useState(false)
    const [newTodoText, setNewTodoText] = useState(todo.text)

    const dispatch = useAppDispatch()

    // Mark the todo as complete or incomplete depending
    // on the previous state
    const updateTodoCompletion = () => {
        if (!todo.completed) {
            markTodoAsComplete(todo.id).unwrap()
                .then(() => dispatch(openSuccessSnackbar("Todo updated successfully")))
                .catch(() => dispatch(openErrorSnackbar("Unable to update todo")))
        }
        else {
            markTodoAsIncomplete(todo.id).unwrap()
                .then(() => dispatch(openSuccessSnackbar("Todo updated successfully")))
                .catch(() => dispatch(openErrorSnackbar("Unable to update todo")))
        }
    }

    const handleDeleteTodo = () => {
        deleteTodo(todo.id).unwrap()
            .then(() => dispatch(openSuccessSnackbar("Todo deleted successfully")))
            .catch(() => dispatch(openErrorSnackbar("Unable to delete todo")))
    }

    const updateTodoText = () => {
        setInEditMode(false)
        if (newTodoText !== todo.text && newTodoText !== '') {
            updateTodo({...todo, text: newTodoText}).unwrap()
                .then(() => dispatch(openSuccessSnackbar("Todo updated successfully")))
                .catch(() => dispatch(openErrorSnackbar("Unable to update todo")))
        }
    }

    return (
        <Paper
            key={todo.id}
            elevation={2}
            sx={{
                mb: 1.5,
                borderRadius: '8px',
                transition: 'all 0.3s ease-in-out',
                borderLeft: `5px solid ${todo.completed ? '#66bb6a' : '#90caf9'}`,
                '&:hover': {
                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <ListItem
                secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        { inEditMode ? (
                            <Tooltip placement='right' title='Save changes'>
                                <IconButton edge='end' onClick={updateTodoText}>
                                    <SaveIcon color='success' />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title='Edit todo' placement='right'>
                                <IconButton edge='end' onClick={() => setInEditMode(true)}>
                                    <ModeEditIcon color='warning' />
                                </IconButton>
                            </Tooltip>
                        )
                        }

                        {/* Mark as complete/incomplete */}
                        <Tooltip placement='right' title={todo.completed ? 'Incomplete todo' : 'Complete todo'}>
                            <Checkbox
                                edge="end"
                                checked={todo.completed}
                                onClick={updateTodoCompletion}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<CheckCircleOutlineIcon color="success" />}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                            />
                        </Tooltip>

                        {/* Delete button */}
                        <Tooltip title='Delete todo' placement='right'>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                sx={{ color: '#ef5350' }}
                                onClick={handleDeleteTodo}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
                disablePadding
            >
                { inEditMode ? (
                    <TextField variant='outlined' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />
                ) : (
                    <ListItemText
                        primary={todo.text}
                        sx={{
                            cursor: 'pointer',
                            p: 2,
                            wordBreak: 'break-all',
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? '#757575' : '#212121',
                            fontSize: '1.1rem',
                        }}
                    />
                    )
                }
            </ListItem>
        </Paper>
    )
}

export default TodoItem