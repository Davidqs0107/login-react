import { useAuth } from "../../context/AuthContex";
import { roles } from "../../common/constans";
import {
  FileText,
  PieChart,
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router";

export const ReportesIndexPage = () => {
  const { user } = useAuth();
  const isAdminOrSuper =
    user.rol === roles.Admin || user.rol === roles.SuperAdmin;

  const reportes = [
    {
      title: "Agenda de Cobro",
      description: "Cuotas pendientes que vencen próximamente",
      path: "/reportes/agenda",
      icon: Calendar,
      color: "bg-blue-500",
      roles: [roles.Admin, roles.SuperAdmin, roles.Cobrador],
    },
    {
      title: "Mora Detallada",
      description: "Listado de cuotas vencidas con días de mora",
      path: "/reportes/mora",
      icon: FileText,
      color: "bg-red-500",
      roles: [roles.Admin, roles.SuperAdmin],
    },
    {
      title: "Cartera por Estado",
      description: "Resumen del portafolio de préstamos agrupado por estado",
      path: "/reportes/cartera",
      icon: PieChart,
      color: "bg-green-500",
      roles: [roles.Admin, roles.SuperAdmin],
    },
    {
      title: "Cobros por Cobrador",
      description: "Total recaudado por cada cobrador en el período",
      path: "/reportes/cobros",
      icon: Users,
      color: "bg-purple-500",
      roles: [roles.Admin, roles.SuperAdmin],
    },
    {
      title: "Recaudación Mensual",
      description: "Totales cobrados agrupados por mes",
      path: "/reportes/recaudacion",
      icon: TrendingUp,
      color: "bg-orange-500",
      roles: [roles.Admin, roles.SuperAdmin],
    },
  ];

  const availableReports = reportes.filter((reporte) =>
    reporte.roles.includes(user.rol),
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
        <p className="text-gray-600 mt-2">
          Selecciona el reporte que deseas visualizar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableReports.map((reporte) => {
          const Icon = reporte.icon;
          return (
            <Link
              key={reporte.path}
              to={reporte.path}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className={`${reporte.color} h-2`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`${reporte.color} bg-opacity-10 p-3 rounded-lg`}
                  >
                    <Icon
                      className={`${reporte.color.replace("bg-", "text-")} w-8 h-8`}
                    />
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    →
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {reporte.title}
                </h3>
                <p className="text-gray-600 text-sm">{reporte.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
