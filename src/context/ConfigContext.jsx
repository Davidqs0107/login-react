import { createContext, useContext, useEffect, useState } from 'react';
import { getConfiguracionRequest } from '../api/configuracion';
import { useAuth } from './AuthContex';

export const ConfigContext = createContext();

const DEFAULTS = { simboloMoneda: 'Bs.', moneda: 'BOB' };

export const ConfigProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [config, setConfig] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reset a defaults cuando el usuario cierra sesión, para que el próximo
        // usuario que entre no vea la config del anterior.
        if (!isAuthenticated) {
            setConfig(DEFAULTS);
            localStorage.removeItem('config');
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const { data } = await getConfiguracionRequest();
                if (data?.configuracion) {
                    const next = {
                        simboloMoneda: data.configuracion.simbolo_moneda ?? 'Bs.',
                        moneda: data.configuracion.moneda ?? 'BOB',
                    };
                    setConfig(next);
                    localStorage.setItem('config', JSON.stringify(next));
                }
            } catch (e) {
                console.error('Error cargando configuración', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuthenticated]);

    return (
        <ConfigContext.Provider value={{ ...config, loading, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const ctx = useContext(ConfigContext);
    if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
    return ctx;
};
