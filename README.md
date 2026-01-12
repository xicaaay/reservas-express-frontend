# Sistema de Reservas Express – Frontend

Este repositorio contiene el **frontend** del proyecto **Sistema de Reservas Express**.

La aplicación permite a los usuarios:
- Consultar disponibilidad por rango de fechas
- Seleccionar una categoría y cantidad
- Crear una reserva como invitado
- Simular un proceso de pago
- Ver la confirmación y descargar su ticket digital

El frontend consume una **API REST pública** desarrollada en NestJS.

---

## Stack tecnológico

- **Next.js** (App Router)
- **TypeScript**
- **React**
- **Tailwind CSS**
- **React Icons**
- **Sonner** (notificaciones)
- Arquitectura **Mobile First**

---

## Cómo levantar el proyecto en local

### 1. Clonar el repositorio

```bash
git clone <https://github.com/xicaaay/reservas-express-frontend.git>
```
### 2. Instalar dependencias
Entrar al proyecto
```bash
cd reservas-express-frontend
```
### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno
Crea un archivo .env.local en la raíz del proyecto y agrega:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```
Esta variable indica la URL base del backend que expone la API REST.

### 5. Levantar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:3000`


## 📁 Estructura del proyecto

El frontend está organizado siguiendo las convenciones de **Next.js App Router**, con una separación clara entre vistas, componentes reutilizables y lógica compartida.

```txt
src/
├── app/
│   ├── page.tsx                 # Home: selección de fechas y categorías
│   ├── checkout/
│   │   └── page.tsx             # Checkout y formulario de pago
│   ├── confirmation/
│   │   └── page.tsx             # Confirmación de reserva
│   └── layout.tsx               # Layout raíz de la aplicación
│
├── components/
│   └── categoryCard/
│       └── CategoryCard.tsx     # Card reutilizable para cada categoría
│
├── lib/
│   ├── api.ts                   # Cliente para consumir la API REST
│   └── validations/
│       └── payment.ts           # Validaciones del formulario de pago
│
├── types/
│   └── index.ts                 # Tipos TypeScript compartidos
│
├── styles/
│   └── globals.css              # Estilos globales (Tailwind)
│
└── public/
    └── assets/                  # Recursos estáticos (opcional)
```

## 📦 Librerías externas

El proyecto utiliza un conjunto reducido de librerías, seleccionadas para mantener el código simple, claro y fácil de mantener.

### Next.js
Framework principal del frontend.
- App Router
- Renderizado del lado del servidor (cuando aplica)
- Manejo de rutas y layouts

### React
Base de la interfaz de usuario.
- Componentes funcionales
- Hooks (`useState`, `useEffect`)

### TypeScript
Tipado estático para mayor seguridad y mantenibilidad.
- Tipos compartidos
- Contratos claros entre frontend y backend

### Tailwind CSS
Sistema de estilos utility-first.
- Mobile First
- Sin CSS innecesario
- Diseño consistente y escalable

### React Icons
[Librería de íconos SVG.](https://react-icons.github.io/react-icons/)
- Íconos como componentes React
- Importación individual para evitar inflar el bundle

### Sonner
Sistema de notificaciones.
- Feedback inmediato al usuario
- Manejo de estados de carga, éxito y error

### 🔗 Compartir Ticket Digital (Web Share API)

El sistema permite al usuario **compartir su ticket digital** de forma sencilla una vez que la reserva ha sido confirmada, utilizando la **Web Share API** del navegador o, como alternativa, un enlace público.

#### ¿Qué se comparte?
- No se comparte el archivo PDF directamente.
- Se comparte un **enlace público al ticket digital (PDF)**, accesible desde cualquier dispositivo.

Esto garantiza mayor compatibilidad entre navegadores y dispositivos, especialmente en entornos móviles.

#### Funcionamiento
1. El backend genera el ticket digital en formato PDF.
2. El ticket queda disponible a través de un endpoint público.
3. Desde la pantalla de confirmación, el usuario puede compartir el ticket utilizando:
   - **Web Share API** (si el navegador lo soporta).
   - **Copia del enlace al portapapeles** como alternativa.

#### Web Share API
La Web Share API permite abrir el menú nativo del sistema para compartir contenido.

- En dispositivos móviles se muestra el menú de compartir del sistema (WhatsApp, correo, mensajes, etc.).
- En navegadores de escritorio compatibles, se ofrece una experiencia similar o la opción de copiar el enlace.

La implementación verifica la disponibilidad de la API antes de utilizarla.


