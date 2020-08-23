export default (rut) => {
    return rut.length>1 ? rut.replace(/[^0-9kK]*/g, '').replace(/^0*/g, '').replace(/(.$)/, '-$1') : rut;
}