import axios from 'axios'

// const BASE_URL = "https://molamazogames-ctup.onrender.com/user"
const BASE_URL = "http://localhost:5000/user"

const updateUser = async (data, headers = {}) => {
    console.log("DATA: ", data);
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

        console.log("DATA: ", data)

        const config = {
            params: data,
            headers: {
                'Content-type': 'application/json',
                "Authorization": `Bearer ${data}`
            }
        };
        
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
    updateUser,
    deleteUser
}