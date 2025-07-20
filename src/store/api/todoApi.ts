import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Todo } from '../../types/Todo.ts'

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BE_BASE_URL }),
    tagTypes: ['todos'],
    endpoints: (builder) => ({
        getAllTodos: builder.query<Todo[], void>({
            query: () => `/tasks`,
            providesTags: ['todos']
        }),
        createTodo: builder.mutation<Todo, string>({
            query: (todoText) => ({
                url: '/tasks',
                method: 'POST',
                body: {
                    text: todoText
                }
            }),

            // Immediately adds the todo in FE
            async onQueryStarted(text, { dispatch, queryFulfilled }) {
                const tempId = `-1`;
                const patchResult = dispatch(
                    todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
                        draft.unshift({ id: tempId, text: text, createdDate: new Date().valueOf(), completed: false });
                    })
                );

                try {
                    const { data: newTodoFromServer } = await queryFulfilled;
                    dispatch(
                        todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
                            const index = draft.findIndex(todo => todo.id === tempId);
                            if (index !== -1) {
                                draft[index] = newTodoFromServer;
                            }
                            else {
                                draft.unshift(newTodoFromServer);
                            }
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },

            invalidatesTags: ['todos']
        }),

        updateTodoText: builder.mutation<Todo, Todo>({
            query: ({ id, ...todo }) => ({
                url: `/tasks/${id}`,
                method: 'POST',
                body: todo
            }),
            // Immediately updates the todo on FE
            async onQueryStarted({ id, text }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
                        const todo = draft.find((todo) => todo.id === id)
                        if (todo) {
                            todo.text = text
                        }
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['todos']
        }),

        markTodoAsComplete: builder.mutation<Todo, Todo['id']>({
            query: (id) => ({
                url: `/tasks/${id}/complete`,
                method: 'POST'
            }),

            // Marks todo as completed immediately on FE
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
                        const todo = draft.find((todo) => todo.id === id)
                        if (todo) {
                            todo.completed = true
                        }
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['todos']
        }),
        markTodoAsIncomplete: builder.mutation<Todo, Todo['id']>({
            query: (id) => ({
                url: `/tasks/${id}/incomplete`,
                method: 'POST'
            }),

            // Marks todo as incomplete immediately on FE
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
                        const todo = draft.find((todo) => todo.id === id)
                        if (todo) {
                            todo.completed = false
                        }
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['todos']
        }),

        deleteTodo: builder.mutation<void, Todo['id']>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE'
            }),

            // Immediately deletes the Todo on FE
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    todoApi.util.updateQueryData('getAllTodos', undefined, (draft) => {
                        const todoIndex = draft.findIndex((todo) => todo.id === id)
                        if (todoIndex !== -1) {
                            draft.splice(todoIndex, 1)
                        }
                    })
                )
                try {
                    await queryFulfilled
                }
                catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['todos']
        })
    }),
})

export const { useGetAllTodosQuery, useMarkTodoAsCompleteMutation, useMarkTodoAsIncompleteMutation,
               useCreateTodoMutation, useDeleteTodoMutation, useUpdateTodoTextMutation } = todoApi