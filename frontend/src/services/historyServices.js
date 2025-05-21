import axios from 'axios'

const BASE_URL = "https://molamazogames-ctup.onrender.com/history"

const postNewHistoryEntry = async (data, headers = {}) => {
    try {

        console.log("data:", data);

        const config = {
            headers: {
                'Content-type': 'application/json',
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

export {
    postNewHistoryEntry
}