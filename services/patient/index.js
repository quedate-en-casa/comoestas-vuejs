import axios from 'axios'
import config from '../../src/config'
export class PatientService {
    async registerPatientStatus(data) {
        return axios.post(`${config.register.endpoints.createWithRut}/${data.rut}`, data)
            .then((result) => {
                return result;
            }).catch((error) => {
                console.log(error);
            });
    }

    async consultDoctorById(id) {
        return axios.get(`${config.doctor.endpoints.getByRut}/${id}`)
            .then((result) => {
                return result.data;
            }).catch((error) => {
                throw new Error("Error al invocar el servicio", error);
            });
    }

    async consultPatientStatusById(id) {
        return axios.get(`${config.register.endpoints.getById}/${id}`)
            .then((result) => {
                return result;
            }).catch((error) => {
                console.log(error);
            });
    }

    async consultPatientStatusByRut(rut) {
        return axios.get(`${config.register.endpoints.getByRut}/${rut}`)
            .then((result) => {
                return result;
            }).catch((error) => {
                console.log(error);
            });
    }



}