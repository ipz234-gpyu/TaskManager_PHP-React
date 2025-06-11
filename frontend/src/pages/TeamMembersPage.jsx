import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Title,
    TextInput,
    Button,
    Table,
    Avatar,
    Group,
    Text,
    Badge,
    ActionIcon,
    Stack,
    Alert,
    Modal,
    Center,
    Loader,
    Flex,
    Box
} from "@mantine/core";
import {
    IconMail,
    IconTrash,
    IconUserMinus,
    IconCheck,
    IconClock,
    IconAlertCircle,
    IconUsers,
    IconSend
} from "@tabler/icons-react";
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    useGetTeamMutation,
    useInviteUserMutation,
    useKickMemberMutation,
    useRevokeInvitationMutation
} from "../features/menageTeam/menageTeamApi.js";

export default function TeamMembersPage() {
    const { teamId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { team, members, invitations } = useSelector(state => state.menageTeam);

    const [getTeam, { isLoading: isTeamLoading }] = useGetTeamMutation();
    const [inviteUser, { isLoading: isInviteLoading }] = useInviteUserMutation();
    const [kickMember, { isLoading: isKickLoading }] = useKickMemberMutation();
    const [revokeInvitation, { isLoading: isRevokeLoading }] = useRevokeInvitationMutation();

    const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] = useDisclosure(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [isInviting, setIsInviting] = useState(false);

    const form = useForm({
        initialValues: {
            email: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
        }
    });

    useEffect(() => {
        if (!teamId) {
            navigate('/not-found');
            return;
        }

        const fetchTeam = async () => {
            try {
                await getTeam(teamId).unwrap();
                dispatch(setActiveTab(teamId));
            } catch {
                navigate('/not-found');
            }
        };

        fetchTeam();
    }, [teamId]);

    const handleInviteUser = async (values) => {
        if (!team?.id) return;

        try {
            setIsInviting(true);
            await inviteUser({
                teamId: team.id,
                email: values.email
            }).unwrap();

            notifications.show({
                title: 'Success',
                message: 'Invitation sent successfully!',
                color: 'green',
                icon: <IconCheck size={16} />
            });

            form.reset();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error?.data?.message || 'Failed to send invitation',
                color: 'red',
                icon: <IconAlertCircle size={16} />
            });
        } finally {
            setIsInviting(false);
        }
    };

    const handleKickMember = async (memberId) => {
        try {
            await kickMember({
                teamId: team.id,
                memberId: memberId
            }).unwrap();

            notifications.show({
                title: 'Success',
                message: 'Member removed from team',
                color: 'green',
                icon: <IconCheck size={16} />
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error?.data?.message || 'Failed to remove member',
                color: 'red',
                icon: <IconAlertCircle size={16} />
            });
        }
    };

    const handleRevokeInvitation = async (invitationId) => {
        try {
            await revokeInvitation({
                teamId: team.id,
                invitationId: invitationId
            }).unwrap();

            notifications.show({
                title: 'Success',
                message: 'Invitation revoked',
                color: 'orange',
                icon: <IconCheck size={16} />
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error?.data?.message || 'Failed to revoke invitation',
                color: 'red',
                icon: <IconAlertCircle size={16} />
            });
        }
    };

    const openConfirmAction = (action, title, message, onConfirm) => {
        setConfirmAction({ title, message, onConfirm });
        openConfirmModal();
    };

    const isExpired = (expiresAt) => {
        return new Date(expiresAt) < new Date();
    };

    const formatExpiryDate = (expiresAt) => {
        const date = new Date(expiresAt);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Expires today';
        if (diffDays === 1) return 'Expires tomorrow';
        return `Expires in ${diffDays} days`;
    };

    if (isTeamLoading) {
        return (
            <Center className="h-screen">
                <Loader color="blue" size="xl" variant="dots" />
            </Center>
        );
    }

    if (!team) {
        return (
            <Center style={{ height: '50vh' }}>
                <Text>Team not found</Text>
            </Center>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <Box>
                    <Title order={1} mb="sm">
                        <Group gap="sm">
                            <IconUsers size={32} />
                            Manage Team: {team.name}
                        </Group>
                    </Title>
                    <Text c="dimmed" size="lg">
                        Invite new members and manage your team
                    </Text>
                </Box>

                {/* Invite Form */}
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={2} mb="lg">
                        <Group gap="sm">
                            <IconMail size={24} />
                            Send Invitation
                        </Group>
                    </Title>

                    <Box>
                        <Flex gap="md" align="end">
                            <TextInput
                                label="Email Address"
                                placeholder="Enter email address"
                                {...form.getInputProps('email')}
                                style={{ flexGrow: 1 }}
                                leftSection={<IconMail size={16} />}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (form.isValid()) {
                                            handleInviteUser(form.values);
                                        }
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    if (form.isValid()) {
                                        handleInviteUser(form.values);
                                    }
                                }}
                                loading={isInviting || isInviteLoading}
                                leftSection={<IconSend size={16} />}
                                disabled={!form.isValid()}
                            >
                                Send Invite
                            </Button>
                        </Flex>
                    </Box>
                </Paper>

                {/* Team Members */}
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={2} mb="lg">
                        Team Members ({members?.length || 0})
                    </Title>

                    {members && members.length > 0 ? (
                        <Table highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Member</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Role</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {members.map((member) => (
                                    <Table.Tr key={member.id}>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Avatar
                                                    src={member.avatar}
                                                    size="md"
                                                    name={`${member.name} ${member.surname || null}`}
                                                    color="initials"
                                                />
                                                <div>
                                                    <Text fw={500}>
                                                        {member.name} {member.surname || ''}
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {member.email}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={member.id === team.created_by ? 'blue' : 'gray'}
                                                variant="light"
                                            >
                                                {member.id === team.created_by ? 'Owner' : 'Member'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            {member.id !== team.created_by && (
                                                <ActionIcon
                                                    color="red"
                                                    variant="light"
                                                    onClick={() => openConfirmAction(
                                                        'kick',
                                                        'Remove Member',
                                                        `Are you sure you want to remove ${member.name} ${member.surname || ''} from the team?`,
                                                        () => handleKickMember(member.id)
                                                    )}
                                                    loading={isKickLoading}
                                                >
                                                    <IconUserMinus size={16} />
                                                </ActionIcon>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Alert icon={<IconUsers size={16} />} color="blue">
                            No team members found
                        </Alert>
                    )}
                </Paper>

                {/* Pending Invitations */}
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={2} mb="lg">
                        Pending Invitations ({invitations?.length || 0})
                    </Title>

                    {invitations && invitations.length > 0 ? (
                        <Table highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Invited User</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Expires</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {invitations.map((invitation) => (
                                    <Table.Tr key={invitation.id}>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Avatar
                                                    src={invitation.user?.avatar}
                                                    size="md"
                                                    name={`${invitation.user?.name} ${invitation.user?.surname || ''}`}
                                                    color="orange"
                                                />
                                                <div>
                                                    <Text fw={500}>
                                                        {invitation.user?.name} {invitation.user?.surname || ''}
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {invitation.user?.email}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={isExpired(invitation.expires_at) ? 'red' : 'orange'}
                                                variant="light"
                                                leftSection={<IconClock size={12} />}
                                            >
                                                {isExpired(invitation.expires_at) ? 'Expired' : 'Pending'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                size="sm"
                                                c={isExpired(invitation.expires_at) ? 'red' : 'dimmed'}
                                            >
                                                {formatExpiryDate(invitation.expires_at)}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                color="red"
                                                variant="light"
                                                onClick={() => openConfirmAction(
                                                    'revoke',
                                                    'Revoke Invitation',
                                                    `Are you sure you want to revoke the invitation for ${invitation.user?.name} ${invitation.user?.surname || ''}?`,
                                                    () => handleRevokeInvitation(invitation.id)
                                                )}
                                                loading={isRevokeLoading}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <Alert icon={<IconMail size={16} />} color="blue">
                            No pending invitations
                        </Alert>
                    )}
                </Paper>
            </Stack>

            {/* Confirmation Modal */}
            <Modal
                opened={confirmModalOpened}
                onClose={closeConfirmModal}
                title={confirmAction?.title}
                centered
            >
                <Stack gap="md">
                    <Text>{confirmAction?.message}</Text>
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="light"
                            onClick={closeConfirmModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={() => {
                                confirmAction?.onConfirm();
                                closeConfirmModal();
                            }}
                        >
                            Confirm
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}