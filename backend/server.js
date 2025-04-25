
/**
 * Intentad mantener este archivo lo mas limpio posible
 * para ello podeis sacar funciones a otros archivos e improtarlos en este.
 */

// Importaciones de librerias ----------

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

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


// Constantes --------------------------
const PORT  = process.env.PORT;
const app = express();

// Configuración -----------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routers -----------------------------
app.use('/user',     userRouter     );
app.use('/auth',     authRouter     );
app.use('/assets',   assetRouter    );
app.use('/category', categoryRouter );
app.use('/comment',  commentRouter  );
app.use('/fav',      favRouter      );
app.use('/format',   formatRouter   );
app.use('/history',  historyRouter  );
app.use('/like',     likeRouter     );
app.use('/meta',     metaRouter     );
app.use('/tag',      tagRouter      );

// Servidor ----------------------------
app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
})