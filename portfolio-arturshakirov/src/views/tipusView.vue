<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

document.title = "Tipus de plats"

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
const tipusPlats = ref([]);

const mostrarDialogModificar = ref(false);
const tipusModificat = ref(null);

const mostrarDialogInserir = ref(false);
const tipusInserir = ref(null);

const carregantDades = ref(true);

/**
 * Obté els tipus de plats fent GET a l'endpoint /TipuPlats. Es necessita JWT.
 */
 async function obtenirTipusPlats() {
  carregantDades.value = true;
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "TipusPlats/", {
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

    tipusPlats.value = Object.values(data.resultat);

  } catch (error) {
    // Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
  } finally {
    carregantDades.value = false;
  }
}

/**
 * Elimina un tipus de plat fent DELETE a l'endpoint /TipusPlat amb l'id passat per paràmetre. Es necessita JWT.
 * @param id - ID del tipus de plat a eliminar
 */
async function eliminarTipusPlatAPI(id) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "TipusPlat/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "id": id
      })
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    return true;
  } catch (error) {
    // Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    return false;
  }
}

/**
 * Modifica un tipus de plat fent PUT a l'endpoint /TipusPlat amb les dades passades per paràmetre. Es necessita JWT.
 * @param id - ID del tipus de plat a modificar
 * @param nomTipus - Nou nom per al tipus de plat
 */
async function modificarTipusPlatAPI(id, nomTipus) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "TipusPlat/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "id": id,
        "nomTipus": nomTipus,
      })
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    return true;
  } catch (error) {
    // Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    return false;
  }
}

/**
 * Insereix un nou tipus de plat fent POST a l'endpoint /TipusPlat amb el nom passat per paràmetre. Es necessita JWT.
 * @param nomTipus - Nom del tipus de plat a inserir
 */
async function inserirTipusPlatAPI(nomTipus) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "TipusPlat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "nomTipus": nomTipus,
      })
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    return true;
  } catch (error) {
    // Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    return false;
  }
}

/**
 * Elimina un tipus de plat fent la crida a la funció d'eliminar de la API. Si funciona envia un emit per mostrar un toast success i torna a rebre les dades.
 * @param id - ID del tipus de plat a eliminar
 */
async function eliminarTipusPlat(id) {
  if (await eliminarTipusPlatAPI(id)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "Tipus de plat eliminat correctament." });
    obtenirTipusPlats();
  }
}

/**
 * Obre el formulari per modificar un tipus de plat i mostra les dades.
 * @param id - ID del tipus de plat a modificar
 */
function modificarTipusPlat(id) {
  const tipusPlat = tipusPlats.value.find(tipusPlat => tipusPlat.id === id);
  tipusModificat.value = Object.assign({}, tipusPlat);
  mostrarDialogModificar.value = true;
}

/**
 * Desa els canvis realitzats en un tipus de plat fent la crida a la API per modificar un tipus. Si ha funcionat, envia un emit per mostrar un toast success i torna a rebre les dades.
 */
async function guardarModificacio() {
  const id = tipusModificat.value.id;
  const nomTipus = tipusModificat.value.nomTipus;

  mostrarDialogModificar.value = false;

  if (await modificarTipusPlatAPI(id, nomTipus)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "El tipus de plat s'ha modificat." });
    obtenirTipusPlats();
  }
}

/**
 * Insereix un nou tipus de plat fent la crida a la funció de la API per inserir un tipus. Si ha funcionat, envia un emit per mostrar un toast success i torna a rebre les dades.
 */
async function inserirTipusPlat() {
  mostrarDialogInserir.value = false;
  if (await inserirTipusPlatAPI(tipusInserir.value)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "El tipus de plat s'ha afegit correctament." });
    obtenirTipusPlats();
  }
}

/**
 * Càrrega inicial dels tipus de plats quan el component es carrega
 */
onBeforeMount(() => {
  obtenirTipusPlats();
})
</script>

<template>
  <div id="contenidor-tipusplats-gestio">
    <h1>Tipus de plats</h1>
    <div v-if="tipusPlats.length === 0" class="iconaCarregantDades"></div>
    <div v-else id="contingut-tipusplats-gestio">
      <DataTable :value="tipusPlats" tableStyle="min-width: 100%" rowHover paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">
        <template #paginatorstart>
          <Button class="botoInserir" @click="mostrarDialogInserir = true" type="button" severity="secondary" icon="pi pi-plus" label="Inserir nou tipus" ></Button>
        </template>
        <Column field="id" header="ID" sortable></Column>
        <Column field="nomTipus" header="Nom tipus" sortable></Column>
        <Column header="">
          <template #body="{ data }">
            <div class="accionsDataTable">
              <i class="pi pi-pencil icona" @click.stop="modificarTipusPlat(data.id)"></i>
              <i class="pi pi-trash icona" @click.stop="eliminarTipusPlat(data.id)"></i>
            </div>
          </template>
        </Column>
        <template #paginatorend></template>
      </DataTable>
    </div>
    
    <!-- Dialog per modificar tipus de plat -->
    <Dialog v-model:visible="mostrarDialogModificar" header="Modificar tipus de plat" :draggable="true"
      :style="{ width: '350px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
      <div class="contingut-dialog">
        <div><strong>ID: </strong> {{ tipusModificat.id }}</div>
        <div class="flex"><strong>Nom tipus: </strong> <input type="text" v-model="tipusModificat.nomTipus"></div>
        <div class="contenidor-botons">
          <button @click="guardarModificacio">Guardar canvis</button>
          <button @click="mostrarDialogModificar = false">Cancelar</button>
        </div>
      </div>
    </Dialog>

    <!-- Dialog per inserir tipus de plat -->
    <Dialog v-model:visible="mostrarDialogInserir" header="Inserir tipus de plat" :draggable="true"
      :style="{ width: '350px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
      <div class="contingut-dialog">
        <div class="flex"><strong>Nom tipus: </strong> <input type="text" v-model="tipusInserir"></div>
        <div class="contenidor-botons">
          <button @click="inserirTipusPlat">Inserir</button>
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