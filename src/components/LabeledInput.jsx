import React from 'react';

export const LabeledInput = React.forwardRef(({
    name,
    label,
    require = false,
    clase = "",
    error = null,
    register,
    disabled = false,
    ...props
}, ref) => {
    const registerProps = register ? register(name, { required: require }) : {};
    return (
        <div className="flex flex-col">
            <label>
                {label}
                <input
                    disabled={disabled}
                    {...registerProps}
                    {...props}
                    ref={ref}
                    className={`appearance-none rounded-none relative block w-full 
                        px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
                        placeholder-gray-500 text-gray-900 rounded-t-md 
                        focus:outline-none focus:ring-indigo-500 
                        focus:border-indigo-500 focus:z-10 sm:text-sm ${clase}`}
                />
            </label>
            {error && (
                <span className="text-red-500 text-sm mt-1">{error.message}</span>
            )}
        </div>
    );
});

// Añadir un displayName para mejorar la depuración
LabeledInput.displayName = 'LabeledInput';