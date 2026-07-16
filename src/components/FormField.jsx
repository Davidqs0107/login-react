import { forwardRef } from 'react';

/** Clase compartida de todos los campos de formulario (input, select, textarea). */
export const fieldClass = (error) =>
    `block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400
     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
     disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
     ${error ? 'border-red-500' : 'border-gray-300'}`;

/** Wrapper: label + asterisco de requerido + ayuda + error, uniforme para todo campo. */
export const Field = ({ label, required = false, error = null, help = null, children }) => (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        {label && (
            <span>
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>
        )}
        {children}
        {help && !error && <span className="text-xs font-normal text-gray-500">{help}</span>}
        {error && <span className="text-sm font-normal text-red-500">{error.message || error}</span>}
    </label>
);

// forwardRef: React extrae `ref` del spread de register() en el call-site; sin forwardRef se descarta
// y react-hook-form nunca recibe el elemento.
export const LabeledSelect = forwardRef(({ label, require = false, error = null, help = null, clase = '', children, ...props }, ref) => (
    <Field label={label} required={require} error={error} help={help}>
        <select {...props} ref={ref} className={`${fieldClass(error)} ${clase}`}>
            {children}
        </select>
    </Field>
));
LabeledSelect.displayName = 'LabeledSelect';

export const LabeledTextarea = forwardRef(({ label, require = false, error = null, help = null, clase = '', ...props }, ref) => (
    <Field label={label} required={require} error={error} help={help}>
        <textarea {...props} ref={ref} className={`${fieldClass(error)} ${clase}`} />
    </Field>
));
LabeledTextarea.displayName = 'LabeledTextarea';
