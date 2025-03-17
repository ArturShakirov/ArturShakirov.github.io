<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';

document.title = "Plats"

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
const plats = ref([]);
const platsFiltrats = ref([]);

const tipusPlats = ref([]);

const mostrarDialogModificar = ref(false);
const platModificat = ref(null);
const imatgeSeleccionada = ref(null);

const mostrarDialogInserir = ref(false);
const platInserir = ref({
  nomPlat: "",
  tipus_id: "",
  descripcio: "",
  rutaImatge: "",
  tempsPreparacio: 0,
  teGluten: null,
  teLactosa: null,
});

const filtreActiu = ref("");

const carregantDades = ref(true);

/**
 * Funció per la crida GET a l'endpoint /Plats per obtenir les dades dels plats. Es necessita JWT.
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
    platsFiltrats.value = Object.values(data.resultat);
    
  } catch (error) {
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
  finally {
    carregantDades.value = false;
    filtreActiu.value = "";
  }
}

/**
 * Fa una copia del plat amb l'id passat per paràmetre i obre el dialog de modificar.
 * @param id 
 */
function modificarPlat(id) {
  const plat = plats.value.find(p => p.id === id);
  platModificat.value = Object.assign({}, plat);
  imatgeSeleccionada.value = null;
  mostrarDialogModificar.value = true;
}

/**
 * Funció que maneja la imatge seleccionada en el moment d'inserir o modificar un plat.
 * @param event 
 */
function uploadImatge(event) {
  const file = event.target.files[0];
  if (file) {
    imatgeSeleccionada.value = file;
  } else {
    imatgeSeleccionada.value = null;
  }
}

/**
 * Funció que fa la crida POST a l'endpoint /Plat per modificar un plat i/o la seva imatge. Es necessita JWT.
 */
async function modificarPlatAPI() {
  if (!platModificat.value) {
    emit("missatge-error", { titol: "Error!", missatge: "No s'ha seleccionat cap plat per modificar." });
    return;
  }

  const formData = new FormData();
  formData.append("plat", JSON.stringify(platModificat.value));
  formData.append("editar", JSON.stringify(true));

  if (imatgeSeleccionada.value) {
    formData.append("arxiu", imatgeSeleccionada.value);
  }

  try {
    const resposta = await fetch(import.meta.env.VITE_RUTA_API + "Plat/", {
      method: "POST",
      headers: {
        jwt: props.jwt
      },
      body: formData,
    });

    if (!resposta.ok) {
      throw new Error(`Error HTTP! Estat: ${resposta.status}`);
    }

    return true;
  } catch (error) {
    //Error en la crida
    emit("missatge-error", { titol: "Error!", missatge: "No s'ha pogut modificar el plat!" });
    return false;
  }
}

/**
 * Tanca el dialog de modificar. Crida a la funció de la API per modificar un plat. Si s'ha pogut modificar, envia un emit per mostrar un toast success i torna a obtenir les dades de plats.
 */
async function guardarModificacio() {
  mostrarDialogModificar.value = false;

  if (await modificarPlatAPI()) {
    emit("missatge-success", { titol: "Èxit!", missatge: "Plat modificat correctament." });
    obtenirPlats();
  }
}

/**
 * Funció per la crida DELETE a l'endpoint /Plat per eliminar el plat amb l'id passat per paràmetre.. Es necessita JWT.
 * @param id 
 */
async function eliminarPlatAPI(id) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Plat/", {
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
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    return false;
  }
}

/**
 * Funció per la crida POST a l'endpoint /Plat per inserir un plat amb una imatge i les seves dades. Es necessita JWT.
 */
async function inserirPlatAPI() {
  let data = "";
  try {
    const formData = new FormData();
    formData.append("plat", JSON.stringify(platInserir.value));

    if (imatgeSeleccionada.value) {
      formData.append("arxiu", imatgeSeleccionada.value);
    }

    const response = await fetch(import.meta.env.VITE_RUTA_API + "Plat/", {
      method: "POST",
      headers: {
        "jwt": props.jwt,
      },
      body: formData,
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
 * Rep com paràmetre l'id d'un plat. Crida a la funció de la API per eliminar un plat passant aquest id, si tot correcte, envia un emit que mostra un toast success i torna a obtenir els plats.
 * @param id 
 */
async function eliminarPlat(id) {
  if (await eliminarPlatAPI(id)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "Plat desactivat correctament." });
    obtenirPlats();
  }
}

/**
 * Tanca el dialog d'inserir. Crida a la funció de la API per inserir plat i espera la seva resposta. Si es correcte, fa un emit que mostra un toast success i torna a obtenir les dades.
 */
async function inserirPlat() {
  mostrarDialogInserir.value = false;
  if (await inserirPlatAPI()) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "El plat s'ha afegit correctament." });
    obtenirPlats();
  }
}

/**
 * Funció que fa la crida GET per obtenir els tipus de plats a l'endpoint /TipusPlats. Es necessita JWT.
 */
async function obtenirTipusPlats() {
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
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
  finally {
    carregantDades.value = false;
  }
}

/**
 * Funció que filtra els platsFiltrats pel filtre de actiu.
 */
function filtrar() {
    platsFiltrats.value = plats.value.filter(plat => {
        return (filtreActiu.value === "" || plat.actiu === Number(filtreActiu.value))
    });
}

//Abans de montar la pàgina s'obtenen les dades de plats i de tipus plats.
onBeforeMount(() => {
  obtenirPlats();
  obtenirTipusPlats();
})
</script>

<template>
  <div id="contenidor-plats-gestio">
    <h1>Plats</h1>
    <div v-if="platsFiltrats.length === 0 && carregantDades" class="iconaCarregantDades"></div>
    <div v-else id="contingut-plats-gestio">
      <div class="contenidorSelect">
        <select v-model="filtreActiu" @change="filtrar">
          <option value="">Tots</option>
          <option value="1">Actius</option>
          <option value="0">Inactius</option>
        </select>
      </div>

      <DataTable :value="platsFiltrats" tableStyle="min-width: 100%" rowHover paginator :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">
        <template #paginatorstart>
          <Button class="botoInserir" @click="mostrarDialogInserir = true" type="button" severity="secondary"
            icon="pi pi-plus" label="Inserir nou plat"></Button>
        </template>
        <Column field="id" header="ID" sortable></Column>
        <Column field="nomTipus" header="Nom tipus" sortable></Column>
        <Column field="nomPlat" header="Nom plat" sortable></Column>
        <Column field="descripcio" header="Descripció" sortable></Column>
        <Column field="rutaImatge" header="Imatge">
          <template #body="{ data }">
            <img :src="'/imatges/uploads/' + data.rutaImatge" alt="Imatge del plat" />
          </template>
        </Column>
        <Column field="tempsPreparacio" header="Temps de preparació" sortable>
          <template #body="{ data }">
            <div v-if="data.tempsPreparacio >= 60">
              {{ Math.floor(data.tempsPreparacio / 60) }}h {{ data.tempsPreparacio % 60 }}min
            </div>
            <div v-else>
              {{ data.tempsPreparacio }}min
            </div>
          </template>
        </Column>
        <Column field="teGluten" header="Té gluten" sortable>
          <template #body="{ data }">
            <Tag :class="{
              'p-tag-danger': data.teGluten,
              'p-tag-success': !data.teGluten,
            }">
              {{ data.teGluten ? 'Sí' : 'No' }}
            </Tag>
          </template>
        </Column>
        <Column field="teLactosa" header="Té lactosa" sortable>
          <template #body="{ data }">
            <Tag :class="{
              'p-tag-danger': data.teLactosa,
              'p-tag-success': !data.teLactosa,
            }">
              {{ data.teLactosa ? 'Sí' : 'No' }}
            </Tag>
          </template>
        </Column>
        <Column field="actiu" header="Actiu" sortable>
          <template #body="{ data }">
            <Tag :class="{
              'p-tag-secondary': data.actiu,
              'p-tag-contrast': !data.actiu,
            }">
              {{ data.actiu ? 'Sí' : 'No' }}
            </Tag>
          </template>
        </Column>

        <Column header="">
          <template #body="{ data }">
            <div class="accionsDataTable">
              <i class="pi pi-pencil icona" @click.stop="modificarPlat(data.id)"></i>
              <i class="pi pi-trash icona" v-if="data.actiu" @click.stop="eliminarPlat(data.id)"></i>
            </div>
          </template>
        </Column>
        <template #paginatorend></template>
      </DataTable>
    </div>

    <!-- Dialog per modificar plat -->
    <Dialog v-model:visible="mostrarDialogModificar" header="Modificar plat" :draggable="true"
      :style="{ width: '350px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
      <div class="contingut-dialog">
        <div><strong>ID: </strong> {{ platModificat.id }}</div>
        <div class="flex"><strong>Nom plat: </strong> <input type="text" v-model="platModificat.nomPlat"></div>
        <div><strong>Descripció: </strong> <textarea v-model="platModificat.descripcio"></textarea></div>
        <div class="flex">
          <strong>Tipus de plat: </strong>
          <select v-model="platModificat.tipus_id">
            <option v-for="tipus in tipusPlats" :key="tipus.id" :value="tipus.id">{{ tipus.nomTipus }}</option>
          </select>
        </div>

        <div class="flex">
          <strong>Té gluten: </strong>
          <ToggleButton v-model="platModificat.teGluten" :onLabel="'Si'" :offLabel="'No'" :onIcon="'pi pi-check'"
            :offIcon="'pi pi-times'" />
        </div>

        <div class="flex">
          <strong>Té lactosa: </strong>
          <ToggleButton v-model="platModificat.teLactosa" :onLabel="'Si'" :offLabel="'No'" :onIcon="'pi pi-check'"
            :offIcon="'pi pi-times'" />
        </div>

        <div class="flex"><strong>Temps preparació: </strong> <input type="number" min="1" v-model="platModificat.tempsPreparacio">min</div>
        <div>
          <strong>Modificar imatge: </strong>
          <input type="file" accept=".png,.heic,.jpg,.avif" @change="uploadImatge" />
          <p v-if="imatgeSeleccionada">Imatge seleccionada: {{ imatgeSeleccionada.name }}</p>
          <p v-else-if="platModificat.rutaImatge">Imatge actual: {{ platModificat.rutaImatge }}</p>
        </div>

        <div class="flex">
          <strong>Actiu: </strong>
          <ToggleButton v-model="platModificat.actiu" :onLabel="'Actiu'" :offLabel="'Inactiu'" :onIcon="'pi pi-check'"
            :offIcon="'pi pi-times'" />
        </div>

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
        <div class="flex"><strong>Nom plat: </strong> <input type="text" v-model="platInserir.nomPlat"></div>
        <div><strong>Descripció: </strong> <textarea v-model="platInserir.descripcio"></textarea></div>
        <div class="flex">
          <strong>Tipus de plat: </strong>
          <select v-model="platInserir.tipus_id">
            <option v-for="tipus in tipusPlats" :key="tipus.id" :value="tipus.id">{{ tipus.nomTipus }}</option>
          </select>
        </div>

        <div class="flex">
          <strong>Té gluten: </strong>
          <ToggleButton v-model="platInserir.teGluten" :onLabel="'Si'" :offLabel="'No'" :onIcon="'pi pi-check'"
            :offIcon="'pi pi-times'" />
        </div>

        <div class="flex">
          <strong>Té lactosa: </strong>
          <ToggleButton v-model="platInserir.teLactosa" :onLabel="'Si'" :offLabel="'No'" :onIcon="'pi pi-check'"
            :offIcon="'pi pi-times'" />
        </div>

        <div class="flex"><strong>Temps preparació: </strong> <input type="number" min="1" v-model="platInserir.tempsPreparacio">min
        </div>
        <div>
          <strong>Imatge: </strong>
          <input type="file" accept=".png,.heic,.jpg,.avif" @change="uploadImatge" />
          <p v-if="imatgeSeleccionada">Imatge seleccionada: {{ imatgeSeleccionada.name }}</p>
          <p v-else-if="platInserir.rutaImatge">Imatge actual: {{ platInserir.rutaImatge }}</p>
        </div>

        <div class="contenidor-botons">
          <button @click="inserirPlat">Inserir</button>
          <button @click="mostrarDialogInserir = false">Cancelar</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>


<style scoped>
.p-fileupload-contrast {
  background-color: #000;
  color: #fff;
  border: 2px solid #fff;
  max-width: 200px;
}


img {
  max-height: 100px;
  border-radius: 0.5em;
}

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