import axios from 'axios'

const BASE_URL = "https://molamazogames-ctup.onrender.com/comment"

/**
 * GET ALL CATEGORIES 
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - meta {string} (opcional)
 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - categories: Vector con todas las categorias obtenidas
 */

const getCommentByAssetID = async (data, headers = {}) => {
    try {

        console.log("stringified data", JSON.stringify(data));

        const response = await axios.get(`${BASE_URL}/getCommentByAssetID`, {
            params: data,
            headers: {
                'Content-type': 'application/json'
            },
        })

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        return response.data;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}

const postComment = async (data, headers = {}) => {
    try {

        const config = {
            headers: {
                "authorization": `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json'
            }
        };

        const response = await axios.post(`${BASE_URL}/post`, data, config)

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        return response.data;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}

const deleteComment = async (data, headers = {}) => {
    try {

        const config = {
            params: data,
            headers: {
                "authorization": `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json'
            }
        };

        console.log("config", config)

        const response = await axios.delete(`${BASE_URL}`, config)

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        return response.data;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}

export {
    getCommentByAssetID,
    postComment,
    deleteComment
}