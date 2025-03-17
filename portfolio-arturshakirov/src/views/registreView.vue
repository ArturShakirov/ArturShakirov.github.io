<script setup>
//Imports
import { ref, computed } from 'vue';
import DatePicker from 'primevue/datepicker';
import Message from 'primevue/message';
import Password from 'primevue/password';
import { useUsuariStore } from '@/stores/usuariStore';
import { useRouter } from 'vue-router';

document.title = 'Registre';

//Emits
const emit = defineEmits(["missatge-correcte", "missatge-error"]);

//Constants
const usuariStore = useUsuariStore();
const APIKEY = import.meta.env.VITE_API_KEY;

const router = useRouter();

if (usuariStore.idUsuari) {
  router.push('/');
}

//Referències pels camps del formulari
const nom = ref('');
const cognoms = ref('');
const correu = ref('');
const dataNaixement = ref(null);
const nomUsuari = ref('');
const contrasenya = ref('');
const contrasenya2 = ref('');

//Missatges dinàmics de validació de la contrasenya
const errorsContrasenya = computed(() => {
  const errors = [];
  if (contrasenya.value.length < 8) errors.push('Mínim 8 caràcters.');
  if (!/[A-Z]/.test(contrasenya.value)) errors.push('Ha de contenir almenys una lletra majúscula.');
  if (!/[-*!¡$#]/.test(contrasenya.value)) errors.push('Ha de contenir almenys un símbol (-_*!¡$#).');
  if (!/\d/.test(contrasenya.value)) errors.push('Ha de contenir almenys un número.');
  if (/\s/.test(contrasenya.value)) errors.push('No pot contenir espais.');
  return errors;
});

//Funció per validar que l'usuari sigui major de 14 anys i que la data sigui vàlida
function validarEdat(data) {
  const dataNaix = new Date(data);
  const avui = new Date();

  //Comprovar si la data de naixement és avui o una data futura
  if (dataNaix >= avui) {
    return false;
  }

  let edat = avui.getFullYear() - dataNaix.getFullYear();
  const mes = avui.getMonth() - dataNaix.getMonth();
  if (mes < 0 || (mes === 0 && avui.getDate() < dataNaix.getDate())) {
    edat--;
  }

  return edat >= 14;
}

//Funció per validar que no hi hagi espais en blanc
function senseEspais(text) {
  return !/\s/.test(text);
}

//Funció per validar el format del correu electrònic
function validarCorreu(correu) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(cat|com|es)$/.test(correu) && !/[^\w@.-]/.test(correu) && senseEspais(correu);
}

//Funció per validar tots els camps del formulari
function validarCamps() {
  if (!nom.value || !cognoms.value || !correu.value || !dataNaixement.value || !nomUsuari.value || !contrasenya.value || !contrasenya2.value) {
    emit('missatge-error', { "titol": "Error!", "missatge": "Tots els camps són obligatoris." });
    return false;
  }

  if (!validarCorreu(correu.value)) {
    emit('missatge-error', { "titol": "Error!", "missatge": "El correu electrònic ha de ser vàlid, acabar en .com, .es o .cat i no pot tenir espais." });
    return false;
  }

  if (!validarEdat(dataNaixement.value)) {
    emit('missatge-error', { "titol": "Ho sentim!", "missatge": "Has de ser major de 14 anys." });
    return false;
  }

  if (!senseEspais(nomUsuari.value)) {
    emit('missatge-error', { "titol": "Error!", "missatge": "El nom d'usuari no pot contenir espais." });
    return false;
  }

  if (contrasenya.value !== contrasenya2.value) {
    emit('missatge-error', { "titol": "Error!", "missatge": "Les contrasenyes no coincideixen." });
    return false;
  }

  if (errorsContrasenya.value.length > 0) {
    emit('missatge-error', { "titol": "Error!", "missatge": "La contrasenya no compleix els criteris." });
    return false;
  }

  return true;
}

//Funció per gestionar l'enviament del formulari que fa la crida POST a l'endpoint /Registre per poder crear l'usuari. Es necessita API-KEY.
async function ferRegistre() {
  let data = "";

  //Validar els camps del formulari
  if (!validarCamps()) {
    return;
  };

  try {
    const resposta = await fetch(import.meta.env.VITE_RUTA_API + "Registre/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": APIKEY
      },
      body: JSON.stringify({
        "nom": nom.value.trim(),
        "cognoms": cognoms.value.trim(),
        "email": correu.value.toLowerCase().trim(),
        "dataNaix": dataNaixement.value,
        "nomUsuari": nomUsuari.value.trim(),
        "contrasenya": contrasenya.value.trim()
      })
    });

    data = await resposta.json();

    if (!resposta.ok) {
      throw new Error(`Error HTTP! Estat: ${resposta.status}`);
    }

    //Restablir els camps del formulari
    nom.value = '';
    cognoms.value = '';
    correu.value = '';
    dataNaixement.value = '';
    nomUsuari.value = '';
    contrasenya.value = '';
    contrasenya2.value = '';

    //Mostrar missatge de registre correcte i redirecció a la pantalla d'inici de sessió
    emit('missatge-success', { "titol": "Èxit!", "missatge": "Registre completat correctament." });
    router.push('/iniciar-sessio');

  } catch (error) {
    //Error crida
    emit('missatge-error', { "titol": "Error en la petició!", "missatge": data.error });
  }
}
</script>

<template>
  <div id="contenidorRegistre">
    <h1>Registre</h1>
    <div id="contingutRegistre">
      <form @submit.prevent="ferRegistre">
        <div class="primeraPart">
          <FloatLabel variant="in">
            <label for="nom">Nom</label>
            <InputText type="text" v-model="nom" />
          </FloatLabel>

          <FloatLabel variant="in">
            <label>Cognoms</label>
            <InputText type="text" v-model="cognoms" />
          </FloatLabel>

          <FloatLabel variant="in">
            <label>Correu electrònic</label>
            <InputText type="email" v-model="correu" />
          </FloatLabel>

          <input type="date" placeholder="Data de naixament" v-model="dataNaixement" />
        </div>

        <div class="linia"></div>

        <div class="segonaPart">
          <FloatLabel variant="in">
            <label for="nomUsuari">Nom d'usuari</label>
            <InputText type="text" v-model="nomUsuari" />
          </FloatLabel>

          <Password placeholder="Contrasenya" v-model="contrasenya" :feedback="false" toggleMask />

          <div v-if="errorsContrasenya.length">
            <Message v-for="error in errorsContrasenya" severity="error"
              size="small">
              {{ error }}
            </Message>
          </div>

          <Password v-if="contrasenya.length > 0" placeholder="Confirma contrasenya" v-model="contrasenya2" :feedback="false" toggleMask />
        </div>

        <div class="contenidorSubmit">
          <input value="Registrar-se" type="submit" />
          <RouterLink to="/iniciar-sessio" class="botoSecundari">Ja tens un compte?</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input {
  font-size: 13.5px;
  padding: 10px;
}

input[type="submit"] {
  margin: 0;
}

#contenidorRegistre {
  text-align: center;
}

.p-inputtext, .p-password-input, .p-datepicker-input {
  font-size: 13.5px;
  width: 100%;
}

.p-inputtext .p-component .p-inputtext-fluid .p-datepicker-input {
  padding: 0;
  margin: 0;
}

.p-message {
  margin-bottom: 10px;
}


#contingutRegistre form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

.linia {
  width: 1px;
  background-color: lightgray;
  margin: 5% 0;
}

.segonaPart, .primeraPart {
  margin: 0;
  padding: 0;
  width: 235px;
}

.contenidorSubmit {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 0;
  margin: 0;
  margin-top: 10px;
}

input[type="submit"] {
  max-width: 150px;
}

@media (max-width: 710px) {
  #contingutRegistre form {
    flex-direction: column;
    max-width: 300px;
    gap: 0;
  }

  input[type="submit"] {
    margin: 20px 0;
  }

  .segonaPart, .primeraPart {
    min-width: 100%;
  }

  label, .p-inputtext, .p-datepicker, .p-password {
    min-width: 100%;
  }

  .linia {
    display: none;
  }
}
</style>