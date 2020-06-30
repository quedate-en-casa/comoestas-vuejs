<template>
    <div class="container">
        <div class="columns is-multiline" v-if="resultConsult == undefined">
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
        <div class="columns is-multiline" v-if="resultConsult">
            <div class="column is-12">
                <button class="button is-primary" @click="resultConsult = undefined">Volver</button>
            </div>
            <div class="column is-12">
                <div class="card is-small">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span>
                                Estado del paciente
                            </span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div v-for="(resultConsultItem, index) in resultConsult" :key="resultConsultItem.ID" :index="index">
                                <p class="has-text-weight-bold">{{index==0?resultConsultItem.status.includes('No')?'No te preocupes, todo estará bien!':'¡Estas al dia!':''}}</p>
                                <span v-if="index==0" class="fa fa-arrow-up"></span>
                                <div class="notification columns mt-0" :class="resultConsultItem.status.includes('No')?'nok-b':'ok-b'">
                                    <div class="column">
                                        <p>
                                            <b>Hospital:</b> {{resultConsultItem.hospital}}
                                        </p>
                                        <p>
                                            <b>Doctor:</b> {{resultConsultItem.doctor}}
                                        </p>
                                    </div>
                                    <div class="column">
                                        <p>
                                            <b>Estatus:</b> <span :class="resultConsultItem.status.includes('No')?'nok':'ok'">{{resultConsultItem.status}}</span> 
                                        </p>
                                        <p>
                                            <b>Comentarios: </b> {{resultConsultItem.doctorComments}}
                                        </p>
                                    </div>
                                    <div class="column">
                                        <p>
                                            <b>Fecha:</b> {{ resultConsultItem.date | formatDate}}
                                        </p>
                                    </div>
                                </div>
                                <span class="fa fa-arrow-up"></span>
                                <p class="has-text-weight-bold">{{index==(resultConsult.length-1)?'Inicio de atención..':''}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import formatDate from '../../utils/FormatDta'
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
        filters: {
            formatDate,
        },
        methods: {
            getStatusPatient() {
                let service = new PatientService();
                service.consultPatientStatusByRut(this.rutPatient).then(result => {
                    if (result != undefined && result.data.registers.length!=0) {
                        this.errorMessage = undefined;
                        this.resultConsult = result.data.registers.sort((a, b) => (a.date < b.date) ? 1 : -1);
                    } else {
                        this.errorMessage = "El paciente no esta registrado en nuestra base de datos.";
                    }
                });
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


    .ok-b {
        border: 1px solid rgba(41, 200, 29, 0.63);
    }

    .nok-b {
        border: 1px solid rgba(150, 29, 29, 0.63);
    }
    .ok {
        background: rgba(41, 200, 29, 0.63);
    }

    .nok {
        color: #FFF;
        background: rgba(150, 29, 29, 0.63);
    }

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