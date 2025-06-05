import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../utils/cookieHandlers';
import { Center, Loader } from '@mantine/core';
import { useRefreshMutation } from '../features/auth/authApi';

export default function RequireAuth() {
    const authenticating = useSelector((state) => state.auth.authenticating);
    const expiresAt = useSelector((state) => state.auth.expiresAt);
    const refreshToken = getCookie('refreshToken');

    const [refresh, { isLoading: isRefreshing, error }] = useRefreshMutation();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            if (!refreshToken) {
                setCheckingAuth(false);
                return;
            }

            if (!authenticating || expiresAt < Date.now()) {
                try {
                    await refresh().unwrap();
                } catch {
                    // Optional: log error if needed
                }
            }

            setCheckingAuth(false);
        };

        authenticate();
    }, [authenticating, expiresAt, refreshToken]);

    if (checkingAuth || isRefreshing) {
        return (
            <Center className="h-screen">
                <Loader color="blue" size="xl" variant="dots" />
            </Center>
        );
    }

    const unauthorized = !authenticating || error;
    return unauthorized ? <Navigate to="/login" replace /> : <Outlet />;
}