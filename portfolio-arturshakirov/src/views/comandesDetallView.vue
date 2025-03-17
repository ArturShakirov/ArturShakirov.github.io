<script setup>
//Imports
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import Plat from '@/components/plat.vue';
import { useUsuariStore } from '@/stores/usuariStore';

//Emits
const emit = defineEmits(["missatge-error", "missatge-success"]);

//Constants
const route = useRoute();
const idComanda = route.params.id;
const jwt = localStorage.getItem("jwt");

const usuariStore = useUsuariStore();

const comanda = ref(null);
const platsComanda = ref([]);

/**
 * Funció que fa la crida GET a l'endpoint /Comanda pero obtenir les dades de la comanda. Es necessita JWT.
 */
async function obtenirComanda() {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Comanda/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt": jwt,
        "comandaId": idComanda
      }
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    comanda.value = data.resultat;
    platsComanda.value = Object.values(data.resultat.plats);
  } catch (error) {
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
}

//Abans de montar la pàgina fa la crida a la API per obtenir les dades de la comanda.
onBeforeMount(() => {
  obtenirComanda();
});
</script>

<template>
  <div id="contenidor-detallcomanda">
    <RouterLink v-if="usuariStore.administrador" class="botoSecundari" to="/comandes"><- Tornar a comandes</RouterLink>
    <RouterLink v-else class="botoSecundari" to="/teves-comandes"><- Tornar a comandes</RouterLink>
        <h1>Detall de comanda {{ idComanda }}</h1>
        <div id="contingut-detallcomanda" v-if="comanda">
          <div id="infocomanda-detallcomanda">
            <div><strong>Usuari: </strong>{{ comanda.nomUsuari }}</div>
            <div><strong>Data comanda: </strong>{{ comanda.dataInici }}</div>
            <div><strong>Data entrega estimada: </strong>{{ comanda.dataFi }}</div>
            <div><strong>Preu: </strong>{{ comanda.preuTotal }}€</div>
            <div>
              <strong>Estat: </strong>
              <Tag class="capitalize" :class="{
                'p-tag-success': comanda.estat.toLowerCase() === 'entregat',
                'p-tag-danger': comanda.estat.toLowerCase() === 'cancelat',
                'p-tag-warning': comanda.estat.toLowerCase() === 'en preparacio',
              }">
                {{ comanda.estat }}
              </Tag>
            </div>
          </div>

          <div class="contenidorplats-detallcomanda">
            <div v-for="plat in platsComanda" class="contenidorplat-detallcomanda">
              <h2 v-if="plat.nomTipus">{{ plat.nomTipus }}</h2>
              <h2 v-else>Tipus no assignat</h2>
              <Plat :dadesPlat="plat"></Plat>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="iconaCarregantDades"></div>
        </div>
  </div>
</template>

<style scoped>
h1 {
  margin-top: 10px;
}

h2 {
  padding-bottom: 5px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  width: fit-content;
}

#contingut-detallcomanda {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

#infocomanda-detallcomanda {
  display: flex;
  flex-direction: column;
  gap: 8px;

}

.contenidorplats-detallcomanda {
  display: flex;
  flex-direction: row;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.contenidorplats-detallcomanda > div {
  flex: 1;
}

.capitalize {
  text-transform: capitalize;
}
</style>