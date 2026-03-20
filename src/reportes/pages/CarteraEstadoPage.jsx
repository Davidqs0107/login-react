import { useEffect, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { CarteraEstadoCards } from "../components/CarteraEstadoCards";
import { LoaderLocal } from "../../components/LoaderLocal";

export const CarteraEstadoPage = () => {
  const [data, setData] = useState([]);
  const { getCarteraPorEstado, loading } = useReportes();

  const loadData = async () => {
    const result = await getCarteraPorEstado();
    if (result) {
      setData(result.data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cartera por Estado</h1>
        <p className="text-gray-600 mt-2">
          Resumen del portafolio de préstamos agrupado por estado
        </p>
      </div>

      {loading ? <LoaderLocal /> : <CarteraEstadoCards data={data} />}
    </div>
  );
};
