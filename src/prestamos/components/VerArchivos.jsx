import React, { useEffect, useState } from 'react'
import { useLoan } from '../hooks/useLoan';
import { getEnvVariables } from '../../helpers/getEnvVariables';
import { SquareArrowOutUpRight } from 'lucide-react';
const { VITE_API_URL } = getEnvVariables();

export const VerArchivos = ({ closeModal, prestamo }) => {
    const { getDoc, error, loading } = useLoan();
    const [archivos, setArchivos] = useState([])
    const fetchArchivos = async () => {
        const docs = await getDoc(prestamo.id);
        if (docs.ok) {
            setArchivos(docs.archivo);
        }

    }
    useEffect(() => {
        fetchArchivos();
    }, [])

    return (
        <>
            {archivos.map((archivo) => (
                <div key={archivo.id} className="flex justify-between items-center border-b border-gray-300 p-2">
                    <p>{archivo.nombre_archivo}</p>
                    <a
                        href={`${VITE_API_URL}/${archivo.ruta_archivo}`}
                        download={archivo.nombre_archivo}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                    >
                        <SquareArrowOutUpRight />
                    </a>
                </div>
            ))}
        </>
    )
}
