import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboard: null,
    lists: [],
    tags: [],
    loading: false,
    error: null,
};

const customDashboardSlice = createSlice({
    name: 'customDashboard',
    initialState,
    reducers: {
        setCustomDashboard: (state, action) => {
            state.dashboard = action.payload;
            state.error = null;
        },
        setLists: (state, action) => {
            state.lists = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        addList: (state, action) => {
            state.lists.push(action.payload);
            state.lists.sort((a, b) => a.priority - b.priority);
        },
        updateList: (state, action) => {
            const {id, ...updates} = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === id);
            if (listIndex !== -1) {
                state.lists[listIndex] = {...state.lists[listIndex], ...updates};
                state.lists.sort((a, b) => a.priority - b.priority);
            }
        },
        deleteList: (state, action) => {
            state.lists = state.lists.filter(list => list.id !== action.payload);
        },
        addTask: (state, action) => {
            const {listId, task} = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);
            if (listIndex !== -1) {
                if (!state.lists[listIndex].tasks) {
                    state.lists[listIndex].tasks = [];
                }
                state.lists[listIndex].tasks.push(task);
            }
        },
        updateTask: (state, action) => {
            const {listId, taskId, updates} = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);
            if (listIndex !== -1) {
                const taskIndex = state.lists[listIndex].tasks?.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    state.lists[listIndex].tasks[taskIndex] = {
                        ...state.lists[listIndex].tasks[taskIndex],
                        ...updates
                    };
                }
            }
        },
        deleteTask: (state, action) => {
            const {listId, taskId} = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);
            if (listIndex !== -1 && state.lists[listIndex].tasks) {
                state.lists[listIndex].tasks = state.lists[listIndex].tasks.filter(
                    task => task.id !== taskId
                );
            }
        },
        moveTask: (state, action) => {
            const {sourceListId, destListId, taskId, sourceIndex, destIndex} = action.payload;

            const sourceListIndex = state.lists.findIndex(list => list.id === sourceListId);
            const destListIndex = state.lists.findIndex(list => list.id === destListId);

            if (sourceListIndex !== -1 && destListIndex !== -1) {
                const task = state.lists[sourceListIndex].tasks[sourceIndex];

                // Remove from source
                state.lists[sourceListIndex].tasks.splice(sourceIndex, 1);

                // Add to destination
                if (!state.lists[destListIndex].tasks) {
                    state.lists[destListIndex].tasks = [];
                }
                state.lists[destListIndex].tasks.splice(destIndex, 0, task);
            }
        },
        reorderTasks: (state, action) => {
            const {listId, sourceIndex, destIndex} = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);

            if (listIndex !== -1 && state.lists[listIndex].tasks) {
                const tasks = state.lists[listIndex].tasks;
                const [removed] = tasks.splice(sourceIndex, 1);
                tasks.splice(destIndex, 0, removed);
            }
        },
        reorderLists: (state, action) => {
            const {sourceIndex, destIndex} = action.payload;
            const [removed] = state.lists.splice(sourceIndex, 1);
            state.lists.splice(destIndex, 0, removed);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        addTagToTask: (state, action) => {
            const {taskId, tag} = action.payload;

            state.lists.forEach(list => {
                const task = list.tasks?.find(t => t.id === taskId);
                if (task) {
                    task.tags = task.tags || [];
                    if (!task.tags.some(t => t.id === tag.id)) {
                        task.tags.push(tag);
                    }
                }
            });
        },
        removeTagFromTask: (state, action) => {
            const { taskId, tagId } = action.payload;

            state.lists.forEach(list => {
                const task = list.tasks?.find(t => t.id === taskId);
                if (task && task.tags) {
                    task.tags = task.tags.filter(tag => tag.id !== tagId);
                }
            });
        },
        addTag: (state, action) => {
            state.tags.push(action.payload);
        },
        updateTag: (state, action) => {
            const {id, ...updates} = action.payload;
            const tagIndex = state.tags.findIndex(tag => tag.id === id);
            if (tagIndex !== -1) {
                state.tags[tagIndex] = {...state.tags[tagIndex], ...updates};
            }
        },
        deleteTag: (state, action) => {
            const tagId = action.payload;
            state.tags = state.tags.filter(tag => tag.id !== tagId);

            state.lists.forEach(list => {
                if (list.tasks) {
                    list.tasks.forEach(task => {
                        if (task.tags) {
                            task.tags = task.tags.filter(tag => tag.id !== tagId);
                        }
                    });
                }
            });
        },
    }
});

export const {
    setCustomDashboard,
    setLists,
    addList,
    updateList,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    reorderLists,
    setLoading,
    setError,
    clearError,
    setTags,
    addTagToTask,
    removeTagFromTask,
    addTag,
    updateTag,
    deleteTag,
} = customDashboardSlice.actions;

export default customDashboardSlice.reducer;