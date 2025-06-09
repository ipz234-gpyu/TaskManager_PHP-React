import React, { useState, useEffect } from 'react';
import {
    ScrollArea,
    Divider,
    Group,
    Stack,
    Accordion,
    Modal,
    Button,
    TextInput,
} from '@mantine/core';
import {
    IconCalendar,
    IconCalendarUp,
    IconStar,
} from '@tabler/icons-react';

import { useDispatch, useSelector } from 'react-redux'
import { DashboardItem } from './DashboardItem.jsx';
import AccordionControl from './AccordionControl.jsx'
import AccordionPanelDB from "./AccordionPanelDB.jsx";
import CustomDashboard from "./CustomDashboard.jsx";

function DashboardTabs() {
    const dispatch = useDispatch();
    const teams = useSelector((state) => state.dashboards.teams);
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
    const [isErrorAdd, setError] = useState(false);

    const click = () => {
        alert("Not GAY");
    }

    return (
        <ScrollArea className="flex-1 px-3">
            <Stack gap="md" className="py-4">
                <Group gap="xs">
                    {defaultDashboards.map((dashboard) => (
                        <DashboardItem
                            IconComponent={dashboard.icon}
                            url={`dashboard/${dashboard.id}`}
                            key={dashboard.id}
                            dashboard={dashboard}/>
                    ))}
                </Group>

                <Divider color="dark.4"/>

                <CustomDashboard setError={setError}/>

                <Divider color="dark.4"/>

                <Accordion
                    variant="contained"
                    chevronPosition="right"
                    multiple
                >
                    <Accordion.Item value="teams-header">
                        <AccordionControl
                            text='TEAMS'
                            //addAction={addTeamHandle}
                        />

                        <Accordion.Panel>
                        <Accordion
                                multiple
                            >
                                {teams?.map((team) => (
                                    <Accordion.Item value={`team-${team.id}`} key={team.id}>
                                        <AccordionControl
                                            text={team.name}
                                            addAction={click}
                                            deleteAction={team.isAdmin ?? click}
                                        />

                                        <AccordionPanelDB
                                            dashboards={team.dashboards}
                                            urldb={`team/${team.id}`}
                                            addAction={click}
                                        />
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Stack>
        </ScrollArea>
    );
}

export default DashboardTabs;