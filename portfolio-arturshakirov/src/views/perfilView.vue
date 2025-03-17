<script setup>
//Imports
import { onMounted, ref } from 'vue';

//Props
const props = defineProps({
  jwt: {
    type: String,
    required: true
  }
});

//Emits
const emit = defineEmits(["missatge-error","tancarSessio"]);

//Constants
const usuari = ref(null);

/**
 * Funció que fa la crida GET a l'endpoint /Usuari per obtenir les dades de l'usuari. Es necessita JWT.
 */
async function obtenirDadesPerfil() {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Usuari/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt 
      }
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    usuari.value = data.resultat;

  } catch (error) {
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
}

//Al carregar la pàgina obtenir les dades del perfil de l'usuari passant com paràmetre el jwt dels props.
onMounted(() => {
  obtenirDadesPerfil(props.jwt);
})
</script>

<template>
  <div id="contenidor-perfil" v-if="usuari">
    <h1>Perfil de {{ usuari.nomUsuari }}</h1>
    <div id="contingut-perfil">
      <div id="nomPerfil"><strong>Nom: </strong>{{ usuari.nom }}</div>
      <hr>
      <div id="cognomsPerfil"><strong>Cognoms: </strong>{{ usuari.cognoms }}</div>
      <hr>
      <div id="emailPerfil"><strong>Email: </strong>{{ usuari.email }}</div>
      <hr>
      <div id="dataNaixPerfil"><strong>Data de naixament: </strong>{{ usuari.dataNaix }}</div>
      <hr>
      <div id="creacioUsuariPerfil"><strong>Creat el: </strong>{{ usuari.dataCreacio }}</div>
      <hr v-if="usuari.administrador">
      <div id="administradorPerfil" v-if="usuari.administrador"><strong>Administrador: Si</strong>
      </div>
    </div>
    <button @click="emit('tancarSessio')">Tancar sessió</button>
  </div>

  <div id="contenidor-perfil" v-else>
    <h1>Perfil de ...</h1>
    <div class="iconaCarregantDades"></div>
  </div>
  <br>
</template>

<style scoped>
button {
  margin-top: 30px;
}
</style>