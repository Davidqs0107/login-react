import { CODIGOS_PAIS_COMUNES } from "../helpers/format";

/**
 * Select con códigos de país precargados. Pensado para integrarse con
 * react-hook-form: acepta `register`, `errors` y un `name` (por defecto 'codigo_pais').
 *
 * Props:
 *  - name:           nombre del campo (default 'codigo_pais')
 *  - register:       función register de react-hook-form
 *  - errors:         objeto errors (para mostrar mensaje)
 *  - defaultValue:   valor por defecto (default '+591')
 *  - label:          etiqueta visible
 *  - required:       si el campo es obligatorio
 */
export const SelectPais = ({
    name = "codigo_pais",
    register,
    errors,
    defaultValue = "+591",
    label = "Indicativo",
    required = false,
}) => {
    const registerProps = register
        ? register(name, {
              required: required ? "El indicativo es requerido" : false,
              pattern: { value: /^\+\d{1,4}$/, message: "Formato: +591" },
          })
        : {};

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                {...registerProps}
                defaultValue={defaultValue}
                className={`appearance-none rounded-none relative block w-full
                    px-3 py-2 border ${errors?.[name] ? "border-red-500" : "border-gray-300"}
                    placeholder-gray-500 text-gray-900 rounded-t-md
                    focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm`}
            >
                {CODIGOS_PAIS_COMUNES.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>
            {errors?.[name] && (
                <span className="text-red-500 text-sm mt-1">
                    {errors[name].message}
                </span>
            )}
        </div>
    );
};
