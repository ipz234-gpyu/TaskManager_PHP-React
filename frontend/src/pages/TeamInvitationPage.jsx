import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Center,
    Loader
} from "@mantine/core";
import {
    IconCheck,
    IconX,
    IconUsers,
    IconAlertTriangle
} from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useAcceptInvitationMutation,
    useCancelInvitationMutation,
    useIsLiveInvitationMutation
} from "../features/menageTeam/menageTeamApi.js";
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";
import { useDispatch } from "react-redux";

export default function TeamInvitationPage() {
    const {token} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [team, setTeam] = useState(null);

    const [acceptInvitation, {isLoading}] = useAcceptInvitationMutation();
    const [isLiveInvitation] = useIsLiveInvitationMutation();
    const [cancelInvitation] = useCancelInvitationMutation();

    const [status, setStatus] = useState('pending');

    useEffect(() => {
        if (!token) return navigate('/not-found');

        isLiveInvitation(token).unwrap().catch(() => navigate('/not-found'));
    }, [token]);

    const goHome = () => {
        dispatch(setActiveTab('today'));
        navigate('/dashboard/today');
    };

    const handleAccept = async () => {
        try {
            const result = await acceptInvitation(token).unwrap();
            setTeam(result.data.team);
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    const handleDecline = async () => {
        try {
            await cancelInvitation(token).unwrap();
            setStatus('declined');
        } catch {
            setStatus('error');
        }
    };

    const statusBlock = {
        success: {
            icon: <IconCheck size={48} color="#40C057"/>,
            title: `Welcome to the ${team?.name}!`,
            text: "You have successfully joined the team.",
            action: <Button onClick={goHome}>Go back to Home</Button>
        },
        error: {
            icon: <IconAlertTriangle size={48} color="#FA5252"/>,
            title: "Something went wrong",
            text: "There was a problem with the invitation.",
            action: <Button onClick={goHome}>Go back to Home</Button>
        },
        declined: {
            icon: <IconX size={48} color="#868e96"/>,
            title: "Invitation Declined",
            text: "You have declined to join the team.",
            action: <Button onClick={goHome}>Go back to Home</Button>
        }
    };

    if (status !== 'pending') {
        const block = statusBlock[status];
        return (
            <Container size="sm" py="xl">
                <Center>
                    <Paper shadow="md" p="xl" radius="md" w="100%">
                        <Stack align="center" gap="lg">
                            <Center bg="dark.5" p="md" style={{borderRadius: '50%'}}>
                                {block.icon}
                            </Center>
                            <Title order={2} ta="center">{block.title}</Title>
                            <Text ta="center">{block.text}</Text>
                            {block.action}
                        </Stack>
                    </Paper>
                </Center>
            </Container>
        );
    }

    return (
        <Container size="sm" py="xl">
            <Center>
                <Paper shadow="md" p="xl" radius="md" w="100%">
                    <Stack align="center" gap="lg">
                        <Center bg="dark.5" p="md" style={{borderRadius: '50%'}}>
                            <IconUsers size={48} color="#339AF0"/>
                        </Center>

                        <Title order={2} ta="center">Team Invitation</Title>

                        <Text ta="center" size="lg">You've been invited to join a team!</Text>
                        <Text ta="center" c="dimmed">Click below to accept or decline.</Text>

                        {isLoading ? (
                            <Group>
                                <Loader size="sm"/>
                                <Text>Processing...</Text>
                            </Group>
                        ) : (
                            <Group>
                                <Button variant="light" color="gray" onClick={handleDecline}>
                                    Decline
                                </Button>
                                <Button onClick={handleAccept} leftSection={<IconCheck size={16}/>} size="lg">
                                    Accept Invitation
                                </Button>
                            </Group>
                        )}
                    </Stack>
                </Paper>
            </Center>
        </Container>
    );
}