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
                    mr={10}
                    size="md"
                    variant="subtle"
                    onClick={() => addAction()}
                >
                    <IconPlus size={16}/>
                </ActionIcon>
            }
            {editAction &&
                <ActionIcon
                    mr={10}
                    size="md"
                    variant="subtle"
                    onClick={() => editAction()}
                >
                    <IconEdit size={16}/>
                </ActionIcon>
            }
            {deleteAction &&
                <ActionIcon
                    mr={10}
                    size="md"
                    variant="subtle"
                    onClick={() => deleteAction()}
                >
                    <IconTrash size={16}/>
                </ActionIcon>
            }
        </Center>
    );
}