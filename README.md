# servidores-actividad2

API CRUD para un modelo "Post" con Node.js, Express.js y Mongoose.

# npm install
Instala las dependencias y librerías requeridas.

# npm start 
Levanta el API en el puerto 8000.

# POST http://localhost:8000/api/posts
- Recibe body JSON con los campos title, text y author.
- Devuelve HTTP 201 con el detalle JSON del Post creado en la Base de Datos en memoria.
- Devuelve HTTP 400 si hay errores en la validación del body de la petición contra el esquema definido.

# GET http://localhost:8000/api/posts
- Devuelve HTTP 200 OK con el listado JSON de posts almacenados en la Base de Datos en memoria.

# GET http://localhost:8000/api/posts/:id
- Devuelve 200 OK con detalle de un Post JSON almacenado en la Base de Datos en memoria.
- Devuelve 404 si el post no existe en la Base de Datos en memoria.

# PATCH http://localhost:8000/api/posts/:id
- Recibe body JSON con alguno de los campos title, text y author.
- Devuelve 200 OK con detalle de un Post JSON almacenado en la Base de Datos en memoria tras modificar sus atributos con lo indicado en el body.
- Devuelve 404 si el post no existe en la Base de Datos en memoria.

# DELETE http://localhost:8000/api/posts/:id
- Devuelve HTTP 204 tras eliminar el post id == <id> de la Base de Datos en memoria.
- Devuelve 404 si el post no existe en la Base de Datos en memoria.

# Utiliza un cliente HTTP cómo POSTMAN para hacer pruebas.
