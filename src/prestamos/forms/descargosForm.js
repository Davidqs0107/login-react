export const formFields = [
    {
        name: 'monto',
        step: '0.01',
        label: 'Monto',
        type: 'number',
        required: true,
        validation: {
            required: 'El Monto es requerido'
        }
    },
    {
        name: 'nota',
        label: 'Nota',
        type: 'text',
        required: false,

    }
];