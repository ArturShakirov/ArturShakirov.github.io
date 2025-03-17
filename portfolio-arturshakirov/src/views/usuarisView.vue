<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';
import ToggleButton from 'primevue/togglebutton';

document.title = "Usuaris"

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
const usuaris = ref([]);
const usuarisFiltrats = ref([]);

const mostrarDialogModificar = ref(false);
const usuariModificat = ref(null);

const filtreAdministrador = ref("");
const filtreActiu = ref("");
const carregantDades = ref(true);

/**
 * Obtè els usuaris fent GET a l'endpoint /Usuaris. Es necessita JWT.
 */
async function obtenirUsuaris() {
  carregantDades.value = true;
  let data = null;
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Usuaris/", {
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

    usuaris.value = Object.values(data.resultat);
    usuarisFiltrats.value = Object.values(data.resultat);

  } catch (error) {
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
  }
  finally {
    carregantDades.value = false;
  }
}

/**
 * Elimina un usuari fent DELETE a l'endpoint /Usuari amb l'id passat com paràmetre. Es necessita JWT.
 * @param id 
 */
async function eliminarUsuariAPI(id) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Usuari/", {
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
 * Modifica l'usuari fent PUT a l'endpoint /Usuari i passant l'estat d'actiu/inactiu per paràmetre, a part de l'id. Es necessita JWT.
 * @param id 
 * @param actiu 
 */
async function modificarUsuariAPI(id, actiu) {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Usuari/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        "id": id,
        "actiu": actiu,
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
 * Filtra els usuaris per si son actius i si son administradors.
 */
function filtrar() {
  usuarisFiltrats.value = usuaris.value.filter(usuari => {
    return (filtreActiu.value === "" || usuari.actiu === Number(filtreActiu.value)) &&
      (filtreAdministrador.value === "" || usuari.administrador === Number(filtreAdministrador.value));
  });
}

/**
 * Fa la crida a la funció de la API per eliminar un usuari passant-hi l'id per paràmetre. Si s'ha eliminat envia un emit per mostra un toast success i tornar a rebre les dades.
 * @param id 
 */
async function eliminarUsuari(id) {
  if (await eliminarUsuariAPI(id)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "Usuari desactivat correctament." });
    obtenirUsuaris();
  }
}

/**
 * Obre el dialog per modificar un usuari i posa les seves dades ja dins.
 * @param id 
 */
function modificarUsuari(id) {
  const usuari = usuaris.value.find(usuari => usuari.id === id);
  usuariModificat.value = Object.assign({}, usuari);
  usuariModificat.value.actiu = Boolean(usuariModificat.value.actiu);
  mostrarDialogModificar.value = true;
}

/**
 * Fa la crida a la funció de la API per modificar un usuari passant-hi les dades a modificar per paràmetre. Si s'ha pogut modificar envia un emit per mostrar un toast success i torna a rebre les dades.
 */
async function guardarModificacio() {
  const id = usuariModificat.value.id;
  const actiu = Number(usuariModificat.value.actiu);

  mostrarDialogModificar.value = false;

  if (await modificarUsuariAPI(id, actiu)) {
    emit("missatge-success", { "titol": "Èxit!", "missatge": "L'usuari ha sigut modificat." });
    obtenirUsuaris();
  }
}

//Abans de carregar la pàgina obtè les dades dels usuaris.
onBeforeMount(() => {
  obtenirUsuaris();
})
</script>

<template>
  <div id="contenidor-usuaris">
    <h1>Usuaris</h1>
    <div v-if="usuaris.length === 0 && carregantDades" class="iconaCarregantDades"></div>
    <div v-else id="contingut-usuaris">
      <div class="contenidorSelect">
        <select v-model="filtreActiu" @change="filtrar">
          <option value="">Seleccionar per actius</option>
          <option value="1">Actius</option>
          <option value="0">Inactius</option>
        </select>

        <select v-model="filtreAdministrador" @change="filtrar">
          <option value="">Seleccionar per administrador</option>
          <option value="1">Administradors</option>
          <option value="0">No administradors</option>
        </select>
      </div>

      <DataTable :value="usuarisFiltrats" tableStyle="min-width: 100%" rowHover paginator :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">
        <Column field="id" header="ID" sortable></Column>
        <Column field="nomUsuari" header="Nom d'usuari" sortable></Column>
        <Column field="nom" header="Nom" sortable></Column>
        <Column field="cognoms" header="Cognoms" sortable></Column>
        <Column field="dataNaix" header="Data de naixament" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="administrador" header="Administrador" sortable>
          <template #body="{ data }">
            <Tag :class="{
              'p-tag-contrast': data.administrador === 1,
              'p-tag-secondary': data.administrador === 0,
            }">
              {{ data.administrador ? 'Sí' : 'No' }}
            </Tag>
          </template>
        </Column>
        <Column field="actiu" header="Actiu" sortable>
          <template #body="{ data }">
            <Tag :class="{
              'p-tag-success': data.actiu === 1,
              'p-tag-danger': data.actiu === 0,
            }">
              {{ data.actiu ? 'Sí' : 'No' }}
            </Tag>
          </template>
        </Column>
        <Column header="">
          <template #body="{ data }">
            <div class="accionsDataTable" v-if="!data.administrador">
              <i class="pi pi-pencil icona" @click.stop="modificarUsuari(data.id, data.estat)"></i>
              <i v-if="data.actiu" class="pi pi-trash icona" @click.stop="eliminarUsuari(data.id)"></i>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog per modificar usuari -->
    <Dialog v-model:visible="mostrarDialogModificar" header="Modificar usuari" :draggable="true"
      :style="{ width: '400px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
      <div class="contingut-dialog">
        <div><strong>ID: </strong> {{ usuariModificat.id }}</div>
        <div><strong>Nom: </strong> {{ usuariModificat.nom }}</div>
        <div><strong>Cognoms: </strong> {{ usuariModificat.cognoms }}</div>
        <div><strong>Data de naixament: </strong> {{ usuariModificat.dataNaix }}</div>
        <div><strong>Email: </strong> {{ usuariModificat.email }}</div>
          <ToggleButton v-model="usuariModificat.actiu" 
              :onLabel="'Actiu'" 
              :offLabel="'Inactiu'" 
              :onIcon="'pi pi-check'" 
              :offIcon="'pi pi-times'"/>
        <div class="contenidor-botons">
          <button @click="guardarModificacio">Guardar canvis</button>
          <button @click="mostrarDialogModificar = false">Cancelar</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>


<style scoped>
.contenidorSelect {
  display: flex;
  justify-content: end;
  gap: 20px;
}

select {
  max-width: 300px;
}
</style>