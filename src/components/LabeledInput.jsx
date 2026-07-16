import { forwardRef } from 'react';
import { Field, fieldClass } from './FormField';

// forwardRef: con la API nueva (<LabeledInput {...register(...)} />) React extrae `ref` del spread
// en el call-site; sin forwardRef se descarta y react-hook-form nunca recibe el elemento.
export const LabeledInput = forwardRef(({
    name,
    label,
    require = false,
    clase = '',
    error = null,
    help = null,
    register,
    disabled = false,
    ...props
}, ref) => {
    // Compat: API vieja pasaba register como prop. La API nueva hace spread de register() desde afuera.
    const registerProps = register ? register(name, { required: require }) : {};
    return (
        <Field label={label} required={require} error={error} help={help}>
            <input
                name={name}
                disabled={disabled}
                {...registerProps}
                {...props}
                ref={ref}
                className={`${fieldClass(error)} ${clase}`}
            />
        </Field>
    );
});
LabeledInput.displayName = 'LabeledInput';
