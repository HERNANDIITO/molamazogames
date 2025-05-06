import axios from 'axios'

const BASE_URL = "http://localhost:5000/format"

/**
 * GET ALL CATEGORIES 
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - meta {string} (opcional)
 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - categories: Vector con todas las categorias obtenidas
 */
const getAllFormats = async (data, headers = {}) => {
    try {

        console.log("stringified data", JSON.stringify(data));

        const response = await axios.get(`${BASE_URL}`, {
            params: data,
            headers: {
                'Content-type': 'application/json'
            },
        })
        
        if ( response.status != 200 ) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        return response.data;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}


export {
    getAllFormats
}