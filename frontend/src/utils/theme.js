import { createTheme } from "@mantine/core";

export const NAVBAR_WIDTH = 320;

export const darkTheme = createTheme({
    colorScheme: 'dark',
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',

    colors: {
        dark: [
            '#C1C2C5', // lightest
            '#A6A7AB',
            '#909296',
            '#5C5F66',
            '#373A40',
            '#2C2E33',
            '#25262B', // drawer/nav bg
            '#1A1B1E', // main bg
            '#141517',
            '#101113'  // darkest
        ],
        blue: [
            '#E7F5FF',
            '#D0EBFF',
            '#A5D8FF',
            '#74C0FC',
            '#4DABF7',
            '#339AF0',
            '#228BE6', // primary
            '#1C7ED6',
            '#1971C2',
            '#1864AB'
        ],
        green: [
            '#D3F9D8',
            '#B2F2BB',
            '#8CE99A',
            '#69DB7C',
            '#51CF66',
            '#40C057', // success
            '#37B24D',
            '#2F9E44',
            '#2B8A3E',
            '#237630'
        ],
        red: [
            '#FFE3E3',
            '#FFC9C9',
            '#FFA8A8',
            '#FF8787',
            '#FF6B6B',
            '#FA5252', // error
            '#F03E3E',
            '#E03131',
            '#C92A2A',
            '#A61E1E'
        ],
        yellow: [
            '#FFF9DB',
            '#FFF3BF',
            '#FFEC99',
            '#FFE066',
            '#FFD43B',
            '#FCC419', // warning
            '#FAB005',
            '#F59F00',
            '#F08C00',
            '#E67700'
        ]
    },

    components: {
        DateTimePicker: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    color: theme.colors.dark[0],
                    '&:focus': {
                        borderColor: theme.colors.blue[6],
                    },
                },
                dropdown: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[5],
                    zIndex: 1000, // гарантує поверх всього
                },
                day: {
                    color: theme.colors.dark[0],
                    '&[data-selected]': {
                        backgroundColor: theme.colors.blue[6],
                        color: theme.white,
                    },
                    '&[data-outside]': {
                        color: theme.colors.dark[4],
                    },
                    '&:hover': {
                        backgroundColor: theme.colors.dark[5],
                    },
                },
                timeInput: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    color: theme.colors.dark[0],
                },
            }),
        },


        AppShell: {
            styles: (theme) => ({
                main: {
                    backgroundColor: theme.colors.dark[7],
                    color: theme.colors.dark[0],
                    transition: 'padding-left 300ms ease',
                    minHeight: '100vh',
                    padding: 0,
                },
                navbar: {
                    width: NAVBAR_WIDTH,
                    backgroundColor: theme.colors.dark[6],
                    boxShadow: theme.shadows.xl,
                    transition: 'transform 300ms ease',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 45,
                    borderRight: `1px solid ${theme.colors.dark[5]}`,
                }
            })
        },

        // Navbar styles
        Group: {
            styles: (theme) => ({
                root: {
                    '&[data-navbar-header]': {
                        padding: '20px',
                        borderBottom: `1px solid ${theme.colors.dark[5]}`,
                        backgroundColor: theme.colors.dark[6],
                    },
                    '&[data-navbar-footer]': {
                        marginTop: 'auto',
                        padding: '16px',
                        borderTop: `1px solid ${theme.colors.dark[5]}`,
                        backgroundColor: theme.colors.dark[6],
                    }
                }
            })
        },

        // Avatar component
        Avatar: {
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.blue[6],
                    color: theme.white,
                    marginRight: '12px',
                }
            })
        },

        // Text component
        Text: {
            styles: (theme) => ({
                root: {
                    color: theme.colors.dark[0],
                    '&[data-user-name]': {
                        fontSize: '14px',
                        fontWeight: 500,
                    },
                    '&[data-accordion-text]': {
                        fontSize: '12px',
                        fontWeight: 500,
                        color: theme.colors.dark[2],
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }
                }
            })
        },

        // ActionIcon for pin/unpin and other actions
        ActionIcon: {
            styles: (theme) => ({
                root: {
                    color: theme.colors.dark[2],
                    '&:hover': {
                        backgroundColor: theme.colors.dark[5],
                        color: theme.colors.dark[0],
                    },
                    '&[data-variant="subtle"]': {
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: theme.colors.dark[5],
                        }
                    },
                    '&[data-size="xs"]': {
                        width: '24px',
                        height: '24px',
                        minWidth: '24px',
                        minHeight: '24px',
                    },
                    // Для красных кнопок (удаление)
                    '&[data-color="red"]': {
                        color: theme.colors.red[5],
                        '&:hover': {
                            backgroundColor: theme.colors.red[9],
                            color: theme.colors.red[4],
                        }
                    }
                }
            })
        },

        // Tooltip
        Tooltip: {
            styles: (theme) => ({
                tooltip: {
                    backgroundColor: theme.colors.dark[5],
                    color: theme.colors.dark[0],
                    border: `1px solid ${theme.colors.dark[4]}`,
                    fontSize: '12px',
                }
            })
        },

        // ScrollArea
        ScrollArea: {
            styles: (theme) => ({
                root: {
                    flex: 1,
                    padding: '0 12px',
                },
                scrollbar: {
                    '&[data-orientation="vertical"]': {
                        backgroundColor: theme.colors.dark[7],
                        width: '6px',
                        '&:hover': {
                            backgroundColor: theme.colors.dark[6],
                        }
                    }
                },
                thumb: {
                    backgroundColor: theme.colors.dark[4],
                    borderRadius: '3px',
                    '&:hover': {
                        backgroundColor: theme.colors.dark[5],
                    }
                }
            })
        },

        // Stack
        Stack: {
            styles: (theme) => ({
                root: {
                    '&[data-dashboard-stack]': {
                        gap: '16px',
                        paddingTop: '16px',
                        paddingBottom: '16px',
                    }
                }
            })
        },

        // Divider
        Divider: {
            styles: (theme) => ({
                root: {
                    borderColor: theme.colors.dark[5],
                    '&[data-color="dark.4"]': {
                        borderColor: theme.colors.dark[4],
                    }
                }
            })
        },

        // Accordion
        Accordion: {
            styles: (theme) => ({
                root: {
                    backgroundColor: 'transparent',
                    '&[data-variant="contained"]': {
                        backgroundColor: theme.colors.dark[7],
                        borderRadius: theme.radius.md,
                        border: `1px solid ${theme.colors.dark[5]}`,
                    }
                },
                control: {
                    color: theme.colors.dark[1],
                    borderRadius: theme.radius.md,
                    '&[data-active]': {
                        backgroundColor: theme.colors.dark[5],
                        color: theme.white,
                    },
                },
                content: {
                    backgroundColor: theme.colors.dark[4],
                    padding: '8px',
                    borderRadius: `10px`,
                },
                panel: {
                    borderRadius: `0 0 ${theme.radius.md}px ${theme.radius.md}px`,
                },
                chevron: {
                    color: theme.colors.dark[2],
                    '&[data-rotate]': {
                        transform: 'rotate(180deg)',
                    }
                },
                item: {
                    backgroundColor: 'transparent',
                    border: 'none',
                    marginBottom: '4px',
                    '&:last-child': {
                        marginBottom: 0,
                    }
                }
            }),
        },

        // NavLink
        NavLink: {
            styles: (theme) => ({
                root: {
                    color: theme.colors.dark[2],
                    borderRadius: theme.radius.md,
                    margin: '2px 0',
                    padding: '8px 12px',
                    fontWeight: 500,
                    fontSize: '14px',
                    transition: 'all 150ms ease',
                    '&[data-active]': {
                        backgroundColor: theme.colors.blue[6],
                        color: theme.white,
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: theme.colors.blue[5]
                        }
                    },
                    '&:hover:not([data-active])': {
                        backgroundColor: theme.colors.dark[5],
                        color: theme.colors.dark[0]
                    }
                },
                label: {
                    fontWeight: 'inherit',
                },
                icon: {
                    color: 'inherit',
                }
            })
        },

        // Loader
        Loader: {
            styles: (theme) => ({
                root: {
                    '&[data-variant="dots"]': {
                        color: theme.colors.blue[6],
                    }
                }
            })
        },

        // Center
        Center: {
            styles: (theme) => ({
                root: {
                    '&[data-accordion-control-wrapper]': {
                        width: '100%',
                        position: 'relative',
                    }
                }
            })
        },

        // Для hover trigger элемента
        Box: {
            styles: (theme) => ({
                root: {
                    '&[data-hover-trigger]': {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        width: '12px',
                        zIndex: 40,
                        cursor: 'pointer',
                        background: `linear-gradient(to right, 
                            rgba(${theme.colors.blue[6].slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(',')}, 0.1), 
                            rgba(${theme.colors.blue[6].slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(',')}, 0.4)
                        )`,
                        backdropFilter: 'blur(4px)',
                        transition: 'width 100ms ease, opacity 200ms ease',
                        '&:hover': {
                            width: '16px',
                        },
                        '&[data-expanded]': {
                            opacity: 0,
                        }
                    }
                }
            })
        },

        // Дополнительные компоненты
        Card: {
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[5],
                    '&:hover': {
                        borderColor: theme.colors.dark[4]
                    }
                }
            })
        },

        Paper: {
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.colors.dark[6],
                    color: theme.colors.dark[0]
                }
            })
        },

        Modal: {
            styles: (theme) => ({
                content: {
                    backgroundColor: theme.colors.dark[6]
                },
                header: {
                    backgroundColor: theme.colors.dark[6],
                    borderBottom: `1px solid ${theme.colors.dark[5]}`
                }
            })
        },

        TextInput: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    color: theme.colors.dark[0],
                    '&:focus': {
                        borderColor: theme.colors.blue[6]
                    }
                }
            })
        },

        PasswordInput: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    color: theme.colors.dark[0],
                    '&:focus': {
                        borderColor: theme.colors.blue[6]
                    }
                }
            })
        },

        Textarea: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    color: theme.colors.dark[0],
                    '&:focus': {
                        borderColor: theme.colors.blue[6]
                    }
                }
            })
        },

        Select: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    color: theme.colors.dark[0]
                },
                dropdown: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[5]
                },
                item: {
                    color: theme.colors.dark[0],
                    '&[data-selected]': {
                        backgroundColor: theme.colors.blue[6]
                    },
                    '&[data-hovered]': {
                        backgroundColor: theme.colors.dark[5]
                    }
                }
            })
        },

        Checkbox: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[7],
                    borderColor: theme.colors.dark[5],
                    '&:checked': {
                        backgroundColor: theme.colors.green[6],
                        borderColor: theme.colors.green[6]
                    }
                }
            })
        }
    }
});

export const lightTheme = createTheme({
    colorScheme: 'light',
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',

    colors: {
        gray: [
            '#F8F9FA', // lightest
            '#F1F3F4',
            '#E9ECEF',
            '#DEE2E6',
            '#CED4DA',
            '#ADB5BD',
            '#6C757D',
            '#495057',
            '#343A40',
            '#212529'  // darkest
        ],
        blue: [
            '#E7F5FF',
            '#D0EBFF',
            '#A5D8FF',
            '#74C0FC',
            '#4DABF7',
            '#339AF0',
            '#228BE6', // primary
            '#1C7ED6',
            '#1971C2',
            '#1864AB'
        ],
        green: [
            '#D3F9D8',
            '#B2F2BB',
            '#8CE99A',
            '#69DB7C',
            '#51CF66',
            '#40C057', // success
            '#37B24D',
            '#2F9E44',
            '#2B8A3E',
            '#237630'
        ],
        red: [
            '#FFE3E3',
            '#FFC9C9',
            '#FFA8A8',
            '#FF8787',
            '#FF6B6B',
            '#FA5252', // error
            '#F03E3E',
            '#E03131',
            '#C92A2A',
            '#A61E1E'
        ],
        yellow: [
            '#FFF9DB',
            '#FFF3BF',
            '#FFEC99',
            '#FFE066',
            '#FFD43B',
            '#FCC419', // warning
            '#FAB005',
            '#F59F00',
            '#F08C00',
            '#E67700'
        ]
    },

    components: {
        AppShell: {
            styles: (theme) => ({
                main: {
                    backgroundColor: theme.colors.gray[0],
                    color: theme.colors.gray[9],
                    transition: 'padding-left 300ms ease',
                    minHeight: '100vh',
                    padding: 0,
                },
                navbar: {
                    width: NAVBAR_WIDTH,
                    backgroundColor: theme.colors.blue[1],
                    boxShadow: theme.shadows.xl,
                    transition: 'transform 300ms ease',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 45,
                }
            })
        },

        Drawer: {
            styles: (theme) => ({
                drawer: {
                    backgroundColor: theme.white,
                    color: theme.colors.gray[9],
                    borderRight: `1px solid ${theme.colors.gray[3]}`,
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                },
                header: {
                    backgroundColor: theme.white,
                    borderBottom: `1px solid ${theme.colors.gray[3]}`
                }
            })
        },

        NavLink: {
            styles: (theme) => ({
                root: {
                    color: theme.colors.gray[7],
                    borderRadius: theme.radius.md,
                    margin: '2px 8px',
                    padding: '10px 12px',
                    fontWeight: 500,
                    '&[data-active]': {
                        backgroundColor: theme.colors.blue[6],
                        color: theme.white,
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: theme.colors.blue[7]
                        }
                    },
                    '&:hover:not([data-active])': {
                        backgroundColor: theme.colors.gray[1],
                        color: theme.colors.gray[9]
                    }
                }
            })
        },

        Accordion: {
            styles: (theme) => ({
                control: {
                    backgroundColor: theme.colors.gray[1],
                    '&:hover': {
                        backgroundColor: theme.colors.gray[6],
                    },
                    '&[data-active]': {
                        backgroundColor: theme.colors.blue[1],
                        color: theme.black,
                    },
                },
                content: {
                    backgroundColor: theme.white,
                },
            }),
        },

        Card: {
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[3],
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        borderColor: theme.colors.gray[4],
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                }
            })
        },

        Paper: {
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.white,
                    color: theme.colors.gray[9],
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }
            })
        },

        Modal: {
            styles: (theme) => ({
                content: {
                    backgroundColor: theme.white,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                },
                header: {
                    backgroundColor: theme.white,
                    borderBottom: `1px solid ${theme.colors.gray[3]}`
                }
            })
        },

        TextInput: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[3],
                    color: theme.colors.gray[9],
                    '&:focus': {
                        borderColor: theme.colors.blue[6],
                        boxShadow: `0 0 0 2px ${theme.colors.blue[1]}`
                    }
                }
            })
        },

        Textarea: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[3],
                    color: theme.colors.gray[9],
                    '&:focus': {
                        borderColor: theme.colors.blue[6],
                        boxShadow: `0 0 0 2px ${theme.colors.blue[1]}`
                    }
                }
            })
        },

        Select: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[3],
                    color: theme.colors.gray[9]
                },
                dropdown: {
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[3],
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                },
                item: {
                    color: theme.colors.gray[9],
                    '&[data-selected]': {
                        backgroundColor: theme.colors.blue[6],
                        color: theme.white
                    },
                    '&[data-hovered]': {
                        backgroundColor: theme.colors.gray[1]
                    }
                }
            })
        },

        Checkbox: {
            styles: (theme) => ({
                input: {
                    backgroundColor: theme.white,
                    borderColor: theme.colors.gray[4],
                    '&:checked': {
                        backgroundColor: theme.colors.green[6],
                        borderColor: theme.colors.green[6]
                    }
                }
            })
        },

    }
});

export const createTodoTheme = (colorScheme) => {
    return colorScheme === 'dark' ? darkTheme : lightTheme;
};