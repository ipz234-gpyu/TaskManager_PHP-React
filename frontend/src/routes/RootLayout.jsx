import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { NAVBAR_WIDTH } from '../utils/theme.js';

export default function RootLayout() {
    const [pinned, setPinned] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const hoverTimeoutRef = useRef(null);
    const isHoveringRef = useRef(false);

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    const showNavbar = () => {
        if (!pinned) {
            clearTimeout(hoverTimeoutRef.current);
            isHoveringRef.current = true;
            hoverTimeoutRef.current = setTimeout(() => {
                if (isHoveringRef.current) setExpanded(true);
            }, 400);
        }
    };

    const hideNavbar = () => {
        if (!pinned) {
            isHoveringRef.current = false;
            hoverTimeoutRef.current = setTimeout(() => {
                if (!isHoveringRef.current) setExpanded(false);
            }, 600);
        }
    };

    const cancelHideNavbar = () => {
        clearTimeout(hoverTimeoutRef.current);
        isHoveringRef.current = true;
    };

    return (
        <AppShell
            padding={0}
            withBorder={false}
            styles={{
                main: {
                    paddingLeft: pinned || expanded ? NAVBAR_WIDTH : 0,
                },
                navbar: {
                    transform: pinned || expanded ? 'translateX(0)' : `translateX(-100%)`,
                }
            }}
        >
            <AppShell.Navbar
                onMouseEnter={cancelHideNavbar}
                onMouseLeave={hideNavbar}
            >
                <Navbar
                    pinned={pinned}
                    setPinned={setPinned}
                    isHoveringRef={isHoveringRef}
                    setExpanded={setExpanded}
                />
            </AppShell.Navbar>

            {!pinned && (
                <div
                    className="fixed top-0 left-0 h-full w-3 z-40 cursor-pointer hover:w-4 transition-all duration-200"
                    onMouseEnter={showNavbar}
                    onMouseLeave={hideNavbar}
                    style={{
                        background: 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(59,130,246,0.4))',
                        backdropFilter: 'blur(4px)',
                        transition: 'width 100ms ease, opacity 200ms ease',
                        opacity: expanded ? 0 : 1,
                    }}
                />
            )}

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}