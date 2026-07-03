import React, { useState } from 'react';
import { RegisterTableLayout } from '../../layout/RegisterTableLayout';
import { CuotaTable } from '../components/CuotaTable';
import { Button } from '../../components/Button';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { es } from 'date-fns/locale';

// Cada frecuencia define cómo calcular la fecha de la cuota `i` (1-indexada),
// espejando exactamente la lógica del backend (calcularFechaCuota).
const FREQUENCIES = {
    diario: { label: 'Diario', add: (d, i) => addDays(d, i) },
    semanal: { label: 'Semanal', add: (d, i) => addWeeks(d, i) },
    quincenal: { label: 'Quincenal', add: (d, i) => addDays(d, i * 15) },
    mensual: { label: 'Mensual', add: (d, i) => addMonths(d, i) },
    trimestral: { label: 'Trimestral', add: (d, i) => addMonths(d, i * 3) },
    semestral: { label: 'Semestral', add: (d, i) => addMonths(d, i * 6) },
    anual: { label: 'Anual', add: (d, i) => addYears(d, i) }
};

export const CalculadoraPage = () => {
    const [monto, setMonto] = useState('');
    const [tasa, setTasa] = useState(10);
    const [frecuencia, setFrecuencia] = useState('mensual');
    const [numCuotas, setNumCuotas] = useState('');
    const [tipo, setTipo] = useState('cuota');
    const [cuotas, setCuotas] = useState([]);
    const [error, setError] = useState('');

    const calcular = () => {
        setError('');
        const principal = parseFloat(monto);
        const tasaInteres = parseFloat(tasa) / 100;
        const num = parseInt(numCuotas);
        const freq = FREQUENCIES[frecuencia];

        if (!principal || principal < 100) {
            setError('Ingrese un monto válido (mínimo 100)');
            return;
        }
        if (!num || num < 1 || num > 52) {
            setError('Ingrese un número de cuotas válido (1-52)');
            return;
        }
        if (!freq) {
            setError('Seleccione una frecuencia de pago');
            return;
        }

        const cuotasCalculadas = [];
        const fechaInicio = new Date();

        if (tipo === 'fijo') {
            // Interés plano por periodo (idéntico al backend calcularCuotasInteresFijo)
            const interesPorCuota = parseFloat((principal * tasaInteres).toFixed(2));

            for (let i = 0; i < num; i++) {
                const fecha = freq.add(fechaInicio, i + 1);
                const esUltima = i === num - 1;
                cuotasCalculadas.push({
                    fecha: format(fecha, 'dd/MM/yyyy'),
                    capital: esUltima ? principal : 0,
                    interes: interesPorCuota,
                    total: esUltima ? parseFloat((principal + interesPorCuota).toFixed(2)) : interesPorCuota
                });
            }
        } else {
            // Cuota constante (idéntico al backend calcularCuotas): la última cuota absorbe el residuo
            const montoTotal = principal * (1 + tasaInteres);
            const montoCuota = parseFloat((montoTotal / num).toFixed(2));
            const capitalPorCuota = parseFloat((principal / num).toFixed(2));

            let acumulado = 0;
            for (let i = 0; i < num; i++) {
                const fecha = freq.add(fechaInicio, i + 1);
                const esUltima = i === num - 1;

                const total = esUltima ? parseFloat((montoTotal - acumulado).toFixed(2)) : montoCuota;
                if (!esUltima) acumulado += montoCuota;

                const capital = esUltima
                    ? parseFloat((principal - capitalPorCuota * (num - 1)).toFixed(2))
                    : capitalPorCuota;
                const interes = parseFloat((total - capital).toFixed(2));

                cuotasCalculadas.push({
                    fecha: format(fecha, 'dd/MM/yyyy'),
                    capital,
                    interes,
                    total
                });
            }
        }

        setCuotas(cuotasCalculadas);
    };

    const handleReset = () => {
        setMonto('');
        setTasa(10);
        setFrecuencia('mensual');
        setNumCuotas('');
        setTipo('cuota');
        setCuotas([]);
        setError('');
    };

    return (
        <RegisterTableLayout title="Calculadora de Préstamos">
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 mb-6">
                    Simula tu préstamo y conoce el monto de cada cuota antes de comprometerte.
                    Esta calculadora es solo una referencia y no constituye una oferta oficial.
                </p>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            min="100"
                            placeholder="Ej: 10000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de interés (%)</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={tasa}
                            onChange={(e) => setTasa(e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de pago</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={frecuencia}
                            onChange={(e) => setFrecuencia(e.target.value)}
                        >
                            {Object.entries(FREQUENCIES).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de cuotas</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={numCuotas}
                            onChange={(e) => setNumCuotas(e.target.value)}
                            min="1"
                            max="52"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de préstamo</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="tipo"
                                value="cuota"
                                checked={tipo === 'cuota'}
                                onChange={() => setTipo('cuota')}
                                className="mr-2"
                            />
                            <span className="text-sm">Cuota constante (capital + interés distribuido)</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="tipo"
                                value="fijo"
                                checked={tipo === 'fijo'}
                                onChange={() => setTipo('fijo')}
                                className="mr-2"
                            />
                            <span className="text-sm">Fijo (interés simple, capital al final)</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={calcular}
                        clase="!bg-blue-500 hover:!bg-blue-600"
                    >
                        Calcular
                    </Button>
                    <Button
                        onClick={handleReset}
                        clase="!bg-gray-500 hover:!bg-gray-600"
                    >
                        Limpiar
                    </Button>
                </div>

                {cuotas.length > 0 && <CuotaTable cuotas={cuotas} />}
            </div>
        </RegisterTableLayout>
    );
};