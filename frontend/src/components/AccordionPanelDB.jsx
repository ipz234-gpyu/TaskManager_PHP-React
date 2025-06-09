import {
    Center,
    Accordion, Stack, Button, Loader
} from '@mantine/core';
import { IconPlus, IconDashboard } from '@tabler/icons-react';
import React from "react";
import { DashboardItem } from "./DashboardItem.jsx";

export default function AccordionPanelDB({dashboards, urldb, addAction, isLoading = false, handleEditClick, handleDeleteClick}) {
    return (
        <Accordion.Panel>
            <Stack gap="xs">
                {dashboards?.length > 0 ? (
                    dashboards.map((dashboard) => (
                        <DashboardItem
                            key={dashboard.id}
                            url={`dashboard/${urldb}/${dashboard.id}`}
                            dashboard={dashboard}
                            showActions={true}
                            IconComponent={IconDashboard}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                        />
                    ))
                ) : (
                    <Button
                        variant="light"
                        size="xs"
                        fullWidth
                        leftSection={<IconPlus size={16} />}
                        onClick={addAction}
                        mt="sm"
                    >
                        Create Dashboard
                    </Button>
                )}
                {isLoading &&
                    <Center>
                        <Loader color="blue" size="md" variant="dots" />
                    </Center>
                }
            </Stack>
        </Accordion.Panel>
    )
}