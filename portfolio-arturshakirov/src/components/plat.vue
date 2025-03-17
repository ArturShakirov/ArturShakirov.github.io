<script setup>
//Imports
import { ref, watch } from 'vue';

//Props
const props = defineProps({
    dadesPlat: {
        type: Object,
        required: true
    },
    seleccionat: {
        type: Boolean,
        default: false
    },
    esMenuDelDia: {
        type: Boolean,
        default: true
    }
});

//Watcher que comprova si hi ha algun canvi al prop seleccionat i si hi ha un nou valor, fa que es reiniciï el suplement seleccionat
watch(
  () => props.seleccionat,
  (nouValor) => {
    if (!nouValor) {
      suplementSeleccionat.value = null;
    }
  }
);

//Emit
const emit = defineEmits(['platSeleccionat']);

//Constants
const suplementSeleccionat = ref(null);

/**
 * Funció que agafa algunes dades del prop de dadesPlat, comprova si té algun suplement seleccionat i fa un emit enviant les dades tant del plat com del suplement.
 */
function seleccionarPlat() {
    let platId = props.dadesPlat.id;
    let tempsPreparacioPlat = props.dadesPlat.tempsPreparacio;
    let tipusId = props.dadesPlat.tipus_id;

    let suplementId = suplementSeleccionat.value || null;
    let suplementPreu = 0;

    if (suplementId) {
        const suplement = props.dadesPlat.suplements.find(s => s.id === parseInt(suplementId));
        suplementPreu = suplement.preu;
    }

    emit('platSeleccionat', { platId, tempsPreparacioPlat, tipusId, suplementId, suplementPreu });
}

</script>

<template>
    <div class="contenidor-plat" :class="{ seleccionat: seleccionat, deshabilitat: !esMenuDelDia }"
        @click="seleccionarPlat">
        <div class="plat-imatgePlat" :style="{ backgroundImage: `url('/imatges/uploads/${dadesPlat.rutaImatge}')` }"></div>


        <div class="contingut-plat">
            <div class="flex">
                <h3>{{ dadesPlat.nomPlat }}</h3>
                <div>&#128337; {{ dadesPlat.tempsPreparacio }}min</div>
            </div>
            <div>{{ dadesPlat.descripcio }}</div>

            <div class="intolerancies">
                <Tag class="teGluten-plat" severity="danger" v-if="dadesPlat.teGluten" value="Té gluten"></Tag>
                <Tag class="teLactosa-plat" severity="danger" value="Té gluten" v-if="dadesPlat.teLactosa">Té lactosa
                </Tag>
            </div>

            <div class="contenidor-suplementsPlat" v-if="props.dadesPlat.suplements && props.dadesPlat.suplements.length > 0">
                <h4>Suplements:</h4>
                <select id="selectSuplements" v-model="suplementSeleccionat">
                    <option value="" selected>---</option>

                    <option v-for="suplement in props.dadesPlat.suplements" :value="suplement.id">
                        {{ suplement.nom }} - {{ suplement.preu }}€
                    </option>
                </select>
            </div>

        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    justify-content: space-between;
}

.contenidor-plat {
    flex: 1;
    background-color: white;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    border-radius: 1em;
    cursor: pointer;
    transition: 0.15s ease-in-out transform, 0.15s ease-in-out box-shadow;
    overflow: hidden;
    min-width: 250px;
    max-width: 400px;;
}

.contenidor-plat.deshabilitat {
    opacity: 0.5;
    pointer-events: none;
}

.contingut-plat {
    padding: 1.5em;
}

.plat-imatgePlat {
    width: 100%;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.contenidor-plat .plat-imatgePlat {
    background-image: var(--background-image);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.contenidor-plat:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25);
}

.contenidor-plat.seleccionat {
    border: 3px solid var(--verdFosc);
}

.contenidor-suplementsPlat {
    margin-top: 10px;
}

h3 {
    margin-bottom: 10px;
}

.intolerancies {
    display: flex;
    gap: 15px;
    margin: 20px 0;
    height: 33px;
}

.teGluten-plat,
.teLactosa-plat {
    color: var(--vermell);
    font-weight: 600;
    margin-bottom: 0.3em;
}
</style>