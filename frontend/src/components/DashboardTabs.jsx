import React, { useState } from 'react';
import {
    ScrollArea,
    Divider,
    Group,
    Stack,
} from '@mantine/core';
import {
    IconCalendar,
    IconCalendarUp,
    IconStar,
} from '@tabler/icons-react';

import { DashboardItem } from './DashboardItem.jsx';
import CustomDashboard from "./CustomDashboard.jsx";
import TeamDashboard from "./TeamDashboard.jsx";

function DashboardTabs() {
    const defaultDashboards = [
        {
            id: 'today',
            name: 'Today',
            icon: IconCalendar,
            count: 5
        },
        {
            id: 'upcoming',
            name: 'Upcoming',
            icon: IconCalendarUp,
            count: 12
        },
        {
            id: 'important',
            name: 'Important',
            icon: IconStar,
            count: 3
        },
    ];
    const [error, setError] = useState('');

    return (
        <ScrollArea className="flex-1 px-3">
            <Stack gap="md" className="py-4">
                <Stack gap="xs">
                    {defaultDashboards.map((dashboard) => (
                        <DashboardItem
                            IconComponent={dashboard.icon}
                            url={`dashboard/${dashboard.id}`}
                            key={dashboard.id}
                            dashboard={dashboard}/>
                    ))}
                </Stack>

                <Divider color="dark.4"/>
                <CustomDashboard setError={setError}/>
                <Divider color="dark.4"/>
                <TeamDashboard setError={setError}/>
            </Stack>
        </ScrollArea>
    );
}

export default DashboardTabs;