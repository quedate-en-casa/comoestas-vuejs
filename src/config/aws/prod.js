module.exports = {
    register: {
        endpoints: {
            createWithRut: 'https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/create-patient-register',
            getById: 'https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/get-patient-register',
            getByRut: 'https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/get-patient-register-by-rut'
        }
    },
    doctor: {
        endpoints: {
            getByRut: 'https://k12brm05pc.execute-api.us-east-1.amazonaws.com/dev/get-doctor'
        }
    }
}