
/**
 * Intentad mantener este archivo lo mas limpio posible
 * para ello podeis sacar funciones a otros archivos e improtarlos en este.
 */

// Importaciones de librerias ----------

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from './db/conn.js';

// Importar routers --------------------
import userRouter       from './routes/userRoutes.js';
import authRouter       from './routes/authRoutes.js';
import assetRouter      from './routes/assetRoutes.js';
import categoryRouter   from './routes/categoryRoutes.js';
import commentRouter    from './routes/commentRoutes.js';
import favRouter        from './routes/favRoutes.js';
import formatRouter     from './routes/formatRoutes.js';
import historyRouter    from './routes/historyRoutes.js';
import likeRouter       from './routes/likeRoutes.js';
import metaRouter       from './routes/metaRoutes.js';
import tagRouter        from './routes/tagRoutes.js';
import fileRouter       from './routes/fileRoutes.js';
import dbConnect from './db/conn.js';

// Constantes --------------------------
const PORT  = process.env.PORT;
const app   = express();

// Configuración -----------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Routers -----------------------------
app.use('/user',     userRouter     );
app.use('/auth',     authRouter     );
app.use('/asset',    assetRouter    );
app.use('/category', categoryRouter );
app.use('/comment',  commentRouter  );
app.use('/fav',      favRouter      );
app.use('/format',   formatRouter   );
app.use('/history',  historyRouter  );
app.use('/like',     likeRouter     );
app.use('/meta',     metaRouter     );
app.use('/tag',      tagRouter      );
app.use('/file',     fileRouter     );

// Servidor ----------------------------
// app.listen(PORT, () => {
//     console.log(`Server started on: ${PORT}`);
// })

// Exportamos la función Express para Vercel --------------------
app.use(async (req, res, next) => {
    await dbConnect();
    next();
});