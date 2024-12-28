export const LabeledInputAuth = ({
    name,
    register,
    label,
    require = false,
    clase,
    error = null,
    ...props
}) => {

    return (
        <div className="flex flex-col">
            <label>
                {label}
                <input
                    {...register(name, { required: require })}
                    {...props}
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
    )
};