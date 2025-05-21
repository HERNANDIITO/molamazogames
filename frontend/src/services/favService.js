import axios from 'axios'

const BASE_URL = "https://molamazogames-ctup.onrender.com/fav"

/**
 * GET ALL CATEGORIES 
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - meta {string} (opcional)
 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - categories: Vector con todas las categorias obtenidas
 */

const getUserFavs = async (data, headers = {}) => {
    try {

        const response = await axios.get(`${BASE_URL}/userFavs`, {
            params: data,
            headers: {
                'Content-type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('token')}`
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

const getAssetFavs = async (data, headers = {}) => {
    try {

        const response = await axios.get(`${BASE_URL}/assetFavs`, {
            params: data,
            headers: {
                'Content-type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem('token')}`
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

const postFav = async (data, headers = {}) => {
    try {

        const config = {
            params: data,
            headers: {
                "authorization": `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json'
            },
        }

        const response = await axios.post(`${BASE_URL}/postFav`, data, config)

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
    getUserFavs,
    getAssetFavs,
    postFav
}