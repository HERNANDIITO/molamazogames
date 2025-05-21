import axios from 'axios'

const BASE_URL = "https://molamazogames-ctup.onrender.com/file"

const uploadFile = async (data, headers = {}) => {
    try {

        const config = {
            headers: {
                'Content-type': 'multipart/form-data',
                "authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        };

        const response = await axios.post(`${BASE_URL}`, data, config)

        if (response.status != 200) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Algo ha ido mal');
        }

        return response.data;

    } catch (error) {
        throw new Error(error.message || 'Algo ha ido mal');
    }
}


const updateFile = async (data, headers = {}) => {
    try {

        const config = {
            params: data,
            headers: {
                'Content-type': 'multipart/form-data',
                "authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        };

        const response = await axios.put(`${BASE_URL}`, config)

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
    uploadFile,
    updateFile
}