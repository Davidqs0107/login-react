import React, { useState } from 'react';
import { RegisterTableLayout } from '../../layout/RegisterTableLayout';
import { usePagosPage } from '../hooks/usePagosPage';
import { LoaderLocal } from '../../components/LoaderLocal';
import { Button } from '../../components/Button';
import { Paginate } from '../../components/Paginate';
import { User, Hash, Calendar, Search, X } from 'lucide-react';

export const PagosPage = () => {
    const {
        loading,
        error,
        results,
        resultType,
        clienteResults,
        meta,
        searchByCliente,
        searchCuotasByCliente,
        searchByCuotaId,
        searchByFecha,
        clearResults
    } = usePagosPage();

    const [searchType, setSearchType] = useState('cliente');
    const [clienteQuery, setClienteQuery] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [cuotaId, setCuotaId] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [page, setPage] = useState(1);

    const handleClienteInputChange = async (query) => {
        setClienteQuery(query);
    };

    const handleClienteSearch = async (query) => {
        if (query.length >= 2) {
            await searchByCliente(query);
        }
    };

    const handleSelectCliente = (cliente) => {
        setSelectedCliente(cliente);
        setClienteQuery(`${cliente.nombre} ${cliente.apellido}`);
        setClienteResults([]);
        searchCuotasByCliente(cliente.id);
    };

    const setClienteResults = (results) => {
        // This is handled internally by the hook's clienteResults
    };

    const handleSearch = async (pageNum = 1) => {
        setPage(pageNum);
        switch (searchType) {
            case 'cliente':
                if (selectedCliente) {
                    await searchCuotasByCliente(selectedCliente.id);
                }
                break;
            case 'cuota':
                if (cuotaId) {
                    await searchByCuotaId(cuotaId);
                }
                break;
            case 'fecha':
                if (fechaInicio && fechaFin) {
                    await searchByFecha(fechaInicio, fechaFin, pageNum, meta.pageSize);
                }
                break;
        }
    };

    const handlePageChange = (newPage) => {
        handleSearch(newPage);
    };

    const handleClear = () => {
        setClienteQuery('');
        setCuotaId('');
        setFechaInicio('');
        setFechaFin('');
        setSelectedCliente(null);
        clearResults();
    };

    const getResultLabel = () => {
        switch (resultType) {
            case 'cliente':
                return 'Cuotas pendientes del cliente';
            case 'cuota':
                return 'Detalle de cuota';
            case 'pagos':
                return 'Pagos en el período';
            default:
                return 'Resultados';
        }
    };

    return (
        <RegisterTableLayout title="Pagos">
            {error && (
                <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            {loading && <LoaderLocal />}

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => { setSearchType('cliente'); handleClear(); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${searchType === 'cliente' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        <User size={16} /> Por Cliente
                    </button>
                    <button
                        onClick={() => { setSearchType('cuota'); handleClear(); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${searchType === 'cuota' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        <Hash size={16} /> Por Cuota
                    </button>
                    <button
                        onClick={() => { setSearchType('fecha'); handleClear(); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${searchType === 'fecha' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        <Calendar size={16} /> Por Fecha
                    </button>
                </div>

                {searchType === 'cliente' && (
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Buscar cliente por nombre o CI..."
                            className="w-full border p-2 rounded"
                            value={clienteQuery}
                            onChange={(e) => handleClienteInputChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleClienteSearch(e.target.value)}
                        />
                        {clienteResults.length > 0 && (
                            <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-60 overflow-y-auto">
                                {clienteResults.map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                        onClick={() => handleSelectCliente(c)}
                                    >
                                        <span className="font-medium">{c.nombre} {c.apellido}</span>
                                        <span className="text-gray-500 ml-2">- CI: {c.ci}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {searchType === 'cuota' && (
                    <div className="mb-4">
                        <input
                            type="number"
                            placeholder="Ingrese ID de cuota"
                            className="w-full border p-2 rounded"
                            value={cuotaId}
                            onChange={(e) => setCuotaId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                )}

                {searchType === 'fecha' && (
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Desde</label>
                            <input
                                type="date"
                                className="w-full border p-2 rounded"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Hasta</label>
                            <input
                                type="date"
                                className="w-full border p-2 rounded"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        onClick={handleSearch}
                        clase="!bg-green-500 hover:!bg-green-600"
                        disabled={loading}
                    >
                        <Search size={16} className="inline mr-1" /> Buscar
                    </Button>
                    <Button
                        onClick={handleClear}
                        clase="!bg-gray-500 hover:!bg-gray-600"
                    >
                        <X size={16} className="inline mr-1" /> Limpiar
                    </Button>
                </div>
            </div>

            {results.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-4">{getResultLabel()}</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {resultType === 'pagos' && (
                                        <>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID Pago</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cuota #</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        </>
                                    )}
                                    {(resultType === 'cliente' || resultType === 'cuota') && (
                                        <>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pagado</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {resultType === 'pagos' && results.map((pago) => (
                                    <tr key={pago.id}>
                                        <td className="px-4 py-2">{pago.id}</td>
                                        <td className="px-4 py-2">{pago.fecha_pago}</td>
                                        <td className="px-4 py-2">{pago.cliente_nombre} {pago.cliente_apellido}</td>
                                        <td className="px-4 py-2">{pago.numero_cuota}</td>
                                        <td className="px-4 py-2">${parseFloat(pago.monto).toFixed(2)}</td>
                                        <td className="px-4 py-2">{pago.tipo_pago || '-'}</td>
                                    </tr>
                                ))}
                                {(resultType === 'cliente' || resultType === 'cuota') && results.map((cuota) => {
                                    const saldo = parseFloat(cuota.monto) - parseFloat(cuota.monto_pagado || 0);
                                    return (
                                        <tr key={cuota.id}>
                                            <td className="px-4 py-2">{cuota.numero_cuota}</td>
                                            <td className="px-4 py-2">{cuota.fecha_pago}</td>
                                            <td className="px-4 py-2">${parseFloat(cuota.monto).toFixed(2)}</td>
                                            <td className="px-4 py-2">${parseFloat(cuota.monto_pagado || 0).toFixed(2)}</td>
                                            <td className="px-4 py-2">${saldo.toFixed(2)}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    cuota.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                                                    cuota.estado === 'parcial' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {cuota.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                {cuota.estado !== 'pagada' && (
                                                    <Button clase="!bg-blue-500 hover:!bg-blue-600 text-white text-xs py-1 px-3">
                                                        Pagar
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {resultType === 'pagos' && meta.totalPages > 1 && (
                        <Paginate meta={meta} onPageChange={handlePageChange} />
                    )}
                </div>
            )}

            {!loading && results.length === 0 && resultType === null && (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    Seleccione un tipo de búsqueda y realice una consulta
                </div>
            )}
        </RegisterTableLayout>
    );
};