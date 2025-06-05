import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function App() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

  return (
      <MantineProvider>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <TextInput
                  withAsterisk
                  label="Email"
                  placeholder="your@email.com"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
              />

              <Checkbox
                  mt="md"
                  label="I agree to sell my privacy"
                  key={form.key('termsOfService')}
                  {...form.getInputProps('termsOfService', {type: 'checkbox'})}
              />

              <Group justify="flex-end" mt="md">
                  <Button type="submit">Submit</Button>
              </Group>
          </form>
          <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={[
                  { title: 'Подія 1', date: '2025-06-01' },
                  { title: 'Подія 2', date: '2025-06-02' },
              ]}
          />
      </MantineProvider>
  )
}

export default App
