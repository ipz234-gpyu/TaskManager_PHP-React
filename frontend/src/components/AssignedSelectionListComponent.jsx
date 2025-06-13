import React from 'react';
import {
    Group,
    Stack,
    Title,
    Divider,
    Text, Avatar, Tooltip
} from "@mantine/core";
import { useSelector } from "react-redux";
import {
    useRemoveAssignedFromTaskMutation,
    useAddAssignedToTaskMutation,
} from "../features/teamDashboard/teamDashboardApi.js";

export default function AssignedSelectionListComponent({task, teamId}) {
    const users = useSelector(state => state.teamDashboard.users);
    const assignedUsers = users?.filter(user => task?.assignedUserIds?.includes(user.id));
    const unusedUsers = users?.filter(user => !task?.assignedUserIds?.includes(user.id));

    const [removeAssignedFromTask] = useRemoveAssignedFromTaskMutation();
    const [addAssignedToTask] = useAddAssignedToTaskMutation();

    const handleRemoveAssigned = async (assignedUserId) => {
        await removeAssignedFromTask({taskId: task.id, teamId: teamId, assignedUserId: assignedUserId});
    };

    const handleAddAssigned = async (assignedUserId) => {
        await addAssignedToTask({taskId: task.id, teamId: teamId, assignedUserId: assignedUserId});
    };

    return (
        <Stack>
            <Title order={3}>Users assigned</Title>
            {assignedUsers?.length > 0 ? (
                <Group wrap>
                    {assignedUsers.map(user => (
                        <Tooltip withArrow key={user.id} label={`${user.name} ${user.surname}`}>
                            <Avatar src={user?.avatar} radius="xl"
                                    style={{
                                        transition: 'transform 150ms ease',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    onClick={() => handleRemoveAssigned(user.id)}
                            />
                        </Tooltip>
                    ))}
                </Group>
            ) : (
                <Text size="sm" c="dimmed">No users assigned</Text>
            )}

            <Divider/>

            <Title order={3}>Available users</Title>
            {unusedUsers?.length > 0 ? (
                <Group wrap>
                    {unusedUsers.map(user => (
                        <Tooltip withArrow key={user.id} label={`${user.name} ${user.surname}`}>
                            <Avatar src={user.avatar} radius="xl"
                                    style={{
                                        transition: 'transform 150ms ease',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    onClick={() => handleAddAssigned(user.id)}
                            />
                        </Tooltip>
                    ))}
                </Group>
            ) : (
                <Text size="sm" c="dimmed">No more tags to add</Text>
            )}
        </Stack>
    );
}