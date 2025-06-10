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

    const handleClick = () => {
        navigate(`/${url}`);
        dispatch(setActiveTab(dashboard.id));
    };

    return (
        <Group gap={1} justify="space-between" align="center">
            <NavLink
                label={
                    <Group justify="space-between" gap="sm">
                        <Group>
                            {IconComponent && <IconComponent size={18}/>}
                            <Text size="sm" lineClamp={1}>{dashboard.name}</Text>
                        </Group>
                        {dashboard?.count > 0 && (
                            <Badge size="sm" variant="light" color="blue">
                                {dashboard.count}
                            </Badge>
                        )}
                    </Group>
                }
                active={isActive}
                onClick={handleClick}
                style={{flex: 1}}
            />

            {showActions && (
                <Group gap={1} align="center">
                        <ActionIcon
                            size="md"
                            variant="subtle"
                            radius="lg"
                            onClick={() => handleEditClick(dashboard)}
                        >
                            <IconEdit size={18}/>
                        </ActionIcon>
                        <ActionIcon
                            size="md"
                            variant="subtle"
                            color="red"
                            radius="lg"
                            onClick={() => handleDeleteClick(dashboard)}
                        >
                            <IconTrash size={18}/>
                        </ActionIcon>
                </Group>
            )}
        </Group>
    );
};