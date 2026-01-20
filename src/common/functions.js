import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz'
const timeZone = "America/La_Paz";
export const formatDate = (date) => {
    if (!date) return '';
    // Extraer solo la fecha sin convertir zonas horarias
    // Esto evita que UTC-4 reste un día al convertir
    const fechaSolo = date.split("T")[0]; // "2026-01-20"
    const [año, mes, dia] = fechaSolo.split("-");
    return `${dia}/${mes}/${año}`; // "20/01/2026"
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