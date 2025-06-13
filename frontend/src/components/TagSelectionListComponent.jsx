import React from 'react';
import {
    Group,
    Stack,
    Title,
    Divider,
    Text
} from "@mantine/core";
import TagComponent from "./TagComponent.jsx";
import { useSelector } from "react-redux";
import {
    useRemoveTagFromTaskMutation,
    useAddTagToTaskMutation,
} from "../features/customDashboard/customDashboardApi.js";

export default function TagSelectionListComponent({task}) {
    const tags = useSelector(state => state.customDashboard.tags);

    const attachedTagIds = task?.tags?.map(tag => tag.id);
    const unusedTags = tags?.filter(tag => !attachedTagIds.includes(tag.id));

    const [removeTagFromTask] = useRemoveTagFromTaskMutation();
    const [addTagToTask] = useAddTagToTaskMutation();

    const handleRemoveTag = async (tagId) => {
        await removeTagFromTask({taskId: task.id, tagId});
    };

    const handleAddTag = async (tagId) => {
        await addTagToTask({taskId: task.id, tagId});
    };

    return (
        <Stack>
            <Title order={3}>Tags attached</Title>
            {task?.tags?.length > 0 ? (
                <Group wrap>
                    {task.tags.map(tag => (
                        <TagComponent tag={tag} onClick={() => handleRemoveTag(tag.id)}/>
                    ))}
                </Group>
            ) : (
                <Text size="sm" c="dimmed">No tags attached</Text>
            )}

            <Divider/>

            <Title order={3}>Available tags</Title>
            {unusedTags?.length > 0 ? (
                <Group wrap>
                    {unusedTags.map(tag => (
                        <TagComponent tag={tag} onClick={() => handleAddTag(tag.id)}/>
                    ))}
                </Group>
            ) : (
                <Text size="sm" c="dimmed">No more tags to add</Text>
            )}
        </Stack>
    );
}