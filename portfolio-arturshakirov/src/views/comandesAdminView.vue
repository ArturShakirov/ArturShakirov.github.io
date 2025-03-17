<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';

document.title = "Comandes";

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
const comandesFiltrades = ref([]);

const mostrarDialogModificar = ref(false);
const comandaModificada = ref(null);

/**
 * Funció que fa la crida GET a l'endpoint /Comandes i si el retorn es correcte, assigna les comandes a la variable local. Es necessita JWT.
 */
async function obtenirComandesAPI() {
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Comandes/", {
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

        comandes.value = Object.values(data.resultat);
        comandesFiltrades.value = Object.values(data.resultat);
    } catch (error) {
        //Error en la crida
        emit("missatge-error", {"titol": "Error!", "missatge": data.error});
    }
}

/**
 * Funció que fa la crida DELETE al endpoint /Comanda que elimina la comanda amb l'id passat per paràmetre. Es necessita JWT.
 * @param id 
 */
async function eliminarComandaAPI(id) {
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Comanda/", {
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
        emit("missatge-error", {"titol": "Error!", "missatge": data.error});
        return false;
    }
}

/**
 * Funció que fa la crida PUT a l'endpoint /Comanda per modificar l'estat de la comanda amb l'id passat per param. Es necessita JWT.
 * @param id 
 * @param estat 
 */
async function modificarComandaAPI(id, estat) {
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Comanda/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "jwt": props.jwt,
            },
            body: JSON.stringify({ 
                "comandaId": id,
                "estat": estat
             })
        });

        data = await response.json();

        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }

        return true;
    } catch (error) {
        //Error en la crida
        emit("missatge-error", {"titol": "Error!", "missatge": data.error});
        return false;
    }
}

/**
 * Funció asincrona que espera la resposta de la crida a eliminarComanda i si l'operació acaba correctamente, fa un emit per mostrar un toast de success i torna a obtenir les dades.
 * @param id 
 */
async function eliminarComanda(id) {
    if (await eliminarComandaAPI(id)) {
        emit("missatge-success", {"titol": "Èxit!", "missatge": "La comanda ha sigut cancelada."});
        obtenirComandesAPI();
    }
}

/**
 * Funció que assigna a la variable reactiva comandaModifica les mateixes dades que la comanda amb l'id passat per paràmetre i mostra el dialog per modificar.
 * @param id 
 */
function modificarComanda(id) {
    const comanda = comandes.value.find(comanda => comanda.id === id);
    comandaModificada.value =  Object.assign({}, comanda);
    mostrarDialogModificar.value = true;
}

/**
 * Funció que es crida al modificar dades del dialog de modificar. Tanca el dialog i envia les dades de la comanda a la crida API, espera la seva resposta. Si es correcte, envia un emit per mostrar un toast de success i torna a obtenir dades.
 */
async function guardarModificacio() {
    const idComanda = comandaModificada.value.id;
    const estatComanda = comandaModificada.value.estat;
    mostrarDialogModificar.value = false;

    if (await modificarComandaAPI(idComanda, estatComanda)) {
        emit("missatge-success", {"titol": "Èxit!", "missatge": "La comanda ha sigut modificada."});
        obtenirComandesAPI();
    }
}

/**
 * Funció que es crida al fer click a la fila d'una comanda. Obté la comanda per param i redirigeix a la ruta del detall de la comanda a partir de l'id.
 * @param comanda 
 */
function redirigirComanda(comanda) {
    const id = comanda.data.id;
    router.push(`/comandes/${id}`);
}

/**
 * Actualitza les comandes filtrades per l'estat si hi ha algun valor d'estat enviat per paràmetre.
 * @param estat 
 */
function actualitzarFiltreEstat(estat) {
    if (estat) {
        comandesFiltrades.value = comandes.value.filter(comanda => comanda.estat.toLowerCase() == estat);
    } else {
        comandesFiltrades.value = comandes.value;
    }
}

//Abans de montar l'aplicació obté els registres de comandes.
onBeforeMount(() => {
    obtenirComandesAPI();
});
</script>

<template>
    <div id="contenidor-comandes">
        <h1>Comandes</h1>
        <div id="contingut-comandes">
            <div v-if="comandes.length == 0">
                <div class="iconaCarregantDades"></div>
            </div>
            <div v-else>
                <div class="contenidorSelect">
                    <select @change="actualitzarFiltreEstat($event.target.value)">
                        <option value="">Totes</option>
                        <option value="en preparacio">En preparació</option>
                        <option value="entregat">Entregat</option>
                        <option value="cancelat">Cancelat</option>
                    </select>
                </div>
                <DataTable :value="comandesFiltrades" tableStyle="min-width: 100%" rowHover @row-click="redirigirComanda" paginator :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="dataInici" header="Data comanda" sortable></Column>
                    <Column field="dataFi" header="Data entrega" sortable>
                    </Column>
                    <Column field="preuTotal" header="Preu Total" sortable>
                        <template #body="{ data }">
                            {{ data.preuTotal }}€
                        </template>
                    </Column>
                    <Column field="estat" header="Estat" sortable class="capitalize">
                        <template #body="{ data }">
                            <Tag :class="{
                                'p-tag-success': data.estat === 'entregat',
                                'p-tag-danger': data.estat === 'cancelat',
                                'p-tag-warn': data.estat === 'en preparacio'
                            }">
                                {{ data.estat }}
                            </Tag>
                        </template>
                    </Column>
                    <Column header="">
                        <template #body="{ data }">
                            <div class="accionsDataTable" v-if="data.estat !== 'cancelat'">
                                <i class="pi pi-pencil icona" @click.stop="modificarComanda(data.id, data.estat)"></i>
                                <i class="pi pi-trash icona" @click.stop="eliminarComanda(data.id)"></i>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <!-- Dialog per modificar comanda -->
    <Dialog 
        v-model:visible="mostrarDialogModificar"
        header="Modificar comanda"
        :draggable="true"
        :style="{ width: '400px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }"
        modal
    >
        <div class="contingut-dialog">
            <div><strong>ID:</strong> {{ comandaModificada.id }}</div>
            <div>
                <strong>Estat:</strong>
                <select v-model="comandaModificada.estat">
                    <option value="en preparacio">En preparació</option>
                    <option value="entregat">Entregat</option>
                    <option value="cancelat">Cancel·lat</option>
                </select>
            </div>
            <div class="contenidor-botons">
                <button @click="guardarModificacio">Guardar canvis</button>
                <button @click="mostrarDialogModificar = false">Cancelar</button>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.contenidorSelect {
    display: flex;
    justify-content: end;
}

select {
    max-width: 300px;
}
</style>
