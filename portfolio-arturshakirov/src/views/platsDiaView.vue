<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

document.title = "Plats per dia"

//Props
const props = defineProps({
  jwt: {
    type: String,
    required: true
  }
});

//Emits
const emit = defineEmits(["missatge-success", "missatge-error"]);

//Constants
const platsDia = ref([]);
const platsDiaFiltrats = ref([]);
const diesSetmana = ref([]);
const plats = ref([]);

const filtrePlat = ref("");
const filtreDia = ref("");

const mostrarDialogInserir = ref(false);
const platDiaInserir = ref({
  idDia: null,
  idPlat: null,
});

const carregantDades = ref(true);

/**
 * Funció per fer la crida GET a l'endpoint /PlatDia per obtenir les dades dels plats assignats a cada dia. Es necessita JWT.
 */
async function obtenirPlatsDia() {
  carregantDades.value = true;
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "PlatDia/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt
      }
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estat: ${response.status}`);
    }

    platsDia.value = Object.values(data.resultat);
    platsDiaFiltrats.value = Object.values(data.resultat);

  } catch (error) {
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
  }
  finally {
    carregantDades.value = false;
    filtreDia.value = "";
    filtrePlat.value = "";
  }
}

/**
 * Funció que fa la crida DELETE a l'endpoint /PlatDia per eliminar el registre del plat assignat a aquell dia gràcies als id passat per paràmetre. Es necessita JWT.
 * @param idPlat 
 * @param idDia 
 */
async function eliminarPlatDiaAPI(idPlat, idDia) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "PlatDia/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "idPlat": idPlat,
        "idDia": idDia 
      })
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    return true;
  } catch (error) {
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    return false;
  }
}

/**
 * Funció que fa la crida POST a l'endpoint /PlatDia per inserir un plat a un dia amb els id's passats per paràmetre. Es necessita JWT.
 * @param idPlat 
 * @param idDia 
 */
async function inserirPlatDiaAPI(idPlat, idDia) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "PlatDia/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "idPlat": idPlat,
        "idDia": idDia
      })
    });


    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    return true;
  } catch (error) {
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    return false;
  }
}

/**
 * Crida a la funció que fa la crida de la API per eliminar el platDia passant per paràmetre els mateixos ids que rep com param. Si s'elimina, mostra un toast success i torna a obtenir les dades.
 * @param idPlat
 * @param idDia 
 */
async function eliminarPlatDia(idPlat, idDia) {
  if (await eliminarPlatDiaAPI(idPlat, idDia)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "S'ha eliminat el plat d'aquell dia correctament." });
    obtenirPlatsDia();
  }
}

/**
 * Tanca el dialog d'inserir, crida a la funció que fa la crida a la API per inserir un platDia passant per paràmetre el idPlat i idDia. Si s'insereix correctament mostra toast success.
 * @param idPlat 
 * @param idDia 
 */
async function inserirPlatDia(idPlat, idDia) {
  mostrarDialogInserir.value = false;
  if (await inserirPlatDiaAPI(idPlat, idDia)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": `S'ha assignat el plat al dia correctament.` });
    obtenirPlatsDia();
  }
}

/**
 * Funció que fa la crida GET a l'endpoint /DiesSetmana per obtenir les dades dels dies de la setmana. Es necessita JWT.
 */
async function obtenirDiesSetmana() {
  carregantDades.value = true;
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "DiesSetmana/", {
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

    diesSetmana.value = Object.values(data.resultat);

  } catch (error) {
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
  }
  finally {
    carregantDades.value = false;
  }
}

/**
 * Funció per fer la crida GET a l'endpoint /Plats per obtenir els plats. Es necessita JWT.
 */
async function obtenirPlats() {
  carregantDades.value = true;
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Plats/", {
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

    plats.value = data.resultat;

  } catch (error) {
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
  finally {
    carregantDades.value = false;
  }
}

//Funció que filtra les dades de platsDiaFiltrats segons els filtres assignats (per plat i per dia).
function filtrar() {
  platsDiaFiltrats.value = platsDia.value.filter(pd => {
    return (filtrePlat.value === "" || pd.idPlat === filtrePlat.value) &&
      (filtreDia.value === "" || pd.idDia === filtreDia.value);
  });
}

//Abans de montar la pàgina obtè les dades tant de platDia, diesSetmana com de plats.
onBeforeMount(() => {
  obtenirPlatsDia();
  obtenirDiesSetmana();
  obtenirPlats();
})
</script>

<template>
  <div id="contenidor-platdia-gestio">
    <h1>Plat dia</h1>
    <div v-if="platsDiaFiltrats.length === 0 && carregantDades" class="iconaCarregantDades"></div>
    <div v-else id="contingut-platdia-gestio">
      <div class="contenidorSelect">
        <select v-model="filtreDia" @change="filtrar">
          <option value="">Seleccionar dia</option>
          <option v-for="dia in diesSetmana" :key="dia.idDia" :value="dia.idDia">{{ dia.dia }}</option>
        </select>

        <select v-model="filtrePlat" @change="filtrar">
          <option value="">Seleccionar per plat</option>
          <option v-for="plat in plats" :key="plat.id" :value="plat.id">{{ plat.nomPlat }}</option>
        </select>
      </div>

      <DataTable :value="platsDiaFiltrats" tableStyle="min-width: 100%" rowHover paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">
        <template #paginatorstart>
          <Button class="botoInserir" @click="mostrarDialogInserir = true" type="button" severity="secondary" icon="pi pi-plus" label="Assignar un plat a un dia" ></Button>
        </template>
        <Column field="dia" header="Dia" sortable></Column>
        <Column field="nomPlat" header="Nom de plat" sortable></Column>
        <Column header="">
          <template #body="{ data }">
            <div class="accionsDataTable">
              <i class="pi pi-trash icona" @click.stop="eliminarPlatDia(data.idPlat, data.idDia)"></i>
            </div>
          </template>
        </Column>
        <template #paginatorend></template>
      </DataTable>
    </div>

    <!-- Dialog per inserir plat dia -->
    <Dialog v-model:visible="mostrarDialogInserir" header="Inserir tipus de plat" :draggable="true"
      :style="{ width: '350px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
      <div class="contingut-dialog">
        <div>
          <strong>Dia de la setmana: </strong>
          <select v-model="platDiaInserir.idDia">
            <option v-for="dia in diesSetmana" :key="dia.idDia" :value="dia.idDia">{{ dia.dia }}</option>
          </select>
        </div>
        <div>
          <strong>Plat assignat: </strong>
          <select v-model="platDiaInserir.idPlat">
            <option v-for="plat in plats" :key="plat.id" :value="plat.id">{{ plat.nomPlat }}</option>
          </select>
        </div>
        <div class="contenidor-botons">
          <button @click="inserirPlatDia(platDiaInserir.idPlat, platDiaInserir.idDia)">Inserir</button>
          <button @click="mostrarDialogInserir = false">Cancelar</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>


<style scoped>
.botoInserir {
  margin-bottom: 10px;
}

.flex {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: center;
}

.flex * {
  width: max-content;
  margin: 0;
}

.contenidorSelect {
  display: flex;
  justify-content: end;
  gap: 20px;
}

select {
  max-width: 300px;
}
</style>