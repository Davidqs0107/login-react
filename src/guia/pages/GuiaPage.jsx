import { NavLink } from "react-router";
import {
  Users, HandCoins, Wallet, ClipboardCheck, Receipt, BarChart3,
  Settings, RefreshCw, ShieldCheck, CalendarClock, TrafficCone, ArrowRight,
  Banknote, UserPlus, History,
} from "lucide-react";
import { useAuth } from "../../context/AuthContex";
import { roles } from "../../common/constans";

const FEATURES = [
  {
    icon: Users, color: "bg-blue-100 text-blue-600", to: "/clientes",
    title: "Clientes",
    desc: "Registra a tus clientes y consulta su semáforo crediticio (verde / amarillo / rojo) según su historial de pagos.",
  },
  {
    icon: HandCoins, color: "bg-emerald-100 text-emerald-600", to: "/prestamo",
    title: "Crear préstamos",
    desc: "Dos modelos: Interés Fijo (interés por cuota, capital al final) y Capital + Interés (todo repartido). El % se explica según el tipo elegido.",
  },
  {
    icon: Wallet, color: "bg-amber-100 text-amber-600", to: "/listado/prestamos",
    title: "Cobrar cuotas",
    desc: "Registra pagos totales o parciales, o un multipago que cubre varias cuotas. Si hay mora activa, el pago la cubre primero.",
  },
  {
    icon: CalendarClock, color: "bg-sky-100 text-sky-600", to: "/reportes/agenda",
    title: "Agenda de cobro",
    desc: "Tu lista de cuotas por cobrar en los próximos días para organizar la ruta del día.",
  },
  {
    icon: Banknote, color: "bg-lime-100 text-lime-600", to: "/descargos",
    title: "Descargos",
    desc: "Rinde el efectivo cobrado en el día: monto, nota y tipo de pago. El admin lo revisa y aprueba.",
  },
  {
    icon: ClipboardCheck, color: "bg-indigo-100 text-indigo-600", to: "/arqueos",
    title: "Arqueo de caja",
    desc: "Al final del día cierra tu caja: el sistema calcula lo cobrado y lo comparas con lo entregado. La diferencia queda registrada.",
  },
  {
    icon: Receipt, color: "bg-fuchsia-100 text-fuchsia-600", to: "/comprobantes",
    title: "Comprobantes del portal",
    desc: "Los clientes suben su comprobante de pago desde su enlace del portal. Aquí lo apruebas (genera el pago) o lo rechazas.",
  },
  {
    icon: BarChart3, color: "bg-teal-100 text-teal-600", to: "/reportes",
    title: "Reportes",
    desc: "Mora detallada, cartera por estado, cobros por cobrador, recaudación mensual y más.",
  },
  {
    icon: Settings, color: "bg-slate-200 text-slate-700", to: "/configuracion", adminOnly: true,
    title: "Configuración (mora)",
    desc: "Define la mora de tu empresa (% diario, % de cuota o monto fijo), los días de gracia y a los cuántos días un préstamo se marca incumplido.",
  },
  {
    icon: UserPlus, color: "bg-cyan-100 text-cyan-600", to: "/usuarios", adminOnly: true,
    title: "Usuarios",
    desc: "Crea y gestiona los usuarios de tu financiera: cobradores y otros administradores.",
  },
  {
    icon: RefreshCw, color: "bg-violet-100 text-violet-600", to: "/listado/prestamos", adminOnly: true,
    title: "Refinanciación",
    desc: "Desde el detalle de un préstamo, capitaliza el saldo pendiente (más un monto adicional opcional) en un préstamo nuevo enlazado al anterior.",
  },
  {
    icon: History, color: "bg-orange-100 text-orange-600", to: "/pagos", adminOnly: true,
    title: "Pagos",
    desc: "Historial y búsqueda de pagos por cliente, cuota o rango de fechas.",
  },
  {
    icon: ShieldCheck, color: "bg-rose-100 text-rose-600", to: "/auditoria", adminOnly: true,
    title: "Auditoría",
    desc: "Registro de acciones sensibles (eliminar pagos, cambios de configuración, aprobaciones). Quién hizo qué y cuándo.",
  },
];

const FLUJO_COBRADOR = [
  "Revisa tu Agenda de Cobro del día",
  "Cobra y registra los pagos de cada cliente",
  "Registra tu descargo con lo cobrado del día",
  "Cierra tu caja (arqueo) con lo entregado",
];
const FLUJO_ADMIN = [
  "Registra clientes y crea sus préstamos",
  "Supervisa cobros, mora y préstamos incumplidos",
  "Aprueba los arqueos de los cobradores",
  "Revisa los reportes y ajusta la configuración",
];

const CONCEPTOS = [
  { t: "Semáforo del cliente", d: "Verde = buen pagador, amarillo = atraso leve, rojo = mora alta o incumplido. Aparece en la lista de clientes." },
  { t: "Mora", d: "Recargo por atraso, configurable por tu empresa. Se cobra primero cuando el cliente paga una cuota vencida." },
  { t: "Estados del préstamo", d: "Pendiente → Activo (cuando hay pagos) → Completado. También Incumplido (mucho atraso) o Refinanciado." },
  { t: "Portal del cliente", d: "Un enlace privado (botón 🔗 en Clientes) que puedes enviar por WhatsApp. El cliente ve su deuda y reporta pagos." },
];

export const GuiaPage = () => {
  const { user } = useAuth();
  const esCobrador = user.rol === roles.Cobrador;
  const flujo = esCobrador ? FLUJO_COBRADOR : FLUJO_ADMIN;
  const features = FEATURES.filter((f) => !f.adminOnly || !esCobrador);

  return (
    <div className="p-6 max-w-6xl">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 text-white p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold">¿Cómo funciona el sistema?</h1>
        <p className="text-gray-300 mt-2 max-w-2xl">
          Hola {user.name}. Esta guía resume todo lo que puedes hacer{esCobrador ? " como cobrador" : " como administrador"} y
          te lleva directo a cada sección. Usa las tarjetas como accesos rápidos.
        </p>
      </div>

      {/* Flujo típico del día */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrafficCone size={20} /> Tu flujo típico del día
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {flujo.map((paso, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-2">
                {i + 1}
              </div>
              <p className="text-sm text-gray-700">{paso}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Módulos del sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <NavLink
                key={f.title}
                to={f.to}
                className="bg-white rounded-lg shadow p-5 hover:shadow-md transition group border border-transparent hover:border-blue-200"
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3 ${f.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-1">
                  {f.title}
                  {f.adminOnly && <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">admin</span>}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                <span className="text-blue-600 text-sm font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ir <ArrowRight size={15} />
                </span>
              </NavLink>
            );
          })}
        </div>
      </section>

      {/* Conceptos clave */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Conceptos clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONCEPTOS.map((c) => (
            <div key={c.t} className="bg-white rounded-lg shadow p-5">
              <h3 className="font-semibold text-gray-800">{c.t}</h3>
              <p className="text-sm text-gray-600 mt-1">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
