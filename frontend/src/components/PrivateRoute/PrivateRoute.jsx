import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import Loading from '../Loading/Loading';
export const PrivateRoute = ({ children }) => {
    const { user, loading } = useUserContext();
    if (loading) {
        return <Loading />;
    }
    return user ? children : <Navigate to="/login" />;

}