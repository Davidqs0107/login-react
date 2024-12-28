export const formFields = [
    {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        validation: {
            required: 'El nombre es requerido'
        }
    },
    {
        name: 'apellido',
        label: 'Apellido',
        type: 'text',
        required: true,
        validation: {
            required: 'El apellido es requerido'
        }
    },
    {
        name: 'direccion',
        label: 'Direccion',
        type: 'text'
    },
    {
        name: 'ci',
        label: 'CI',
        type: 'text'
    },
    {
        name: 'telefono',
        label: 'Teléfono',
        type: 'text'
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        validation: {
            required: 'El email es requerido',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
            }
        }
    },
];