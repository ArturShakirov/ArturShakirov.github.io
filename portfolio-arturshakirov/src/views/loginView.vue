<script setup>
//Imports
import { onBeforeMount, ref } from 'vue';
import { useUsuariStore } from '@/stores/usuariStore';
import { useRouter } from 'vue-router';
import Password from 'primevue/password';

//Constants
const APIKEY = import.meta.env.VITE_API_KEY;

const nomUsuari = ref("");
const contrasenya = ref("");

//Emits
const emit = defineEmits(["login-correcte", "missatge-error"]);

/**
 * Funció que fa la crida GET a l'endpoint /IniciarSessio per iniciar sessio, si es correcte, fa emit de login-correcte a App. Es necessita API-KEY.
 */
async function ferLogin() {
  let data = "";

  try {
    const response = await fetch(import.meta.env.VITE_RUTA_API + "IniciarSessio/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-key": APIKEY,
        "nomUsuari": nomUsuari.value,
        "contrasenya": contrasenya.value
      }
    });

	data = await response.json();

    if (!response.ok) {
      throw new Error(`Error HTTP! Estat: ${response.status}`);
    }

	emit('login-correcte', data.jwt);
	
  } catch (error) {
	//Error en la crida
    emit('missatge-error', { "titol": "Error!", "missatge": data.error, "duracio": 7000});
  }
}

document.title = "Iniciar sessió";

//Abans de montar la pàgina verifica si l'usuari està logat, si es així, redirigeix a portada.
onBeforeMount(() => {
	const usuariStore = useUsuariStore();
	const router = useRouter();

	if (usuariStore.idUsuari) {
		router.push('/');
	}
})
</script>

<template>
	<div id="contenidorLogin">
		<div id="imatgeLogin">
		</div>
		<div id="contingutLogin">
			<h1>Iniciar sessió</h1>
			<form @submit.prevent="ferLogin">
				<label>Nom d'usuari</label>
				<InputText v-model="nomUsuari" required />
				<label>Contrasenya</label>
				<Password v-model="contrasenya" :feedback="false" toggle-mask="true" name="contrasenya" type="password" required />
				<br />
				<input type="submit" value="Iniciar sessió" />
				<RouterLink class="botoSecundari" to="/registre">Registrar-se</RouterLink>
			</form>
		</div>
	</div>
</template>

<style scoped>
h1 {
	text-align: center;
	margin-bottom: 30px;
}

#contenidorCookies {
	margin-top: 15px;
	display: flex;
	align-items: center;
	gap: 20px;
}

#labelCookies,
#inputCookies {
	margin: 0;
	padding: 0;
	display: flex;
	align-items: center;
	width: fit-content;
}

/*LOGIN*/
#contenidorLogin {
	display: flex;
	flex-direction: row;
}

#imatgeLogin {
	width: 55%;
	background-image: url('/imatges/imatgeLogin.png');
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}

#contingutLogin {
	display: flex;
	flex-direction: column;
	width: 45%;
}

@media (max-width: 1050px) {
	#contenidorLogin {
		flex-direction: column-reverse;
		align-items: center;
		gap: 50px;
	}

	#imatgeLogin {
		width: 100%;
		height: 250px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	#contingutLogin {
		width: 100%;
		text-align: center;
	}
}

</style>