import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, renewToken } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const mapUserFunction = (user) => {
        const usuario = {
            id: user.id,
            name: user.nombre,
            email: user.email,
            empresa_id: user.empresa_id
        }
        setUser(usuario);
        setIsAuthenticated(true);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('token', user.token);
    }
    const signup = async (values) => {
        try {
            const { data } = await registerRequest(values);
            mapUserFunction(data.usuario);

        } catch (error) {
            if (error.response.data.errors) {
                const { email, password, name } = error.response.data.errors;
                const msg = [];
                if (email) {
                    msg.push(email.msg);
                }
                if (password) {
                    msg.push(password.msg);
                }
                if (name) {
                    msg.push(name.msg);
                }
                return setErrors(msg);
            }
            setErrors(error.response.data.msg);
        }

    };

    const singIn = async (value) => {
        try {
            const { data } = await loginRequest(value);
            mapUserFunction(data.usuario);

        } catch (error) {
            console.log(error);
            if (error.response?.data?.errors) {
                const { email, password } = error.response.data.errors;
                const msg = [];
                if (email) {
                    msg.push(email.msg);
                }
                if (password) {
                    msg.push(password.msg);
                }
                return setErrors(msg);
            }
            setErrors([error.response.data.msg]);
        }
    };
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
        }
        try {
            const { data } = await renewToken();
            const user = localStorage.getItem('usuario');
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            setUser(JSON.parse(user));
            setIsLoading(false);
        } catch (error) {
            localStorage.clear();
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    }
    return (
        <AuthContext.Provider value={{
            singIn,
            signup,
            user,
            isAuthenticated,
            errors,
            checkAuthToken,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}