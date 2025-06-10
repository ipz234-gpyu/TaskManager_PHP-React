import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
    ActionIcon,
    Badge,
    Group,
    NavLink,
    Text
} from "@mantine/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";

export const DashboardItem = ({
                                  IconComponent,
                                  url,
                                  dashboard,
                                  showActions = false,
                                  handleEditClick,
                                  handleDeleteClick
                              }) => {
    const activeTab = useSelector((state) => state.dashboards.activeTab);
    const isActive = activeTab === dashboard.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <NavLink
            label={
                <Group justify="space-between">
                    <Group gap="sm">
                        {IconComponent && <IconComponent size={18}/>}
                        <Text size="sm">{dashboard.name}</Text>
                    </Group>
                    <Group gap="xs">
                        {dashboard?.count > 0 && (
                            <Badge size="sm" variant="light" color="blue">
                                {dashboard.count}
                            </Badge>
                        )}
                        {showActions && (
                            <Group gap={2}>
                                <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    onClick={() => handleEditClick(dashboard)}
                                >
                                    <IconEdit size={16}/>
                                </ActionIcon>
                                <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleDeleteClick(dashboard)}
                                >
                                    <IconTrash size={16}/>
                                </ActionIcon>
                            </Group>
                        )}
                    </Group>
                </Group>
            }
            active={isActive}
            onClick={() => {
                navigate(`/${url}`);
                dispatch(setActiveTab(dashboard.id));
            }}
        />
    );
};