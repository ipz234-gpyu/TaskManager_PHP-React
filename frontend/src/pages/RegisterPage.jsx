import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Stack,
    Alert,
    Container,
    Group,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useRegisterMutation } from '../features/auth/authApi';
import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from "react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [register, {isLoading, error}] = useRegisterMutation();
    const [isError, setError] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },

        validate: {
            name: (value) => (value.trim().length > 0 ? null : 'First name is required'),
            surname: (value) => (value.trim().length > 0 ? null : 'Last name is required'),
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email address',
            password: (value) =>
                value.length >= 6 ? null : 'Password must be at least 6 characters',
            confirmPassword: (value, values) =>
                value === values.password ? null : 'Passwords do not match',
        },
    });

    const handleSubmit = async (values) => {
        try {
            await register({
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password,
            }).unwrap();
        } catch {
            setError(true);
        }

        navigate('/');
    };

    return (
        <Container size={420}>
            <Title ta="center" fw={700}>
                Create Account
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Fill in the form to register
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {isError && (
                    <Alert
                        icon={<IconAlertTriangle size={18}/>}
                        title="Login Failed"
                        color="red"
                        withCloseButton
                        autoContrast
                        variant="light"
                        onClose={() => {
                            setError(false)
                        }}
                    >
                        {(error.data?.data?.message || '')}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="First Name"
                            placeholder="John"
                            withAsterisk
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Doe"
                            withAsterisk
                            {...form.getInputProps('surname')}
                        />
                        <TextInput
                            label="Email"
                            placeholder="you@example.com"
                            withAsterisk
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            withAsterisk
                            {...form.getInputProps('password')}
                        />
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Repeat password"
                            withAsterisk
                            {...form.getInputProps('confirmPassword')}
                        />
                    </Stack>

                    <Button type="submit" fullWidth mt="xl" loading={isLoading}>
                        Register
                    </Button>
                </form>

                <Group justify="center" mt="md">
                    <Text size="sm" c="dimmed">
                        Already have an account?{' '}
                        <NavLink to="/login" className="text-blue-600 hover:underline">
                            Log in here
                        </NavLink>
                    </Text>
                </Group>
            </Paper>
        </Container>
    );
}