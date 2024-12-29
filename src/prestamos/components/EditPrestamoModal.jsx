import React from 'react'
import { Button } from '../../components/Button'
import { useLoan } from '../hooks/useLoan';
import Swal from 'sweetalert2';

export const EditPrestamoModal = ({ closeModal, prestamo, editLoan }) => {
    const { updateLoan } = useLoan();
    const { documento } = prestamo;

    const onSubmit = async () => {
        const doc = document.querySelector('textarea[name="documento"]').value;
        const loan = await updateLoan(prestamo.id, { documento: doc });
        if (loan) {
            prestamo.documento = doc;
            editLoan(prestamo);
            Swal.fire({
                title: "Documento actualizado",
                text: "El documento ha sido actualizado exitosamente",
                icon: "success"
            });
            closeModal(false);
        }
        console.log(doc)
    }
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
            <textarea
                name='documento'
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Ingrese el Documento"
                defaultValue={documento}
            />
            <div className="flex justify-end gap-4">
                <Button
                    clase="!bg-gray-500 hover:!bg-gray-600 !text-white !font-bold py-2 px-4 !rounded"
                    onClick={() => closeModal(false)}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onSubmit}
                    clase="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Aceptar
                </Button>
            </div>
        </div>
    )
}
