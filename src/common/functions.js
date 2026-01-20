import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz'
const timeZone = "America/La_Paz";
export const formatDate = (date) => {
    if (!date) return '';
    // Formatear la fecha en la zona horaria de Bolivia para evitar problemas con UTC
    return formatInTimeZone(date, timeZone, 'dd/MM/yyyy');
};
export const formatDateWithDateFns = (date) => {
    const formattedDate = formatInTimeZone(date, timeZone, 'yyyy-MM-dd')
    return formattedDate;
}
export const formtaTipoPrestamo = (tipo) => {
    return tipo === 'fijo' ? 'Interes fijo' : 'Capital + Interes';
}

export const userLocalStorage = {
    setUser: (user) => {
        localStorage.setItem('usuario', JSON.stringify(user));
    },
    getUser: () => {
        return JSON.parse(localStorage.getItem('usuario'));
    },
    removeUser: () => {
        localStorage.removeItem('usuario');
    }
}