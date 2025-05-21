// Middleware para manejar errores
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);  // Para depuración

    // Si es un error de timeout, lo manejamos especialmente
    if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
        return res.status(504).json({
            result: 'Error de Timeout',
            msg: 'La solicitud ha superado el tiempo de espera.',
        });
    }

    // Para otros errores
    res.status(err.status || 500).json({
        result: 'Error',
        msg: err.message || 'Ocurrió un error inesperado.',
    });
};

export default errorMiddleware;
