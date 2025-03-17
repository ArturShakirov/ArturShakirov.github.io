<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';

document.title = "Menus gestió"

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
const diesSetmana = ref([]);

const mostrarDialogModificar = ref(false);
const diaSetmanaModificat = ref(null);

const carregantDades = ref(true);

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
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
  finally {
    carregantDades.value = false;
  }
}

/**
 * Funció que fa la crida PUT a l'endpoint /DiesSetmana per modificar el dia que té l'id passat per paràmetre amb el preu passat per paràmetre. Es necessita JWT.
 * @param id 
 * @param preu 
 */
async function modificarDiaSetmanaAPI(id, preu) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "DiesSetmana/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "idDia": id,
        "preuBase": preu,
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
 * Funció que assigna a la variable reactiva diaSetmanaModificar les mateixes dades que la comanda amb l'id passat per paràmetre i mostra el dialog per modificar.
 * @param id 
 */
function modificarDiaSetmana(id) {
  const diaSetmana = diesSetmana.value.find(ds => ds.idDia === id);
  diaSetmanaModificat.value = Object.assign({}, diaSetmana);
  mostrarDialogModificar.value = true;
}

/**
 * Funció que es crida al modificar dades del dialog de modificar. Tanca el dialog i envia les dades de la comanda a la crida API, espera la seva resposta. Si es correcte, envia un emit per mostrar un toast de success i torna a obtenir dades.
 */
async function guardarModificacio() {
  const idDia = diaSetmanaModificat.value.idDia;
  const preuBase = diaSetmanaModificat.value.preuBase;
  mostrarDialogModificar.value = false;

  if (await modificarDiaSetmanaAPI(idDia, preuBase)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": `El menú de ${diaSetmanaModificat.value.dia} s'ha modificat.` });
    obtenirDiesSetmana();
  }
}

//Abans de montar la pàgina fa la crida inicial per obtenir les dades dels dies de la setmana.
onBeforeMount(() => {
  obtenirDiesSetmana();
})
</script>

<template>
  <div id="contenidor-diesSetmana-gestio">
    <h1>Menús / dies setmana</h1>
    <div v-if="diesSetmana.length === 0 && carregantDades" class="iconaCarregantDades"></div>
    <div v-else id="contingut-diesSetmana-gestio">
      <DataTable :value="diesSetmana" tableStyle="min-width: 100%" rowHover paginator :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">
        <Column field="idDia" header="ID" sortable></Column>
        <Column field="dia" header="Dia" sortable></Column>
        <Column field="preuBase" header="Preu base" sortable>
          <template #body="{ data }">
            {{ data.preuBase }}€
          </template>
        </Column>
        <Column header="">
          <template #body="{ data }">
            <div class="accionsDataTable">
              <i class="pi pi-pencil icona" @click.stop="modificarDiaSetmana(data.idDia)"></i>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog per modificar dia setmana -->
    <Dialog v-model:visible="mostrarDialogModificar" header="Modificar dia setmana" :draggable="true"
      :style="{ width: '400px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
      <div class="contingut-dialog">
        <div><strong>ID: </strong> {{ diaSetmanaModificat.idDia }}</div>
        <div><strong>Dia: </strong> {{ diaSetmanaModificat.dia }}</div>
        <div class="flex"><strong>Preu base: </strong> <input type="number" min="10" v-model="diaSetmanaModificat.preuBase">€</div>
        <div class="contenidor-botons">
          <button @click="guardarModificacio">Guardar canvis</button>
          <button @click="mostrarDialogModificar = false">Cancelar</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
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

input {
  width: min-content;
}
</style>