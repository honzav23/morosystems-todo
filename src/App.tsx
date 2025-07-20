import './App.css'
import {useDeleteTodoMutation, useGetAllTodosQuery, useMarkTodoAsCompleteMutation} from "./store/api/todoApi.ts";
import ActionFeedback from "./components/ActionFeedback";
import { useAppDispatch } from "./store/hooks.ts";
import { useEffect, useMemo, useState } from "react";
import {openErrorSnackbar, openSuccessSnackbar} from "./store/slices/snackbarSlice.ts";
import TodoItem from './components/TodoItem'
import TodoInput from './components/TodoInput'
import { List, CircularProgress, Paper, Typography, Button, Box} from "@mui/material";
import TodoFilters from "./components/filters/TodoFilters.tsx";
import { type Todo } from './types/Todo.ts'
import { type FilterType} from "./types/FilterType.ts";
import './css/styles.css'

function App() {
    const { data: todos, isLoading, isError } = useGetAllTodosQuery()
    const [markTodoAsComplete] = useMarkTodoAsCompleteMutation()
    const [deleteTodo] = useDeleteTodoMutation()
    const dispatch = useAppDispatch();

    const [todosToShow, setTodosToShow] = useState<Todo[]>([])
    const [filter, setFilter] = useState<FilterType>("all")

    if (isError) {
        dispatch(openErrorSnackbar('Unable to load todos'));
    }

    useEffect(() => {
         if (!isLoading) {
            getFilteredTodos()
        }
    }, [todos, isLoading, filter])

    const completeTodos = useMemo(() => {
        if (todos) {
            return todos.filter(todo => todo.completed)
        }
        return []
    }, [todos])

    const incompleteTodos = useMemo(() => {
        if (todos) {
            return todos.filter(todo => !todo.completed)
        }
        return []
    }, [todos])

    // Sets todos to show based on the filter type
    const getFilteredTodos = () => {
        if (filter === 'all') {
            setTodosToShow(todos || [])
        }
        else if (filter === 'completed') {
            setTodosToShow(completeTodos)
        }
        else {
            setTodosToShow(incompleteTodos)
        }
    }

    const markAllTasksComplete = () => {
        // Perform the requests in parallel
        const todosRequests = incompleteTodos.map((todo) => markTodoAsComplete(todo.id).unwrap())

        Promise.all(todosRequests)
            .then(() => dispatch(openSuccessSnackbar("Todos updated successfully")))
            .catch(() => dispatch(openSuccessSnackbar("Some todos weren't successfully updated")))
    }

    const deleteAllCompleteTasks = () => {
        // Perform the requests in parallel
        const todosRequests = completeTodos.map((todo) => deleteTodo(todo.id).unwrap())

        Promise.all(todosRequests)
            .then(() => dispatch(openSuccessSnackbar("Todos deleted successfully")))
            .catch(() => dispatch(openSuccessSnackbar("Some todos weren't successfully deleted")))
    }


    return (
        <div>
            <h2>MoroSystems - TODO</h2>
            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: 'center', width: { lg: '600px' } }}>
                <TodoInput />
                <TodoFilters changeFilter={(value) => setFilter(value)} />
                { isLoading && <CircularProgress sx={{color: '#42a5f5'}} /> }
                {!isLoading && todos &&
                    <Paper elevation={2} sx={{ padding: 4, width: '100%' }}>
                        <Typography align='right' color='#555' variant='body1'>{ `${completeTodos.length}/${todos.length} completed` }</Typography>

                        { todos.length === 0 &&
                            <Typography variant='body1' color='#555' sx={{ mt: 3 }}>No tasks yet</Typography>
                        }
                        <List sx={{ mt: 2 }}>
                            {todosToShow.map((todo) => <TodoItem key={todo.id} todo={todo}/>)
                            }
                         </List>
                        <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                            { incompleteTodos.length > 0 &&
                                <Button className='btn' variant='outlined' onClick={markAllTasksComplete}>Mark all tasks as complete</Button>
                            }
                            { completeTodos.length > 0 &&
                                <Button className='btn' variant='outlined' onClick={deleteAllCompleteTasks} >Delete all complete tasks</Button>
                            }
                        </Box>
                    </Paper>
                }
            </Box>
            <ActionFeedback />
        </div>
    )

}

export default App

