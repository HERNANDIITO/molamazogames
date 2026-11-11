
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
import errorMiddleware  from './middlewares/error.middleware.js';

// Constantes --------------------------
const PORT  = process.env.PORT;
const app   = express();

// Configuración -----------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        if (path.endsWith('.blend')) {
            res.set('Content-Type', 'application/octet-stream');
        }
    }
}));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' https://mmg.phg21.es; style-src 'self'; script-src 'self';");
    next();
});

// Middleware para manejar errores
app.use(errorMiddleware);

// Routers -----------------------------
const api = express.Router();

api.use('/user',     userRouter     );
api.use('/auth',     authRouter     );
api.use('/asset',    assetRouter    );
api.use('/category', categoryRouter );
api.use('/comment',  commentRouter  );
api.use('/fav',      favRouter      );
api.use('/format',   formatRouter   );
api.use('/history',  historyRouter  );
api.use('/like',     likeRouter     );
api.use('/meta',     metaRouter     );
api.use('/tag',      tagRouter      );
api.use('/file',     fileRouter     );

app.use('/api', api);

// Servidor ----------------------------
app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`);
})
