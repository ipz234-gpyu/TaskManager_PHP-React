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
import { useLoginMutation } from '../features/auth/authApi';
import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [login, {isLoading, error}] = useLoginMutation();
    const [isError, setError] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address',
            password: (value) =>
                value.trim().length > 0 ? null : 'Password is required',
        },
    });

    const handleSubmit = async (values) => {
        try {
            await login(values).unwrap();
            navigate('/');
        } catch {
            setError(true);
        }
    };

    return (
        <Container size={420} my={60}>
            <Title ta="center" fw={700}>
                Welcome Back
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Sign in to access your dashboard
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
                        {error.data?.data?.message || 'Invalid email or password. Please try again.'}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
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
                    </Stack>

                    <Button type="submit" fullWidth mt="xl" loading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <Group justify="center" mt="md">
                    <Text size="sm" c="dimmed">
                        Don&apos;t have an account?{' '}
                        <NavLink to="/register" className="text-blue-600 hover:underline">
                            Register here
                        </NavLink>
                    </Text>
                </Group>
            </Paper>
        </Container>
    );
}