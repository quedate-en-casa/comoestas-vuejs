<template>
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-6">
        <div class="field">
          <label class="label">Hospital:</label>
          <div class="control">
            <input class="input" type="text" v-model="patientRegister.hospital" placeholder="Ingrese Hospital">
          </div>
        </div>
      </div>
      <div class="column is-6">
        <div class="field">
          <label class="label">Doctor:</label>
          <div class="control">
            <input class="input" type="text" v-model="patientRegister.doctor" placeholder="Ingrese su nombre">
          </div>
        </div>
      </div>

      <div class="column is-6">
        <div class="field">
          <label class="label">RUT Paciente:</label>
          <div class="control">
            <input class="input" type="text" v-model="patientRegister.rut" placeholder="Ingrese RUT del paciente">
          </div>
        </div>
      </div>

      <div class="column is-6">
        <div class="field">
          <label class="label">Estado</label>
          <div class="control">
            <div class="select">
              <select v-model="patientRegister.status">
                <option>Estable</option>
                <option>No estable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-6">
        <div class="field">
          <label class="label">Comentario</label>
          <div class="control">
            <textarea class="textarea" v-model="patientRegister.doctorComments" placeholder="Agregue un comentario para los familiares"></textarea>
          </div>
        </div>
      </div>

      <div class="column is-6">
        <div class="field is-grouped is-grouped-right mt-5">
          <div class="control">
            <button class="button is-link is-light">Cancelar registro</button>
          </div>
          <div class="control">
            <button @click="sendData()" class="button is-link">Enviar datos</button>
          </div>
          <br>
        </div>
      </div>
      <div class="column is-12">
          <div class="notification is-success is-light" v-if="responseMessage">
              <button class="delete"></button>
              {{responseMessage}}
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import {PatientService} from '../../services/patient';
  export default {
    name: 'Form',
    data() {
      return {
        patientRegister: {},
        responseMessage: undefined,
      }
    },
    methods: {
      sendData() {
        console.log("Enviando datos a api gateway", this.patientRegister);
        let service = new PatientService();
        service.registerPatientStatus(this.patientRegister).then(result => {
          if (result.data.newUser != undefined) {
            this.responseMessage = "Se a agregado su registro a nuestra base de datos."
          } else {
            this.responseMessage = "Hubo un error al agregar el registro a nuestra base de datos."
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