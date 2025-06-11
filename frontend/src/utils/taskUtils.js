export const getPriorityColor = (priority) => {
    switch (parseInt(priority)) {
        case 2: return 'red';
        case 1: return 'yellow';
        case 0: return 'green';
        default: return 'gray';
    }
};

export const getPriorityLabel = (priority) => {
    switch (parseInt(priority)) {
        case 2: return 'High';
        case 1: return 'Medium';
        case 0: return 'Low';
        default: return 'Unknown';
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'completed': return 'green';
        case 'inprogress': return 'blue';
        case 'pending': return 'gray';
        default: return 'gray';
    }
};

export const getStatusLabel = (status) => {
    switch (status) {
        case 'completed': return 'Completed';
        case 'inprogress': return 'In Progress';
        case 'pending': return 'To Do';
        default: return 'Unknown';
    }
};

export const isOverdue = (deadline, status) => {
    if (!deadline || status === 'completed') return false;
    return new Date(deadline) < new Date();
};

export const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (taskDate.getTime() === today.getTime()) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (taskDate.getTime() === today.getTime() + 86400000) {
        return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};