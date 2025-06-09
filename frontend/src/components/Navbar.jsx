import React from 'react';
import {
    ActionIcon,
    Button,
    Group,
    Tooltip,
    Text,
    Avatar,
} from '@mantine/core';
import { IconPin, IconPinned, IconSettings, IconStar } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import DashboardTabs from './DashboardTabs';

export default function Navbar({pinned, setPinned, isHoveringRef, setExpanded}) {
    const user = useSelector((state) => state.auth.user);

    const navigate = useNavigate();

    const handlePinToggle = () => {
        setPinned(!pinned);
        if (pinned && !isHoveringRef.current) {
            setTimeout(() => setExpanded(false), 300);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <Group justify="space-between" className="p-5 border-b border-gray-600">
                <Group>
                    <Avatar name={user ? `${user.name} ${user.surname}` : null} color="initials"/>
                    <Text fw={600} size="xl" className="text-gray-100">
                        {user ? `${user.name} ${user.surname}` : null}
                    </Text>
                </Group>
                <Tooltip label={pinned ? 'Unpin menu' : 'Pin menu'} position="right">
                    <ActionIcon variant="subtle" onClick={handlePinToggle}>
                        {pinned ? <IconPinned size={18}/> : <IconPin size={18}/>}
                    </ActionIcon>
                </Tooltip>
            </Group>

            <DashboardTabs />

            <div className="mt-auto p-4 border-t border-gray-600">
                <Tooltip label="Settings" position="right">
                    <Button
                        variant="subtle"
                        leftSection={<IconSettings size={18}/>}
                        onClick={() => navigate('/settings')}
                        className="w-full justify-start"
                    >
                        Settings
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}