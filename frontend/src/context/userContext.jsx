import React, { useEffect, useState, useContext } from "react";
import getApiURL from "../utils/getApiURl";
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext(null);
export const useUserContext = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(user)
    const navigate = useNavigate();
    const fetchUser = async () => {
        setLoading(true)
        try {
            const response = await fetch(getApiURL('/api/auth/user'), {
                credentials: 'include'
            });
            if (!response.ok) {
                navigate('/login');
                return;
            }
            const json = await response.json();
            setUser(json.data);
        }
        catch (error) {
            console.error('Error fetching user:', error);
            setError(error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, [])
    return (
        <UserContext.Provider value={{ user, setUser, loading, error, fetchUser }}>
            {children}
        </UserContext.Provider>
    );

}