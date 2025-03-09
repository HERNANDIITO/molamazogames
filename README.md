# MolaMazoGames
Proyecto para Usabilidad y Accesiblidad de Ingeniería Multimedia en la Universidad de Alicante.

---
## Indice
- [Setup](#set-up)
- [Lanzar backend](#lanzar-backend)
- [Lanzar frontend](#lanzar-frontend)
---
## Set up

1. Instalar Node.js v22.14.0 ([descarga](https://nodejs.org/en/download))
2. Instalar Mongo:
    - MongoDB v8.0.5 ([descarga](https://www.mongodb.com/try/download/community))

    > **Atención**
    > Durante la instalación de MongoDB te preguntará si quieres instalar MongoDBCompass
    > yo lo recomiendo, pero puedes no instalarlo.
    > En caso de que no lo instaléis y te arrepientas luego puedes encontrarlo [aquí](https://www.mongodb.com/try/download/compass)

2. Instalar las dependencias del backend:
    1. `cd ./backend`
    2. `npm i`
3. Instalas las dependencias del frontend:
    1. `cd ../frontend`
    2. `npm i`
4. Crear una conexión con MongoDBCompass:
    1. Pulsa: "Add new connection"
    2. Edita el connection string y escribe: `mongodb://localhost:27017/molaMazoGames`
    3. Edita el nombre y pon: "MolaMazoGames"
    4. Pulsa: "Save and connect"

## Lanzar backend

El backend se puede lanzar de dos formas, para cualquiera de las dos se debe ejecutar el comando desde la carpeta `backend`:
- `node run dev`: es la manera pensada para el desarrollo de la apliación ya que los cambios se actualizan automáticamente y no hace falta relanzar el servidor.
- `node run start`: lanzamiendo de producción, es decir, ejecutaremos esto cuando la aplicación esté lista para entregar o para hacer pruebas y simulaciones.

## Lanzar frontend

El frontend, al igual que el backend debe lanzarse desde su carpeta ``frontend`` con este comando:
- `npm start`

