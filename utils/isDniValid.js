export default (rut) => {
    const regRut = /^\d.{5,10}[-][\dkK]$/
    return (rut === '') ? '' : (regRut.test(rut)) ? '' : 'is-danger'
  }
  