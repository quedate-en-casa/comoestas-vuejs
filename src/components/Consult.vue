<template>
    <div class="container">
        <div class="columns is-multiline">
            <div class="column is-6">
                <div class="field">
                    <label class="label">RUT Paciente:</label>
                    <div class="control">
                        <input class="input" type="text" v-model="rutPatient" placeholder="Ingrese el RUT del paciente">
                    </div>
                </div>
            </div>
            <div class="column is-6">
                <div class="field">
                    <label class="label">Codigo:</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Ingrese codigo de seguridad">
                    </div>
                </div>
            </div>
            <div class="column is-12">
                <div @click="getStatusPatient()" class="button is-primary"> Consultar </div>
            </div>
            
            <div class="notification is-danger is-light" v-if="errorMessage">
                <button class="delete"></button>
                {{errorMessage}}
            </div>
        </div>
        <div class="columns" v-if="resultConsult">
            <div class="column is-12">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Estado del paciente
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div class="notification">
                                <b>Hospital:</b> {{resultConsult.hospital}}
                                <b>Doctor:</b> {{resultConsult.doctor}}
                            </div>
                            <div class="notification">
                                <b>Estatus:</b> {{resultConsult.status}}
                                <b>Comentarios: </b> {{resultConsult.doctorComments}}
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Agradecimientos al doctor</a>
                        <a href="#" class="card-footer-item" @click="resultConsult=undefined;rutPatient=undefined">OK</a>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        PatientService
    } from '../../services/patient/index.js';
    export default {
        name: 'Consult',
        data() {
            return {
                rutPatient: undefined,
                resultConsult: undefined,
                errorMessage: undefined
            }
        },
        methods: {
            getStatusPatient() {
                let service = new PatientService();
                service.consultPatientStatus(this.rutPatient).then(result => {
                    if (result!=undefined) {
                        this.errorMessage = undefined;
                        this.resultConsult = result.data.user;
                    } else {
                        this.errorMessage = "El paciente no esta registrado en nuestra base de datos.";
                    }
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>