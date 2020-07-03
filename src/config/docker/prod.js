module.exports = {
    register: {
        endpoints: {
            createWithRut: '/api/record',
            getById: '/api/record',
            getByRut: '/api/record'
        }
    },
    doctor: {
        endpoints: {
            getByRut: '/api/doctor'
        }
    }
}