import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Paper,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Container size="lg" my={120}>
            <Paper withBorder shadow="lg" p={60} radius="lg" ta="center">
                <Stack align="center" spacing="md">
                    <Title order={1} size={48} fw={900}>
                        404 – Page Not Found
                    </Title>
                    <Text size="lg" c="dimmed" maw={500}>
                        The page you are looking for doesn't exist, has been moved, or you may have mistyped the
                        address.
                    </Text>
                    <Group mt="xl">
                        <Button size="md" variant="filled" color="blue" onClick={() => navigate('/dashboard/today')}>
                            Go back to Home
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Container>
    );
}
