import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { LabeledInput } from '../../components/LabeledInput'
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { LoansTable } from '../components/PrestamoTable';
import { useLoan } from '../hooks/useLoan';
import { EditPrestamoModal } from '../components/EditPrestamoModal';
import { Modal } from '../../components/Modal';
import { useNavigate } from 'react-router';
import { formatDateWithDateFns } from '../../common/functions';
import { VerArchivos } from '../components/VerArchivos';
import { LoaderLocal } from '../../components/LoaderLocal';

export const ListadoPrestamosPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { getLoans, error, loading } = useLoan();
    const [prestamos, setPrestamos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10 });

    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (data) => {
        const payload = {
            ...data,
            page: meta.page,
            pageSize: meta.pageSize
        };
        const loans = await getLoans(payload);
        setPrestamos(loans.prestamos);
        setMeta(loans.meta);
    });
    const handleOpenModal = (prestamo) => {
        setIsModalOpen(true);
        setSelectedPrestamo(prestamo);
    }
    const handleUpdatePrestamo = (prestamo) => {
        setPrestamos((prev) => prev.map((p) => (p.id === prestamo.id ? { ...p, ...prestamo } : p)));
    }

    const onRedirect = () => {
        navigate('/prestamo/');
    }
    useEffect(() => {
        setValue("fecha_inicio", formatDateWithDateFns(new Date()));
        setValue("fecha_fin", formatDateWithDateFns(new Date()));
    }, []);

    const handlePageChange = async (newPage) => {
        const fecha_inicio = document.querySelector('input[name="fecha_inicio"]').value;
        const fecha_fin = document.querySelector('input[name="fecha_fin"]').value;
        const payload = {
            page: newPage,
            pageSize: meta.pageSize,
            fecha_inicio,
            fecha_fin,
        };
        const loans = await getLoans(payload);
        setPrestamos(loans.prestamos);
        setMeta(loans.meta);

    };

    return (
        <RegisterTableLayout title={"Listado de Prestamos"}>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <LoaderLocal />}
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white rounded-lg shadow">
                    <div>
                        <LabeledInput
                            label="Fecha de Inicio"
                            type="date"
                            name="fecha_inicio"
                            register={register}
                            require={true}
                            error={errors.fecha_inicio}
                            {...register("fecha_inicio", { required: 'La fecha es requerida' })}
                        />

                    </div>
                    <div>
                        <LabeledInput
                            label="Fecha de Fin"
                            type="date"
                            name="fecha_fin"
                            register={register}
                            require={true}
                            error={errors.fecha_fin}
                            {...register("fecha_fin", { required: 'La fecha es requerida' })}
                        />

                    </div>
                    <div>
                        <br />
                        <Button clase="!w-auto !bg-green-500 hover:!bg-green-600"
                            type="button"
                            onClick={onSubmit}
                        >
                            Buscar
                        </Button>
                    </div>
                    <div>
                        <br />
                        <Button clase="!w-auto bg-gray-500 hover:bg-gray-600"
                            type="button"
                            onClick={onRedirect}
                        >
                            Crear Prestamo
                        </Button>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-4">Prestamos</h2>
                <LoansTable loans={prestamos} meta={meta} openModal={handleOpenModal} onPageChange={handlePageChange} typeModal={setIsModalEdit} />
            </section>
            {/* Modal para Pagar Cuota */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={isModalEdit ? `Agregar documento` : `Archivos`}
                >{isModalEdit ? (
                    <EditPrestamoModal closeModal={setIsModalOpen} prestamo={selectedPrestamo} editLoan={handleUpdatePrestamo} />
                ) : (
                    <VerArchivos closeModal={setIsModalOpen} prestamo={selectedPrestamo} />
                )}

                </Modal>
            )}
        </RegisterTableLayout>

    )
}
