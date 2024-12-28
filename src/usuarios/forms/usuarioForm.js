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
    {
        name: 'password',
        label: 'Password',
        type: 'text',
        required: true,
        validation: {
            required: 'La contraseña es requerida',
            minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    }
];