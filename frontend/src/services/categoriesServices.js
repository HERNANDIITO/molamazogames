const BASE_URL = "http://localhost:5000/category"

/**
 * GET ALL CATEGORIES 
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - meta {string} (opcional)
 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - categories: Vector con todas las categorias obtenidas
 */
const getAllCategories = async (data, headers = {}) => {
    try {
        console.log("estoy dentro");
        console.log(JSON.stringify(data));
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        console.log("estoy dentro, muy dentro");

        console.log(response);

        if ( !response.ok ) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}


export {
    getAllCategories
}