import axios from 'axios'
export class PatientService {
    async registerPatientStatus(data) {
        return axios.post(`https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/create-patient-register/${data.rut}`, data)
            .then((result) => {
                return result;
            }).catch((error) => {
                console.log(error);
            });
    }

    async consultPatientStatusById(id) {
        return axios.get(`https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/get-patient-register/${id}`)
        .then((result) => {
            return result;
        }).catch((error) => {
            console.log(error);
        });
    }

    async consultPatientStatusByRut(rut) {
        return axios.get(`https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/get-patient-register-by-rut/${rut}`)
        .then((result) => {
            return result;
        }).catch((error) => {
            console.log(error);
        });
    }



}