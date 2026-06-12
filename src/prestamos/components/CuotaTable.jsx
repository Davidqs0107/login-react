import React from 'react';

export const CuotaTable = ({ cuotas }) => {
    const totalPagar = cuotas.reduce((sum, c) => sum + (c.total || 0), 0);
    const totalInteres = cuotas.reduce((sum, c) => sum + (c.interes || 0), 0);

    return (
        <div className="mt-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Capital</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Interés</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {cuotas.map((cuota, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 text-center">{index + 1}</td>
                                <td className="px-4 py-2">{cuota.fecha}</td>
                                <td className="px-4 py-2 text-right">${(cuota.capital || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 text-right">${(cuota.interes || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 text-right font-bold">${(cuota.total || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 bg-blue-50 p-4 rounded flex flex-col sm:flex-row justify-between gap-4">
                <div className="bg-white p-3 rounded shadow">
                    <span className="font-bold">Total a pagar:</span>
                    <span className="ml-2 text-lg text-blue-600">${totalPagar.toFixed(2)}</span>
                </div>
                <div className="bg-white p-3 rounded shadow">
                    <span className="font-bold">Total intereses:</span>
                    <span className="ml-2 text-lg text-orange-600">${totalInteres.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};