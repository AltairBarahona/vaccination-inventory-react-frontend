App web

https://vaccination-inventory-react-frontend.vercel.app/

Estos fueron los pasos para desarrollar esta aplicación:

Se desarrolló el backend con node, express js
La base de datos es mongoDB desplegada en el servicio Mongo Atlas

El backend tiene los métodos que se llaman desde el frontend para
crear, listar, actualizar y eliminar usuarios, al igual que para el login

La app de React se desplegó mediante Vercel
El backend se desplegó mediante Heroku
https://vaccination-inventory-backend.herokuapp.com

Credenciales Admin
User: altair.profesional@gmail.com
Password: 62F4EF

El orden del desarrollo fue el siguiente:

1. Creación de estructura de carpetas pages, routes
2. Frontend y lógica de admin
   Creación de tabla y botones
   Modal para crear y actualizar usuarios
   Manejo de estado
   Validaciones
   Lógica y peticiones http al backend
   Enviar correo al usuario registrado con sus credenciales
   Diseño
3. Frontend y lógica de employee
   Creación de tabla y botones
   Modal para actualizar información propia
   Manejo de estado
   Lógica y peticiones http al backend
   Filtrado solo información propia
   Diseño
4. Configuración de rutas según rol (admin o employee)
5. Pantalla de login
   Diseño
   Lógica de inicio de sesión con backend
   Lógica de rutas
