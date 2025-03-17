<script setup>
//Imports
import { onBeforeMount, ref, computed } from 'vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { useRouter } from 'vue-router';

document.title = "Les teves comandes";

//Props
const props = defineProps({
  jwt: {
    type: String,
    required: true
  }
});

//Emits
const emit = defineEmits(["missatge-error", "missatge-success"]);

//Constants
const router = useRouter();

const comandes = ref([]);
const dadesCarregades = ref(false);
const tabActiu = ref('en preparacio');

//Computed per filtrar les comandes segons l'estat seleccionat
const comandesFiltrades = computed(() => {
  return comandes.value.filter(comanda => comanda.estat.toLowerCase() === tabActiu.value);
});

//Tabs per cada estat
const tabs = ref([
  { title: 'En preparació', value: 'en preparacio' },
  { title: 'Entregat', value: 'entregat' },
  { title: 'Cancel·lat', value: 'cancelat' }
]);

/**
 * Funció que fa la crida GET a l'endpoint /Comanda per obtenir les comandes fetes per l'usuari. Es necessita JWT.
 */
async function obtenirComandes() {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Comanda/", {
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

    if (data.resultat) {
      comandes.value = Object.values(data.resultat);
    }
    dadesCarregades.value = true;

  } catch (error) {
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
}

/**
 * Funció que redirigeix a la ruta de detall de la comanda amb l'id passat per paràmetre.
 * @param idComanda 
 */
function mostrarDetallComanda(idComanda) {
  router.push(`/comandes/${idComanda}`);
}

//Abans de montar la pàgina fa la crida a la API per obtenir les comandes.
onBeforeMount(() => {
  obtenirComandes();
});
</script>

<template>
  <div id="contenidor-tevescomandes">
    <h1>Les teves comandes</h1>
    <div id="contingut-tevescomandes">
      <div v-if="dadesCarregades && comandes.length <= 0">
        No tens cap comanda realitzada!
      </div>
      <div v-else-if="dadesCarregades && comandes.length > 0">
        <Tabs :value="tabActiu">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value" @click="tabActiu = tab.value">
              {{ tab.title }}
            </Tab>
          </TabList>
          <TabPanels>
            <!-- Aquí mostrem només el panel corresponent al tab actiu -->
            <TabPanel :value="tabActiu">
              <div class="contenidor-comanda-tevescomandes" v-if="comandesFiltrades.length > 0">
                <div v-for="comanda in comandesFiltrades" class="contingut-comanda-tevescomandes" @click="mostrarDetallComanda(comanda.id)">
                  <p><strong>Nº comanda:</strong> {{ comanda.id }}</p>
                  <p><strong>Data comanda:</strong> {{ comanda.dataInici }}</p>
                  <p><strong>Data entrega estimada:</strong> {{ comanda.dataFi }}</p>
                  <p><strong>Preu total:</strong> {{ comanda.preuTotal }}€</p>
                </div>
              </div>
              <div v-else>
                No hi ha comandes en aquest estat.
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <div v-else>
        <div class="iconaCarregantDades"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenidor-comanda-tevescomandes {
  border-radius: 4px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contingut-comanda-tevescomandes {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 0.75em;
  width: fit-content;
  cursor: pointer;
  transition: 0.2s;
}

.contingut-comanda-tevescomandes:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
