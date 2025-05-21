import axios from 'axios'

const BASE_URL = "https://molamazogames-ctup.onrender.com/user"

const updateUser = async (data, headers = {}) => {
    try {

        const config = {
            headers: {
                "authorization": `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json'
            }
        };

        const response = await axios.put(`${BASE_URL}`, data, config)

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        return response.data;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}

const deleteUser = async (data, headers = {}) => {

    try {
        const response = await fetch(`${BASE_URL}/${data}`,{
            method: 'DELETE',
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
    updateUser,
    deleteUser
}