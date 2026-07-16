import { SIMBOLOS_COMUNES } from "../helpers/format";

/**
 * Select con símbolos de moneda precargados. Pensado para formularios controlados
 * (no usa react-hook-form, recibe `value` y `onChange`).
 *
 * Props:
 *  - value:      valor actual
 *  - onChange:   handler (recibe el evento del select)
 *  - name:       name del input
 *  - id:         id del input
 *  - className:  clases extra
 */
export const SelectMoneda = ({
    value,
    onChange,
    name = "simbolo_moneda",
    id = "simbolo_moneda",
    className = "w-full border border-gray-300 rounded-md p-2",
}) => {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={className}
        >
            {SIMBOLOS_COMUNES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    );
};
