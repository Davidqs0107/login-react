export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};
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