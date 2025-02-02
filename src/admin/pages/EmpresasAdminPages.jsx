import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { useAdmin } from '../hooks/useAdmin';
import { useForm } from 'react-hook-form';
import { LabeledInput } from '../../components/LabeledInput';
import { Button } from '../../components/Button';
import { formatDateWithDateFns } from '../../common/functions';
import { EmpresaAdminTable } from '../components/EmpresaAdminTable';
import { Paginate } from '../../components/Paginate';
import { Modal } from '../../components/Modal';
import { EditEmpresaPlanModal } from '../components/EditEmpresaPlanModal';
import { EmpresasUsuariosModal } from '../components/EmpresasUsuariosModal';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';

export const EmpresasAdminPages = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { getEmpresasAdmin, getEmpresasByName, getPlanes, loading, error } = useAdmin();
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState({})
    const [planes, setPlanes] = useState([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, totalPages: 1 });
    const [modalUsuario, setModalUsuario] = useState({ isModalUsuario: false, title: 'Cambiar plan' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    /*
    cargar empresas
    */

    const handleSearchOnEnter = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.length > 1) {

                const result = await getEmpresasByName(searchTerm);
                if (result) {
                    console.log(result)
                    setEmpresas(result.empresas);
                    setMeta(result.meta);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La busqueda debe tener al menos 2 caracteres',
                })
            }
            setSearchTerm('');
        }
    };
    const onSubmit = handleSubmit(async (data) => {
        const payload = {
            ...data,
            page: meta.page,
            pageSize: meta.pageSize
        };
        const result = await getEmpresasAdmin(payload);
        if (result) {
            setEmpresas(result.empresas);
            setMeta(result.meta);
        }
    });
    const handlePageChange = async (newPage) => {
        const fecha_inicio = document.querySelector('input[name="fecha_inicio"]').value;
        const fecha_fin = document.querySelector('input[name="fecha_fin"]').value;
        const payload = {
            page: newPage,
            pageSize: meta.pageSize,
            fecha_inicio,
            fecha_fin,
        };
        const result = await getEmpresasAdmin(payload);
        if (result) {
            setEmpresas(result.empresas);
            setMeta(result.meta);
        }

    };
    // cargar planes

    const handlePlanes = async () => {
        const result = await getPlanes();
        if (result) {
            setPlanes(result.planes);
        }
    }
    const handleUpdateEmpresa = (payload) => {
        console.log(payload)
        setEmpresas((prev) => prev.map((c) => {
            if (c.id === selectedEmpresa.id) {
                console.log(c)
                return { ...c, ...payload };
            }
            return c;
            // (c.id === selectedEmpresa.id ? { ...c, ...payload } : c)
        }));

    }

    const handleModal = (modalUsuario) => {
        setModalUsuario(modalUsuario);
        setIsModalOpen(true);
    }
    useEffect(() => {
        setValue("fecha_inicio", formatDateWithDateFns(new Date()));
        setValue("fecha_fin", formatDateWithDateFns(new Date()));
        handlePlanes();
    }, []);
    return (
        <RegisterTableLayout title='Empresas'>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <p>Cargando...</p>}
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
                </div>
            </section>
            <section>
                {/* Contenedor flexible para alinear el título y el input */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Empresas</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar empresa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchOnEnter}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <EmpresaAdminTable empresas={empresas} openModal={handleModal} selectedEmpresa={setSelectedEmpresa} />
                <Paginate meta={meta} onPageChange={handlePageChange} />
            </section>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalUsuario.title}>
                    {modalUsuario.isModalUsuario ? <EmpresasUsuariosModal empresa={selectedEmpresa} />
                        : <EditEmpresaPlanModal closeModal={setIsModalOpen} planes={planes} empresa={selectedEmpresa} handleUpdateEmpresa={handleUpdateEmpresa} />}
                </Modal>
            )}
        </RegisterTableLayout>
    )
}
