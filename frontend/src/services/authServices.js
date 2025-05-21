const BASE_URL = "https://molamazogames-backend.vercel.app/auth"

/**
 * REGISTER
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - email {string} (obligatorio)
 *    - name {string}  (obligatorio)
 *    - pass {string}  (obligatorio)
 *    - tlf  {string}  (opcional)
 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - token: JWT Token
 */
const register = async (data, headers = {}) => {
    try {
        const response = await fetch(`${BASE_URL}/reg`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

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

/**
 * LOG IN
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - email   {string} (obligatorio)
 *    - pass    {string}  (obligatorio)

 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - token: JWT Token
 */
const login = async (data, headers = {}) => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

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

/**
 * LOG IN
 * @param {Object} data - Debe contener los siguientes parametros:
 *    - token

 * @param {Object} [headers={}] - Optional headers (e.g., auth tokens)
 * @returns {Promise<Object>} - Respuesta de la API en formato JSON
    - result: Resultado,
    - token: JWT Token
 */
const getUserByToken = async (data, headers = {}) => {

    try {
        const response = await fetch(`${BASE_URL}/me`,{
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                "Authorization": `Bearer ${data}`
            }
        })

        if ( !response.ok ) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Algo ha ido mal");
        }

        const result = await response.json();
        return result;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}

export {
    register,
    login,
    getUserByToken,
    updateUser
}