import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Paper,
    TextInput,
    PasswordInput,
    Modal,
    Alert,
    Avatar,
    FileButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconAlertTriangle, IconUpload, IconUser } from '@tabler/icons-react';
import { useState } from 'react';

import {
    useChangeEmailMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useUploadAvatarMutation,
    useLogoutMutation,
} from '../features/auth/authApi.js';

export default function SettingsPage() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [changeEmail, { isLoading: isChangingEmail }] = useChangeEmailMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
    const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const emailForm = useForm({
        initialValues: {
            email: user?.email || '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length < 6 ? 'Password must be at least 6 characters' : null,
        },
    });

    const passwordForm = useForm({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            currentPassword: (value) => value.length < 6 ? 'Current password is required' : null,
            newPassword: (value) => value.length < 6 ? 'Password must be at least 6 characters' : null,
            confirmPassword: (value, values) =>
                value !== values.newPassword ? 'Passwords do not match' : null,
        },
    });

    const deleteForm = useForm({
        initialValues: {
            password: '',
        },
        validate: {
            password: (value) => value.length < 6 ? 'Password is required' : null,
        },
    });

    const handleEmailChange = async (values) => {
        try {
            await changeEmail(values).unwrap();
            emailForm.setFieldValue('password', '');
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.data?.message || 'Failed to change email',
                color: 'red',
            });
        }
    };

    const handlePasswordChange = async (values) => {
        try {
            await changePassword(values).unwrap();
            passwordForm.reset();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.data?.message || 'Failed to change password',
                color: 'red',
            });
        }
    };

    const handleDeleteAccount = async (values) => {
        try {
            await deleteAccount(values).unwrap();
            setDeleteModalOpened(false);
            navigate('/');
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.data?.message || 'Failed to delete account',
                color: 'red',
            });
        }
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            notifications.show({
                title: 'Error',
                message: 'File too large. Max 5MB allowed',
                color: 'red',
            });
            return;
        }

        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            notifications.show({
                title: 'Error',
                message: 'Only JPEG and PNG files allowed',
                color: 'red',
            });
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await uploadAvatar(formData).unwrap();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.data?.message || 'Failed to upload avatar',
                color: 'red',
            });
        }
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate('/login');
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to logout',
                color: 'red',
            });
        }
    };

    return (
        <Container size="sm" py="xl">
            <Title order={1} mb="xl">Account Settings</Title>

            <Stack gap="xl">
                <Paper withBorder p="md">
                    <Title order={3} mb="md">Profile Picture</Title>
                    <Group>
                        <Avatar
                            src={avatarPreview || user?.avatar}
                            size={80}
                            radius="xl"
                        >
                            <IconUser size={40} />
                        </Avatar>
                        <FileButton
                            onChange={handleAvatarUpload}
                            accept="image/png,image/jpeg,image/jpg"

                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    leftSection={<IconUpload size={16} />}
                                    loading={isUploadingAvatar}
                                    variant="light"
                                >
                                    Upload Avatar
                                </Button>
                            )}
                        </FileButton>
                    </Group>
                    <Text size="sm" c="dimmed" mt="xs">
                        Supported formats: PNG, JPG, JPEG. Max size: 5MB
                    </Text>
                </Paper>

                {/* Change Email */}
                <Paper withBorder p="md">
                    <Title order={3} mb="md">Change Email</Title>
                    <form onSubmit={emailForm.onSubmit(handleEmailChange)}>
                        <Stack gap="md">
                            <TextInput
                                label="New Email"
                                placeholder="Enter new email"
                                {...emailForm.getInputProps('email')}
                            />
                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Enter your current password"
                                {...emailForm.getInputProps('password')}
                            />
                            <Button
                                type="submit"
                                loading={isChangingEmail}
                                disabled={!emailForm.isValid() || emailForm.values.email === user?.email}
                            >
                                Change Email
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                {/* Change Password */}
                <Paper withBorder p="md">
                    <Title order={3} mb="md">Change Password</Title>
                    <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
                        <Stack gap="md">
                            <PasswordInput
                                label="Current Password"
                                placeholder="Enter current password"
                                {...passwordForm.getInputProps('currentPassword')}
                            />
                            <PasswordInput
                                label="New Password"
                                placeholder="Enter new password"
                                {...passwordForm.getInputProps('newPassword')}
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                placeholder="Confirm new password"
                                {...passwordForm.getInputProps('confirmPassword')}
                            />
                            <Button
                                type="submit"
                                loading={isChangingPassword}
                                disabled={!passwordForm.isValid()}
                            >
                                Change Password
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                {/* Account Actions */}
                <Paper withBorder p="md">
                    <Title order={3} mb="md">Account Actions</Title>
                    <Stack gap="md">
                        <Button
                            onClick={handleLogout}
                            loading={isLoggingOut}
                            variant="light"
                            color="blue"
                            fullWidth
                        >
                            Logout
                        </Button>
                        <Button
                            onClick={() => setDeleteModalOpened(true)}
                            color="red"
                            variant="light"
                            fullWidth
                        >
                            Delete Account
                        </Button>
                    </Stack>
                </Paper>
            </Stack>

            {/* Delete Account Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Delete Account"
                centered
            >
                <form onSubmit={deleteForm.onSubmit(handleDeleteAccount)}>
                    <Stack gap="md">
                        <Alert
                            icon={<IconAlertTriangle size={16} />}
                            title="Warning"
                            color="red"
                        >
                            This action is permanent and cannot be undone. All your data will be deleted.
                        </Alert>
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Enter your password to confirm"
                            {...deleteForm.getInputProps('password')}
                        />
                        <Group justify="flex-end">
                            <Button
                                variant="light"
                                onClick={() => setDeleteModalOpened(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="red"
                                loading={isDeletingAccount}
                                disabled={!deleteForm.isValid()}
                            >
                                Delete Account
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Container>
    );
}