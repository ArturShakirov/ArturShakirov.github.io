<script setup>
//Imports
import { onBeforeMount, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import contenidorTipus from '@/components/contenidorTipus.vue';
import { useUsuariStore } from '@/stores/usuariStore';
import { useConfirm } from "primevue/useconfirm";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/*Per mostrar un ticket en PDF i poder-ho imprimir*/
const pdfContent = ref(null);

/**
 * Funció per descarregar el menú del dia en format PDF
 */
async function descarregarPDF() {
  mostrarMenuSimple.value = true;
  const element = pdfContent.value;
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a5");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //Afegir la imatge del menú
  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

  //Carregar el logo
  const logo = new Image();
  logo.src = "/imatges/logoDIA.png";
  logo.onload = () => {
    const logoHeight = 8;
    const aspectRatio = logo.naturalWidth / logo.naturalHeight;
    const logoWidth = logoHeight * aspectRatio;

    pdf.addImage(logo, "PNG", 110, 12, logoWidth, logoHeight);
    pdf.save(`Menu${diaSetmana}-Shakarcia.pdf`);
    mostrarMenuSimple.value = false;
  };
}


//Props
const props = defineProps({
  jwt: {
    type: String,
    required: true
  }
});

//Emits
const emit = defineEmits(["missatge-correcte", "missatge-error"]);

//Constants
const confirm = useConfirm();

const usuariStore = useUsuariStore();
const route = useRoute();
const router = useRouter();
const idMenu = route.params.id;

const dies = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
const diaSetmana = dies[idMenu] || 'Diumenge';
const diaActual = dies[new Date().getDay()];
const esMenuDelDia = computed(() => diaSetmana === diaActual);
//Hora entrega inicialitzada a l'hora actual
const horaEntrega = ref(new Date());

const plats = ref([]);
const tipusPlats = ref([]);
const platsSeleccionats = ref({});
const cercadorPlats = ref('');
const preuTotal = ref(0);
const preuBaseMenu = ref(0);
const mostrarDialog = ref(false);

const refElementMenuFlotant = ref(null);

const mostrarMenuSimple = ref(false);

//Filtra els plats segons el cercador
const platsFiltrats = computed(() => {
  if (!cercadorPlats.value) {
    return plats.value;
  }
  const cerca = cercadorPlats.value.toLowerCase();
  return plats.value.filter(plat => plat.nomPlat.toLowerCase().includes(cerca));
});

//Comprova si la comanda està completa (si tots els plats estan seleccionats)
const esComandaCompleta = computed(() => {
  if (!tipusPlats.value.length) return false;
  return tipusPlats.value.every(tipus => platsSeleccionats.value[tipus.id]);
});

//Calcula el temps màxim de preparació dels plats seleccionats
const maxTempsPreparacioCalculat = computed(() => {
  const temps = Object.values(platsSeleccionats.value).map(p => p.tempsPreparacio || 0);
  return temps.length ? Math.max(...temps) : 0;
});

/**
 * Obté la llista de plats des del servidor fent GET a l'endpoint /Menu. Es necessita API-KEY,
 */
async function obtenirPlats() {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Menu/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
        "api-key": import.meta.env.VITE_API_KEY,
        "diaSetmana": idMenu
      }
    });

    if (!response.ok) {
      throw new Error("Error en la petició");
    }

    data = await response.json();
    plats.value = Object.values(data.resultat.menu);
    preuTotal.value = data.resultat.diaSetmana.preuBase;
    preuBaseMenu.value = preuTotal.value;

  } catch (error) {
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
  }
}

/**
 * Obté la llista de tipus de plats des del servidor fent GET a l'endpoint /TipusPlats. Es necessita API-KEY.
 */
async function obtenirTipusPlats() {
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "TipusPlats/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": import.meta.env.VITE_API_KEY,
      }
    });

    const data = await response.json();
    tipusPlats.value = Object.values(data.resultat);
  } catch (error) {
    //Error crida
    emit("missatge-error", { "titol": "Error!", "missatge": "Error obtenint els tipus de plats" });
  }
}

/**
 * Funció que fa la crida POST a l'endpoint /Comanda per inserir una nova comanda. Es necessita JWT.
 */
async function enviarComanda() {
  let data = "";

  try {
    const platsPerEnviar = Object.values(platsSeleccionats.value).map(plat => ({
      platId: plat.platId,
      suplementId: plat.suplementId
    }));

    const response = await fetch(import.meta.env.VITE_RUTA_API + "Comanda/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt": props.jwt,
      },
      body: JSON.stringify({
        plats: platsPerEnviar,
        idUsuari: usuariStore.idUsuari,
        preuDia: preuBaseMenu.value
      })
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error en la petició: ${response.statusText}`);
    }

    emit("missatge-success", { "titol": "Èxit", "missatge": "Comanda enviada correctament" });
    platsSeleccionats.value = [];
    router.push("/teves-comandes");
  } catch (error) {
    //Error en la crida
    emit("missatge-error", { "titol": "Error!", "missatge": data.error });
  }
}

/**
 * Retorna només els plats d'un tipus específic amb l'id passat per paràmetre.
 * @param idTipus 
 */
function retornarPlats(idTipus) {
  return platsFiltrats.value.filter(plat => plat.tipus_id === idTipus);
}

/**
 * Assigna un plat seleccionat i actualitza tant el preu total com la nova data d'entrega si és el temps màxim entre els plats seleccionats.
 * @param plat 
 */
function assignarPlatSeleccionat(plat) {
  if (platsSeleccionats.value[plat.tipusId]) {
    preuTotal.value -= platsSeleccionats.value[plat.tipusId].suplementPreu;
    preuTotal.value += plat.suplementPreu;
  }

  //Convertim el temps de preparació del plat a mil·lisegons (suposant que tempsPreparacio està en minuts)
  const tempsPreparacioMs = plat.tempsPreparacioPlat * 60 * 1000;

  //Si aquest plat té un temps de preparació més alt que l'actual, l'actualitzem
  platsSeleccionats.value[plat.tipusId] = { "platId": plat.platId, "suplementId": plat.suplementId, "suplementPreu": plat.suplementPreu || 0, "tempsPreparacio": tempsPreparacioMs };
  horaEntrega.value = new Date(Date.now() + maxTempsPreparacioCalculat.value);
}

/**
 * Deselecciona un plat i actualitza el preu total i l'hora d'entrega segons els plats seleccionats.
 * @param idTipus 
 */
function deseleccionarPlat(idTipus) {
  preuTotal.value -= platsSeleccionats.value[idTipus].suplementPreu;
  delete platsSeleccionats.value[idTipus];

  horaEntrega.value = new Date(Date.now() + maxTempsPreparacioCalculat.value);
}

/**
 * Fa el desplaçament suau fins a un contenidor amb l'id passat com paràmetre.
 * @param id 
 */
function scrollAContenidor(id) {
  const contenidor = document.getElementById(id);
  contenidor.scrollIntoView({ behavior: "smooth" });
}

/**
 * Controla el comportament del menú flotant quan es fa scroll a la pàgina
 */
function menuFlotantScroll() {
  const menuFlotant = refElementMenuFlotant.value;

  if (menuFlotant) {
    const menuFlotantTop = menuFlotant.getBoundingClientRect().top;

    if (menuFlotantTop <= 0) {
      menuFlotant.className = "contenidorMenuFlotantVisible";
    } else {
      menuFlotant.className = "contenidorMenuFlotant";
    }
  }
}

/**
 * Funció que confirma que l'usuari estigui logat, si no, mostra un dialog per iniciar sessió. Si està logat mostra un popup per confirmar la comanda.
 */
function confirmarComanda() {
  if (!usuariStore.idUsuari) {
    mostrarDialog.value = true;
    return;
  }

  confirm.require({
    message: 'Estas a punt de fer una comanda',
    header: 'Confirmació de comanda',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel·lar',
      severity: 'danger',
      outlined: true
    },
    acceptProps: {
      label: 'Realitzar comanda',
      severity: 'success',
    },
    accept: () => {
      enviarComanda();
    },
    reject: () => {
      emit("missatge-error", { "titol": "Comanda cancelada", "missatge": "Has cancelat la teva comanda" });
    }
  });
}

//Abans de montar la pàgina obtè els plats i els tipus de plats.
onBeforeMount(() => {
  obtenirPlats();
  obtenirTipusPlats();
});

//Al montar la pàgina assigna un eventListener de scroll pel menú flotant.
onMounted(() => {
  window.addEventListener("scroll", menuFlotantScroll);
});

//Al acabar l'instància de la pàgina elimina l'eventListener del menú flotant.
onUnmounted(() => {
  window.removeEventListener("scroll", menuFlotantScroll);
});
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <div id="contenidor-seleccionarplats">
    <RouterLink class="botoSecundari" to="/menus"><- Tornar a menus</RouterLink>
        <h1 v-if="esMenuDelDia">Selecciona els teus plats</h1>
        <h1 v-else>No és el menú del dia</h1>

        <div class="flex">
          <div class="contenidorSubtitol">
            <h3 class="subtitol">Menú del {{ diaSetmana.toLowerCase() }}</h3>
          </div>
          <div v-if="horaEntrega && preuTotal" class="contenidorDadesMenu">
            <h2 v-if="preuTotal" class="preuTotal">{{ preuTotal }}€</h2>
            <div class="horaEstimadaPreparacio">Entrega a les: <strong>{{ horaEntrega.toLocaleTimeString([], {
                hour12:false }) }}</strong></div>
          </div>
        </div>

        <!-- NAV AMB LA LLISTA DE BOTONS AMB ELS TIPUS DE PLATS I EL CERCADOR -->
        <div v-if="tipusPlats && tipusPlats.length > 0" id="nav-tipusplats">
          <div id="botons-tipusplats">
            <button class="tipusPlat" v-for="tipus in tipusPlats" :key="tipus.id"
              @click="scrollAContenidor('contenidor-tipus' + tipus.id)">
              {{ tipus.nomTipus }}
            </button>
          </div>
          <div>
            <IconField>
              <InputText id="inputSeleccionarPlats" v-model="cercadorPlats" placeholder="Cerca plats" />
              <InputIcon class="pi pi-search" />
            </IconField>
          </div>
        </div>

        <!-- MENU FLOTANT QUE APAREIX AL FER SCROLL A LA PÀGINA -->
        <div ref="refElementMenuFlotant" id="contenidorMenuFlotant" class="contenidorMenuFlotant">
          <h2 v-if="preuTotal" class="preuTotal">{{ preuTotal }}€</h2>
          <h2 v-if="horaEntrega" class="horaEstimadaPreparacio">Hora d'entrega: {{ horaEntrega.toLocaleTimeString([], {
            hour12: false })}}</h2>
        </div>

        <!-- CONTENIDOR AMB ELS PLATS -->
        <div v-if="!plats.length">
          <div class="iconaCarregantDades"></div>
        </div>
        <div v-else-if="platsFiltrats.length === 0">No s'han trobat plats amb aquesta cerca.</div>
        <div v-else id="contingut-seleccionarplats">
          <contenidorTipus v-for="tipus in tipusPlats" :key="tipus.id" :idTipus="tipus.id" :nomTipus="tipus.nomTipus"
            :plats="retornarPlats(tipus.id)" @retornarPlatSeleccionat="assignarPlatSeleccionat"
            @deseleccionarPlat="deseleccionarPlat" :esMenuDelDia="esMenuDelDia" />

          <button id="btnFerComanda" @click="confirmarComanda" :disabled="!esComandaCompleta || !esMenuDelDia">Realitzar
            comanda</button>
        </div>
  </div>


  <!-- Dialog si no està logat -->
  <Dialog v-model:visible="mostrarDialog" header="Has de iniciar sessió" :draggable="false"
    :style="{ width: '400px', 'min-width': 'fit-content', padding: '1em', margin: '0 20px' }" modal>
    <div class="contingut-dialog">
      <div>Per poder realitzar una comanda primer has d'iniciar sessió!</div>
      <div class="contenidor-botons">
        <RouterLink to="/iniciar-sessio"><button>Iniciar sessió</button></RouterLink>
      </div>
    </div>
  </Dialog>

  <!-- HTML del menú del dia que es mostra al fer click a Veure menu simple. Aquest HTML es el que després es podrà imprimir -->
  <div v-if="mostrarMenuSimple">
    <div id="pdfContent" ref="pdfContent" class="pdf-container">

      <div class="flex">
        <div>
          <h1 class="titolMenuImprimir">Menú del <span>{{ diaSetmana.toLowerCase() }}</span></h1>
        </div>
      </div>

      <div class="flex">
        <div v-if="preuBaseMenu">
          <h2 v-if="preuBaseMenu" class="preuTotal">Preu base: <span>{{ preuBaseMenu }}€</span></h2>
        </div>
      </div>

      <div class="contingut-menu-imprimir">
        <div v-for="tipus in tipusPlats" :key="tipus.id" class="contingut-tipus-menu-imprimit">
          <h2>{{ tipus.nomTipus }}</h2>
          <div v-for="plat in plats" :key="plat.id">
            <div v-if="plat.tipus_id === tipus.id" class="contingut-plat-menu-imprimir">
              <strong>{{ plat.nomPlat }}</strong>
              <p> | {{ plat.descripcio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- BOTÓ PER IMPRIMIR EL MENÚ EN FORMAT PDF -->
  <button @click="descarregarPDF">
    <p v-if="mostrarMenuSimple">Imprimir menú</p>
    <p v-else>Veure menú simple</p>
  </button>


</template>


<style scoped>
.horaEstimadaPreparacio {
  font-family: var(--montserrat);
  font-size: 96%;
  border-left: 1px solid gray;
  padding-left: 20px;
}

.p-inputtext {
  font-size: 13px;
  border-radius: 5px;
  border-radius: none;
  transition: border 0.3s ease;
}

.p-inputicon {
  top: 25%;
}

h1 {
  margin-top: 20px;
  margin-bottom: 5px;
}

.contenidorDadesMenu {
  display: flex;
  flex-direction: column;
  justify-content: end;
  text-align: end;
  min-width: fit-content;
  gap: 10px;
}

.flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 25px;
  width: 100%;
}

#contingut-seleccionarplats {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
}

#nav-tipusplats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
  gap: 10px;
}

#botons-tipusplats {
  display: flex;
  gap: 10px;
}

#nav-tipusplats * {
  margin: 0;
}

#nav-tipusplats>div {
  margin-top: 5px;
}

button.tipusPlat {
  background: #1f1f1f !important;
  color: var(--blanc);
  border-radius: 3em;
  padding: 6px 12px;
}

button.tipusPlat:hover {
  opacity: 0.8;
}

#btnFerComanda {
  width: fit-content;
}

.contenidorMenuFlotant {
  visibility: hidden;
  font-size: 0;
  padding: 0;
}

.contenidorMenuFlotantVisible {
  visibility: visible;
  position: sticky;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;
  top: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  border-radius: 0.5em;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  transition: 0.1s ease-in-out;
}

.titolMenuImprimir {
  margin-top: 0;
  padding-top: 0;
}

.contingut-menu-imprimir {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contingut-plat-menu-imprimir {
  margin-bottom: 7px;
}

.contingut-tipus-menu-imprimit > h2 {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--gris);
  width: fit-content;
  margin-bottom: 10px;
}

@media (max-width: 450px) {
  .flex {
    margin-top: 25px;
    flex-direction: column;
    justify-content: start;
    text-align: start;
    gap: 10px;
  }

  .flex .contenidorSubtitol,
  .flex .contenidorDadesMenu {
    display: flex;
    justify-content: left;
    width: 100%;
  }

  .flex>.contenidorDadesMenu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    text-align: start;
    gap: 10px;
  }
}
</style>