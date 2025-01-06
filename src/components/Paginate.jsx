import React from 'react'

export const Paginate = ({ meta, onPageChange }) => {
    const { page, totalPages } = meta;
    return (
        <div className="flex justify-center mt-4">
            <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
                Anterior
            </button>
            <span className="px-4 py-2">{`${page} de ${totalPages || 1}`}</span>
            <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
    )
}
