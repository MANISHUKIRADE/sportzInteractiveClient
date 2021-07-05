import axios from "axios";
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
})
const API = {
    getList: async function () {
        let res = await api.get('/country')
        return res.data
    },
    getCountryById: async function (id) {
        let res = await api.get('/country/' + id)
        return res.data
    },
    addCountry: async function (newObject, config) {
        let res = await api.post('/country', newObject, config)
        return res.data;
    }
}

export default API