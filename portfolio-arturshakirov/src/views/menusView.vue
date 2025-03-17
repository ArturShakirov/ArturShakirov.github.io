<script setup>
//Imports
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

//Constants
const router = useRouter();
const menus = ref([]);

document.title = "Menús";

/**
 * Funció que fa la crida GET de /Menus per obtenir les dades de tots els menús. Es necessita API-KEY.
 */
async function obtenirMenus() {
  let data = "";
  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "Menus/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": import.meta.env.VITE_API_KEY
      }
    });

    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    menus.value = Object.values(data.resultat);
  } catch (error) {
    //Error en la crida
    emit("missatge-error", {"titol": "Error!", "missatge": data.error});
  }
}

/**
 * Funció que redirigeix a la ruta del menú amb l'id passat per paràmetre.
 * @param idMenu 
 */
function mostrarPlats(idMenu) {
  router.push(`/menus/${idMenu}`);
}

//Abans de montar la pàgina obté les dades del menús.
onBeforeMount(() => {
  obtenirMenus();
});
</script>

<template>
  <div id="contenidor-menus">
    <h1>Menús</h1>
    <p class="text-center">
      Només es podrà demanar el menú del dia d'avui. En qualsevol cas, es podran veure els plats dels altres menus.
    </p>
    <div v-if="menus.length > 0" class="contingut-menus">
      <div v-for="(menu, index) in menus" :key="index" class="contenidor-menu" @click="mostrarPlats(index + 1)">
        <div class="flex">
          <h1>Menú pel {{ menu.plats[0].dia.toLowerCase() }}</h1>
          <h1 class="preuMenu">{{ menu.preuBase }}€</h1>
        </div>
        <div>
          <p class="paragrafPlats">Plats:</p>
          <ul>
            <li v-for="(plat, idx) in menu.plats" :key="idx">
              <strong>{{ plat.nomPlat }}:</strong> {{ plat.descripcio }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="iconaCarregantDades"></div>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.flex h1 {
  font-size: 30px;
}

h1 {
  margin: 15px 0;
  padding: 0;
  font-weight: 800;
}


.paragrafPlats {
  margin: 12px 0;
  margin-top: 25px;
  font-weight: 800;
  font-size: 15px;
}

h2 {
  margin-bottom: 15px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li {
  margin-left: 35px;
}

.iconaCarregantDades {
  margin-top: 35px;
}

#contenidor-menus {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
}

.contingut-menus {
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
  width: 100%;
}

.text-center {
  text-align: center;
  max-width: 650px;
}

.contenidor-menu {
  position: relative;
  background-image: url("/imatges/background-menu5.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 2em;
  border-radius: 1em;
  width: 750px;
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: 0.15s ease-in-out;
}

.contenidor-menu::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  z-index: 0;
  transition: 0.15s ease-in-out;
}

.contenidor-menu:hover {
  transform: scale(1.02);
}

.contenidor-menu:hover::before {
  background: rgba(255, 255, 255, 0.8);
}

.contenidor-menu > * {
  position: relative;
  z-index: 1;
}

/* Media Queries para dispositivos más pequeños */
@media (max-width: 1024px) {
  .contenidor-menu {
    width: 100%;
    padding: 1.5em;
  }
  
  li {
    margin-left: 20px;
  }
  
  .flex h1 {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  li {
    font-size: 14px;
    margin-left: 15px;
  }
}

@media (max-width: 480px) {
  li {
    font-size: 13px;
    margin-left: 10px;
  }

  .flex {
    flex-direction: column;
    gap: 0px;
    justify-content: left;
  }
}
</style>
