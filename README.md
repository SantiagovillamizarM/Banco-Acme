# 💳 Portal Transaccional – Acme Bank

## 📌 Descripción del Proyecto

El **Portal Transaccional – Acme Bank** es una aplicación web desarrollada en JavaScript que permite a los usuarios gestionar sus cuentas bancarias de forma autónoma.

El sistema incluye autenticación, registro por fases, recuperación de contraseña y un dashboard donde se realizan operaciones bancarias como consignaciones, retiros y pagos.

---

## 🚀 Tecnologías Utilizadas

- HTML5  
- CSS3  
- JavaScript (Vanilla)  
- LocalStorage (persistencia de datos)  
- JSON  

---

## 📁 Estructura del Proyecto

/ProyectoAcmeBank
│── index.html
│── datos-admin.json
│── README.md
│
├── assets/
│ └── favicon-sin-fondo.png
│
├── html/
│ ├── login.html
│ ├── formulario-de-acceso.html
│ ├── dashboard.html
│ ├── contra_olvidada.html
│ ├── contrasena_olvidada2.html
│ │
│ └── Register/
│ ├── Register_fase1.html
│ ├── Register_fase2.html
│ └── Register_fase3.html
│
├── scripts/
│ ├── script-login.js
│ ├── registro.js
│ ├── registro-fase2.js
│ ├── registro-fase3.js
│ ├── dashboard.js
│ ├── contra_olvidada.js
│ └── contraseña_olvidada2.js
│
├── style/
│ ├── style.css
│ ├── login-style.css
│ ├── loginR-style.css
│ ├── dashboard.css
│ ├── contraseña-olvidada-style.css
│ ├── contraseña-olvidada2-style.css
│ ├── registro-style.css
│ ├── registro-fase1-style.css
│ └── registro-fase3-style.css


---

## 🔄 Flujo de la Aplicación

### 🔐 1. Inicio de Sesión

Archivo principal: `html/login.html`

- El usuario ingresa:
  - Tipo de identificación  
  - Número de identificación  
  - Contraseña  
- Se validan los datos con LocalStorage  
- Si es correcto → redirige a `dashboard.html`  
- Si falla → muestra mensaje de error  

Opciones disponibles:
- Crear cuenta → `Register/Register_fase1.html`  
- Recordar contraseña → `contra_olvidada.html`  

---

### 📝 2. Registro de Usuario (por fases)

**Fase 1:**  
`Register_fase1.html + registro.js`  
- Captura datos básicos  

**Fase 2:**  
`Register_fase2.html + registro-fase2.js`  
- Datos adicionales  

**Fase 3:**  
`Register_fase3.html + registro-fase3.js`  
- Confirmación y contraseña  

Al finalizar:
- Se genera número de cuenta  
- Se asigna fecha de creación  
- Se guarda en LocalStorage  
- Redirige al login  

---

### 🔁 3. Recuperación de Contraseña

**Paso 1:**  
`contra_olvidada.html + contra_olvidada.js`  
- Validación de identidad (documento + correo)  

**Paso 2:**  
`contrasena_olvidada2.html + contraseña_olvidada2.js`  
- Asignación de nueva contraseña  
- Actualización en LocalStorage  

---

### 📊 4. Dashboard

Archivo: `dashboard.html + dashboard.js`

Al ingresar muestra:
- Número de cuenta  
- Saldo actual  
- Fecha de creación  

---

## 💰 Funcionalidades del Dashboard

### 📄 Resumen de Transacciones
- Últimos 10 movimientos  
- Incluye:
  - Fecha  
  - Referencia  
  - Tipo  
  - Descripción  
  - Valor  

---

### ➕ Consignación
- Aumenta el saldo  
- Genera referencia aleatoria  
- Guarda la transacción  

---

### ➖ Retiro
- Disminuye el saldo  
- Valida saldo disponible  

---

### 🧾 Pago de Servicios
- Opciones:
  - Energía  
  - Agua  
  - Gas  
  - Internet  
- Disminuye el saldo  
- Registra la transacción  

---

### 📄 Certificado Bancario
- Genera comprobante de cuenta activa  
- Incluye:
  - Nombre  
  - Número de cuenta  
  - Fecha de creación  

---

### 🔓 Cerrar Sesión
- Redirige al login  

---

## 💾 Persistencia de Datos

- Uso de LocalStorage  
- Datos en formato JSON  
- Simulación de base de datos  

---

## ⚙️ Instalación y Ejecución

1. Clonar o descargar el repositorio  
2. Abrir la carpeta del proyecto  
3. Ejecutar el archivo `index.html`  
4. Navegar por la aplicación  

---

## 🎨 Diseño

- Diseño responsive (móvil, tablet y desktop)  
- Colores:
  - Blanco  
  - Negro  
- Tipografía moderna   
- Interfaz clara  

---

## ✅ Buenas Prácticas

- Código organizado por carpetas  
- Nombres descriptivos  
- Validaciones en formularios  
- Uso correcto del DOM y eventos  
- Separación de responsabilidades  

---

## 👨‍💻 Autor(es)

- Santiago Villamizar Mantilla
- Juan José Ricardo Rangel Sandoval 

---

## 📌 Notas Finales

Este proyecto aplica conceptos clave de JavaScript:

- Manipulación del DOM  
- Eventos  
- Validaciones  
- Persistencia de datos  
- Lógica de negocio en frontend  

---