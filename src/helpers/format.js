// Lista de prefijos que aparecen en el datalist (los más comunes LATAM/ES/MX).
export const CODIGOS_PAIS_COMUNES = ['+591', '+52', '+54', '+51', '+56', '+57', '+593', '+58', '+1', '+34', '+55'];

// Símbolos sugeridos en el datalist de Configuración.
export const SIMBOLOS_COMUNES = ['Bs.', '$', 'S/.', 'RD$', 'CLP$', '€', '£', '¥'];

/**
 * Formatea un monto con el símbolo de la empresa.
 * Mantiene el formato original (sin separador de miles) para no romper el estilo.
 */
export const formatMoney = (n, simbolo = 'Bs.') =>
    `${simbolo} ${parseFloat(n || 0).toFixed(2)}`;

/**
 * Formatea un teléfono con su indicativo.
 * Si no hay teléfono, devuelve string vacío.
 */
export const formatPhone = (telefono, codigoPais = '+591') => {
    if (!telefono) return '';
    return `${codigoPais} ${telefono}`;
};

/**
 * Helper para código no-React (PDFs, scripts). Lee el símbolo persistido
 * por ConfigContext en localStorage. Devuelve 'Bs.' si no está.
 */
export const getSimboloMoneda = () => {
    try {
        const cfg = JSON.parse(localStorage.getItem('config') || '{}');
        return cfg.simboloMoneda || 'Bs.';
    } catch {
        return 'Bs.';
    }
};
