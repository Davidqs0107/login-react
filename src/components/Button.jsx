import React from 'react';

export const Button = ({
    children,
    clase = "",
    type = "button",
    onClick,
    disabled = false,
    ...props
}) => {
    const claseString = `group relative 
        w-full flex justify-center py-2 px-4 
        border border-transparent text-sm font-medium 
        rounded-md text-white bg-indigo-600 
        hover:bg-indigo-700 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed 
        ${clase}`;

    return (
        <button
            className={claseString}
            type={type}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};