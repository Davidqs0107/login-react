import { useEffect, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { FichaClienteCard } from "../components/FichaClienteCard";
import { LoaderLocal } from "../../components/LoaderLocal";
import { useNavigate, useParams } from "react-router";

export const FichaClientePage = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [clienteData, setClienteData] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const { getFichaCliente, loading, error } = useReportes();

  const loadData = async () => {
    const result = await getFichaCliente(clienteId);
    if (result) {
      setClienteData(result.cliente);
      setPrestamos(result.prestamos || []);
    }
  };

  useEffect(() => {
    if (clienteId) {
      loadData();
    }
  }, [clienteId]);

  if (loading) {
    return (
      <div className="p-6">
        <LoaderLocal />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Ficha del Cliente
          </h1>
          <p className="text-gray-600 mt-2">
            Historial completo del cliente y sus préstamos
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Volver
        </button>
      </div>

      {clienteData && (
        <FichaClienteCard cliente={clienteData} prestamos={prestamos} />
      )}
    </div>
  );
};
