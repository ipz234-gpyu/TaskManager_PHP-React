import {
    ActionIcon,
    Center,
    Accordion, Text, Group
} from '@mantine/core';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import React from "react";

export default function AccordionControl({text, addAction, deleteAction, editAction}) {
    return (
        <Center>
            <Accordion.Control>
                <Group justify="space-between" w="100%">
                    <Text size="xs" fw={500} c="dimmed">
                        {text}
                    </Text>

                </Group>
            </Accordion.Control>
            {addAction &&
                <ActionIcon
                    size="md"
                    variant="subtle"
                    radius="lg"
                    color="green"
                    onClick={() => addAction()}
                >
                    <IconPlus size={18}/>
                </ActionIcon>
            }
            {editAction &&
                <ActionIcon
                    size="md"
                    variant="subtle"
                    radius="lg"
                    onClick={() => editAction()}
                >
                    <IconEdit size={18}/>
                </ActionIcon>
            }
            {deleteAction &&
                <ActionIcon
                    size="md"
                    variant="subtle"
                    radius="lg"
                    color="red"
                    onClick={() => deleteAction()}
                >
                    <IconTrash size={18}/>
                </ActionIcon>
            }
        </Center>
    );
}