export const Button = ({
    children,
    clase = '',
    variant = 'primary',
    type = 'button',
    ...props
}) => {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    };
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center rounded-md border border-transparent
                px-4 py-2 text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant] || variants.primary} ${clase}`}
            {...props}
        >
            {children}
        </button>
    );
};
