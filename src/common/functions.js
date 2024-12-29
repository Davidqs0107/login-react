import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz'
const timeZone = "America/La_Paz";
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
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