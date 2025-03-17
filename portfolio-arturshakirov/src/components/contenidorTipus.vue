<script setup>
//Imports
import { ref } from 'vue';
import Plat from './plat.vue';

//Props
const props = defineProps({
    idTipus: {
        type: Number,
        required: true
    },
    nomTipus: {
        type: String,
        required: true
    },
    plats: {
        type: Array,
        required: true
    },
    esMenuDelDia: {
        type: Boolean,
        required: true
    }
});

//Emit
const emit = defineEmits(['retornarPlatSeleccionat']);

//Constants
const platSeleccionat = ref(null);

/**
 * Assigna el plat passat per param localment i retorna el plat selecionat que li ve per param dins l'emit de retornarPlatSeleccionat pasant les dades del plat.
 * @param dadesPlatSeleccionat 
 */
function retornarPlatSeleccionat(dadesPlatSeleccionat) {
    platSeleccionat.value = dadesPlatSeleccionat;
    emit('retornarPlatSeleccionat', platSeleccionat.value);
}

/**
 * Desselecciona el plat seleccionat del tipus i fa un emit a seleccionarPlatsView per desseleccionar el plat allà pasant el idTipus.
 */
function deseleccionarPlat() {
    platSeleccionat.value = null;
    emit('deseleccionarPlat', props.idTipus);
}
</script>

<template>
    <div class="contenidor-tipusPlats" v-bind:id="'contenidor-tipus' + idTipus">
        <div class="flex">
            <h2>{{ nomTipus }}</h2>
            <p v-if="platSeleccionat" class="botoSecundari" @click="deseleccionarPlat">Deseleccionar</p>
        </div>
        <div class="contingut-tipus">
            <Plat 
                v-for="plat in plats" 
                :key="plat.id" 
                :dadesPlat="plat" 
                :seleccionat="platSeleccionat && platSeleccionat.platId === plat.id" 
                :esMenuDelDia="props.esMenuDelDia" 
                @platSeleccionat="retornarPlatSeleccionat" 
            />
        </div>
    </div>
</template>

<style scoped>
h2 {
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
    width: fit-content;
}

.flex {
    display: flex;
    gap: 30px;
    margin-top: 45px;
    align-items: center;
}

.contenidor-tipusPlats {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}
.contingut-tipus {
    display: flex;
    gap: 25px;
    flex-wrap: wrap;
}
</style>