import axios from 'axios'
export class PatientService {
    async registerPatientStatus(data) {
        return axios.post(`https://1da95mioy1.execute-api.us-east-1.amazonaws.com/dev/create-patient-register/${data.rut}`, data)
            .then((result) => {
                return result;
            }).catch((error) => {
                console.log(error);
            });
    }

    async consultPatientStatus(id) {
        return axios.get(`https://1da95mioy1.execute-api.us-east-1.amazonaws.com/dev/get-patient-register/${id}`)
        .then((result) => {
            return result;
        }).catch((error) => {
            console.log(error);
        });
    }

}