<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import Dialog from 'primevue/dialog';
import ToggleButton from 'primevue/togglebutton';
import Button from 'primevue/button';

document.title = "Suplements"

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
const suplements = ref([]);
const suplementsFiltrats = ref([]);
const filtreActiu = ref("");

const mostrarDialogModificar = ref(false);
const suplementModificat = ref(null);

const mostrarDialogInserir = ref(false);
const suplementInserir = ref({
    suplement: "",
    preu: 0,
    platId: null
});

const plats = ref([]);

const carregantDades = ref(true);

/**
 * Fa la crida GET a l'enpoint /Suplements per obtenir tots els suplemente. Es necessita JWT.
 */
async function obtenirSuplements() {
    carregantDades.value = true;
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Suplements/", {
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

        suplements.value = Object.values(data.resultat);
        suplementsFiltrats.value = Object.values(data.resultat);

    } catch (error) {
        //Error en la crida
        emit("missatge-error", {"titol": "Error!", "missatge": data.error});
    } finally {
        carregantDades.value = false;
        filtreActiu.value = "";
    }
}

/**
 * Obté els plats fent la crida GET a l'endpoint /Plats. Es necessita JWT.
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
        emit("missatge-error", { "titol": "Error!", "missatge": data.error });
    } finally {
        carregantDades.value = false;
    }
}

/**
 * Elimina el suplement amb l'id passat per paràmetre fent la crida DELETE a l'endpoint /Suplements.
 * @param id 
 */
async function eliminarSuplementAPI(id) {
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Suplements/", {
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
 * Fa la crida a la API per eliminar el suplement amb l'id passat per paràmetre, si s'ha eliminat, envia un emit per mostrar un toast success i torna a obtenir les dades.
 * @param id 
 */
async function eliminarSuplement(id) {
    if (await eliminarSuplementAPI(id)) {
        emit("missatge-success", { "titol": "Èxit!", "missatge": "Suplement desactivat correctament." });
        obtenirSuplements();
    }
}

/**
 * Modifica el suplement amb les dades passades per paràmetre fent PUT a l'enpoint /Suplements. Es necessita JWT.
 * @param id 
 * @param nomSuplement 
 * @param preu 
 * @param actiu 
 */
async function modificarSuplementAPI(id, nomSuplement, preu, actiu) {
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Suplements/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "jwt": props.jwt,
            },
            body: JSON.stringify({
                "id": id,
                "suplement": nomSuplement,
                "preu": preu,
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
 * Obre el dialog per modificar un suplement seleccionat i mostra les seves dades.
 */
function modificarSuplement(id) {
    const suplement = suplements.value.find(suplement => suplement.id === id);
    suplementModificat.value = Object.assign({}, suplement);
    suplementModificat.value.actiu = Boolean(suplementModificat.value.actiu);
    mostrarDialogModificar.value = true;
}

/**
 * Guarda els canvis fets al suplement modificat i fa la crida a la API per modificar-ho. Si es correcte, envia un emit on mostra toast success i obté de nou els supkements.
 */
async function guardarModificacio() {
    const id = suplementModificat.value.id;
    const nomSuplement = suplementModificat.value.suplement;
    const preu = suplementModificat.value.preu;
    const actiu = Number(suplementModificat.value.actiu);

    mostrarDialogModificar.value = false;

    if (await modificarSuplementAPI(id, nomSuplement, preu, actiu)) {
        emit("missatge-success", { "titol": "Èxit!", "missatge": "El suplement ha sigut modificat." });
        obtenirSuplements();
    }
}

/**
 * Filtra els suplements segons si estan actius o no
 */
function filtrar() {
    suplementsFiltrats.value = suplements.value.filter(suplement => {
        return (filtreActiu.value === "" || suplement.actiu === Number(filtreActiu.value))
    });
}

/**
 * 
 */
async function inserirSuplementAPI() {
    let data = "";
    try {
        const response = await fetch(import.meta.env.VITE_RUTA_API + "Suplements/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "jwt": props.jwt,
            },
            body: JSON.stringify({
                suplement: suplementInserir.value.suplement,
                preu: suplementInserir.value.preu,
                platId: suplementInserir.value.platId
            })
        });

        data = await response.json();

        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }

        return true;
    } catch (error) {
        emit("missatge-error", { "titol": "Error!", "missatge": data.error });
        return false;
    }
}

/**
 * 
 */
async function inserirSuplement() {
    mostrarDialogInserir.value = false;

    if (await inserirSuplementAPI()) {
        emit("missatge-success", { titol: "Èxit!", missatge: "El suplement s'ha afegit correctament." });
        obtenirSuplements();
    }

    suplementInserir.value = { suplement: "", preu: 0, platId: null };
}

//Càrrega inicial de suplements i plats quan la pàgina es carrega
onBeforeMount(() => {
    obtenirSuplements();
    obtenirPlats();
})
</script>

<template>
    <div id="contenidor-suplements-gestio">
        <h1>Suplements</h1>
        <div v-if="suplementsFiltrats.length === 0 && carregantDades" class="iconaCarregantDades"></div>
        <div v-else id="contingut-suplements-gestio">
            <div class="contenidorSelect">
                <select v-model="filtreActiu" @change="filtrar">
                    <option value="">Tots</option>
                    <option value="1">Actius</option>
                    <option value="0">Inactius</option>
                </select>
            </div>

            <DataTable :value="suplementsFiltrats" tableStyle="min-width: 100%" rowHover paginator :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50, 100]" responsiveLayout="scroll">

                <template #paginatorstart>
                    <Button class="botoInserir" @click="mostrarDialogInserir = true" type="button" severity="secondary"
                        icon="pi pi-plus" label="Inserir nou suplement"></Button>
                </template>

                <Column field="id" header="ID" sortable></Column>
                <Column field="nomPlat" header="Plat assignat" sortable></Column>
                <Column field="suplement" header="Nom suplement" sortable></Column>
                <Column field="preu" header="Preu" sortable>
                    <template #body="{ data }">
                        {{ data.preu }}€
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
                        <div class="accionsDataTable">
                            <i class="pi pi-pencil icona" @click.stop="modificarSuplement(data.id)"></i>
                            <i class="pi pi-trash icona" v-if="data.actiu" @click.stop="eliminarSuplement(data.id)"></i>
                        </div>
                    </template>
                </Column>
                <template #paginatorend></template>
            </DataTable>
        </div>

        <!-- Dialog per modificar suplement -->
        <Dialog v-model:visible="mostrarDialogModificar" header="Modificar suplement" modal>
            <div class="contingut-dialog">
                <div class="flex"><strong>ID:</strong> {{ suplementModificat.id }}</div>
                <div class="flex"><strong>Suplement:</strong> <input type="text" v-model="suplementModificat.suplement" /></div>
                <div class="flex"><strong>Preu:</strong> <input type="number" min="0.1" v-model="suplementModificat.preu" />€
                </div>
                <ToggleButton v-model="suplementModificat.actiu" :onLabel="'Actiu'" :offLabel="'Inactiu'"
                    :onIcon="'pi pi-check'" :offIcon="'pi pi-times'" />
                <div class="contenidor-botons">
                    <button @click="guardarModificacio">Guardar canvis</button>
                    <button @click="mostrarDialogModificar = false">Cancelar</button>
                </div>
            </div>
        </Dialog>

        <!-- Dialog per inserir tipus de plat -->
        <Dialog v-model:visible="mostrarDialogInserir" header="Inserir suplement" :draggable="true"
            :style="{ width: '350px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
            <div class="contingut-dialog">
                <div class="flex"><strong>Nom suplement: </strong> <input type="text"
                        v-model="suplementInserir.suplement">
                </div>
                <div class="flex"><strong>Preu: </strong> <input type="number" min="0.1" v-model="suplementInserir.preu">€</div>
                <div>
                    <strong>Plat assignat: </strong>
                    <select v-model="suplementInserir.platId">
                        <option v-for="plat in plats" :key="plat.id" :value="plat.id">{{ plat.nomPlat }}</option>
                    </select>
                </div>
                <div class="contenidor-botons">
                    <button @click="inserirSuplement">Inserir</button>
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

input,
select {
    margin: 8px;
    width: min-content;
}

.flex {
    display: flex;
    gap: 20px;
    align-items: center;
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