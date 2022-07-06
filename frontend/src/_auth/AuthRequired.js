import React from 'react'
import { Navigate } from 'react-router';

import { useAuth } from './AuthContext'

export default function AuthRequired({children, login_route}) {
    const auth = useAuth();

    if (auth.user === undefined) return <></>;
    return auth.user !== null ?
        children :
        <Navigate to={login_route} />
}