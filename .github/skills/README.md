# Skills del Sistema de Gestión de Préstamos

Este documento lista todos los skills disponibles para el desarrollo del sistema.

## Skills Creados

### 1. react-feature-module

**Ubicación**: `.github/skills/react-feature-module/SKILL.md`

Crea módulos completos de features siguiendo la arquitectura del proyecto:

- Estructura de carpetas (pages/, components/, hooks/, forms/)
- API services
- Custom hooks
- Form configurations
- Page components con CRUD
- Integración con rutas y sidebar

**Usar cuando**: Necesites crear una nueva sección/módulo completo en la aplicación.

### 2. react-custom-hook

**Ubicación**: `.github/skills/react-custom-hook/SKILL.md`

Crea custom hooks con el patrón estándar del proyecto:

- Estados de loading y error
- Operaciones CRUD asíncronas
- Manejo consistente de errores
- Integración con API services

**Usar cuando**: Necesites crear lógica de negocio reutilizable o integrar con APIs.

### 3. react-form-handling

**Ubicación**: `.github/skills/react-form-handling/SKILL.md`

Implementa formularios con react-hook-form:

- Configuración de campos
- Validaciones
- Componentes LabeledInput
- Manejo de errores
- Reset y valores por defecto
- Integración con React Select

**Usar cuando**: Necesites crear o editar formularios con validaciones.

### 4. api-integration

**Ubicación**: `.github/skills/api-integration/SKILL.md`

Integra servicios API con Axios:

- Configuración centralizada
- Interceptores para tokens
- Patrones CRUD consistentes
- Manejo de respuestas y errores
- Paginación
- Soft delete

**Usar cuando**: Necesites conectar con endpoints del backend.

### 5. modal-crud-workflow

**Ubicación**: `.github/skills/modal-crud-workflow/SKILL.md`

Implementa flujos CRUD completos con modales:

- Page component (container)
- Table component
- Create/Edit modals
- Confirmaciones con SweetAlert2
- Gestión de estados de modales

**Usar cuando**: Necesites implementar operaciones CRUD con UI modal.

### 6. pdf-generation

**Ubicación**: `.github/skills/pdf-generation/SKILL.md`

Genera PDFs con jsPDF:

- Configuración de documentos
- Texto y tipografía
- Tablas con autoTable
- Múltiples formatos (carta, voucher)
- Cálculos financieros
- Exportación y preview

**Usar cuando**: Necesites generar reportes, recibos o documentos en PDF.

## Arquitectura del Proyecto

### Stack Tecnológico

- React 18 + Vite
- React Router v7
- Axios
- React Hook Form
- Tailwind CSS
- SweetAlert2
- jsPDF + jspdf-autotable
- Leaflet
- Lucide React (iconos)
- date-fns

### Estructura de Carpetas

```
src/
├── api/                      # Servicios API con Axios
├── auth/                     # Módulo de autenticación
│   ├── components/
│   ├── layout/
│   └── pages/
├── prestamos/                # Módulo de préstamos
│   ├── components/          # Tablas, modales, cards
│   ├── forms/               # Configuraciones de formularios
│   ├── functions/           # Generación de PDFs, cálculos
│   ├── hooks/               # Custom hooks
│   └── pages/               # Páginas del módulo
├── usuarios/                # Módulo de usuarios
├── admin/                   # Módulo de administración
├── components/              # Componentes compartidos
├── context/                 # Context API (AuthContext)
├── routes/                  # Configuración de rutas
├── common/                  # Constantes y funciones comunes
├── helpers/                 # Utilidades (env variables)
└── layout/                  # Layouts compartidos
```

### Patrones Arquitectónicos

1. **Feature-based structure**: Cada módulo tiene su propia carpeta con pages, components, hooks, etc.
2. **Context API**: Para estado global (autenticación)
3. **Custom Hooks**: Lógica de negocio separada de componentes
4. **API Layer**: Capa centralizada con Axios interceptors
5. **Form Configurations**: Definiciones de campos separadas
6. **Modal-based UI**: CRUD operations a través de modales
7. **Protected Routes**: Wrappers para rutas autenticadas

## Convenciones de Nombres

- **Componentes**: PascalCase (ej: `ClientPage`, `CreateClientModal`)
- **Hooks**: camelCase con prefijo `use` (ej: `useClient`, `useAuth`)
- **Archivos**: Igual que el export principal
- **Rutas**: kebab-case (ej: `/clientes`, `/listado/prestamos`)
- **API Services**: camelCase con sufijo `Request` (ej: `getClientRequest`)

## Cómo Usar los Skills

Los skills se activan automáticamente cuando:

1. Tu pregunta contiene palabras clave relacionadas
2. Mencionas explícitamente el nombre del skill

Ejemplo:

- "Crea un nuevo módulo de productos" → Activa `react-feature-module`
- "Necesito un formulario para editar clientes" → Activa `react-form-handling`
- "Genera un PDF de reporte" → Activa `pdf-generation`

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview de build
npm run preview
```

## Variables de Entorno

Crear archivo `.env` basado en `.env.template`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Próximos Skills Sugeridos

- **authentication-flow**: Patrones de login/registro/renovación de token
- **protected-routes**: Implementación de rutas protegidas por rol
- **table-pagination**: Paginación de tablas con estado
- **map-integration**: Uso de Leaflet para mapas
- **date-handling**: Manejo de fechas con date-fns

---

**Nota**: Todos los skills están diseñados para trabajar juntos siguiendo los patrones establecidos en el proyecto. Consulta cada SKILL.md para documentación detallada con ejemplos de código.
