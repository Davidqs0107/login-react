import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { DescargosTable } from '../components/DescargosTable'
import { Paginate } from '../../components/Paginate';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContex';
import { useForm } from 'react-hook-form';
import { LabeledInput } from '../../components/LabeledInput';
import { Button } from '../../components/Button';
import { LoaderLocal } from '../../components/LoaderLocal';
import { useDescargos } from '../hooks/useDescargos.js';
import { formatDateWithDateFns } from '../../common/functions.js';
import { roles } from '../../common/constans.js';
import { DescargosRegistroCobrador } from '../components/DescargosRegistroCobrador.jsx';
import Swal from 'sweetalert2';

export const DescargoPage = () => {
    const { user } = useAuth();
    const { getDescargos, getDescargosByUser, aprobarDescargo, error, loading } = useDescargos();
    const { register, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm();

    const [descargos, setDescargos] = useState([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchOnEnter = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTerm.length > 2) {

                fechDescargos();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "La busqueda debe tener al menos 3 caracteres",
                    icon: "error"
                });
            }
        }
    }
    const handlePageChange = async (page) => {
        setMeta((prev) => ({ ...prev, page }));
        fechDescargos(page);
    }

    const onSubmit = async () => {

        fechDescargos();
    };

    const fechDescargos = async (page = 1) => {
        const data = getValues();
        const payload = {
            ...data,
            page: page,
            pageSize: meta.pageSize,
            searchTerm
        }
        const result = user.rol === roles.Admin ? await getDescargos(payload) : await getDescargosByUser(payload);
        setDescargos(result.descargos);
        setMeta(result.meta);
    }

    const handleAprobar = async (descargo) => {
        const result = await aprobarDescargo(descargo);
        if (result) {
            Swal.fire({
                title: "Descargo aprobado",
                text: "El descargo ha sido aprobado exitosamente",
                icon: "success"
            });
            // setClients((prev) => prev.map((c) => (c.id === selectedClient.id ? { ...c, ...payload } : c)));

            setDescargos((prev) => prev.map((d) => (d.id === descargo.id ? { ...d, estado: 'aprobado' } : d)));
            // fechDescargos();
        }
    }


    useEffect(() => {
        setValue("fecha_inicio", formatDateWithDateFns(new Date()));
        setValue("fecha_fin", formatDateWithDateFns(new Date()));
    }, []);
    return (
        <RegisterTableLayout title={"Descargos"}>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <LoaderLocal />}
            {(<DescargosRegistroCobrador setDescargos={setDescargos} />)}
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Descargos</h2>
                    {user.rol == roles.Admin && (<div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar cobrador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchOnEnter}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>)}
                </div>
                <DescargosTable descargos={descargos} rol={user.rol} aprobar={handleAprobar} />
                <Paginate meta={meta} onPageChange={handlePageChange} />
            </section>


        </RegisterTableLayout>
    )
}
