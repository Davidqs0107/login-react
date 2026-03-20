import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { LoginPage } from "../auth/pages/LoginPage";
import { RegisterPage } from "../auth/pages/RegisterPage";
import { DashboardPage } from "../prestamos/pages/DashboardPage";
import { ClientPage } from "../prestamos/pages/ClientPage";
import { PrestamosPage } from "../prestamos/pages/PrestamosPage";
import { DetallePrestamoPage } from "../prestamos/pages/DetallePrestamoPage";
import { PerfilPage } from "../usuarios/pages/PerfilPage";
import { PagosPage } from "../prestamos/pages/PagosPage";
import { ProtectedRoute } from "../ProtectedRoute";
import { PublicRoute } from "../PublicRoute";
import { UsuariosPage } from "../usuarios/pages/UsuariosPage";
import { ListadoPrestamosPage } from "../prestamos/pages/ListadoPrestamosPage";
import { EmpresasAdminPages } from "../admin/pages/EmpresasAdminPages";
import { DescargoPage } from "../prestamos/pages/DescargoPage";
import { EmpresaPage } from "../prestamos/pages/EmpresaPage";
import { MoraDetalladaPage } from "../reportes/pages/MoraDetalladaPage";
import { CarteraEstadoPage } from "../reportes/pages/CarteraEstadoPage";
import { CobrosCobradoresPage } from "../reportes/pages/CobrosCobradoresPage";
import { AgendaCobroPage } from "../reportes/pages/AgendaCobroPage";
import { RecaudacionMensualPage } from "../reportes/pages/RecaudacionMensualPage";
import { FichaClientePage } from "../reportes/pages/FichaClientePage";
import { ReportesIndexPage } from "../reportes/pages/ReportesIndexPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/empresa" element={<EmpresaPage />} />
        <Route path="/clientes" element={<ClientPage />} />
        <Route path="/prestamo" element={<PrestamosPage />} />
        <Route path="/prestamo/:id" element={<DetallePrestamoPage />} />
        <Route path="/listado/prestamos" element={<ListadoPrestamosPage />} />
        <Route path="/pagos" element={<PagosPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/descargos" element={<DescargoPage />} />
        <Route path="/admin/empresas" element={<EmpresasAdminPages />} />

        {/* Reportes */}
        <Route path="/reportes" element={<ReportesIndexPage />} />
        <Route path="/reportes/mora" element={<MoraDetalladaPage />} />
        <Route path="/reportes/cartera" element={<CarteraEstadoPage />} />
        <Route path="/reportes/cobros" element={<CobrosCobradoresPage />} />
        <Route path="/reportes/agenda" element={<AgendaCobroPage />} />
        <Route
          path="/reportes/recaudacion"
          element={<RecaudacionMensualPage />}
        />
        <Route
          path="/reportes/cliente/:clienteId"
          element={<FichaClientePage />}
        />

        <Route path="/*" element={<Navigate to={"/"} />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/*" element={<Navigate to={"/auth/login"} />} />
      </Route>
    </Routes>
  );
};
