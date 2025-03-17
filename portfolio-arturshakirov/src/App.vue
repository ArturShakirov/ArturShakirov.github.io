<script setup>
//Imports
import footerComponent from './components/footerComponent.vue';
import headerComponent from './components/headerComponent.vue';
import { onMounted, onUnmounted } from 'vue';
/*
onMounted(() => {
	const cursorShadow = document.getElementById('cursor-shadow');

	const updateCursorPosition = (e) => {
		cursorShadow.style.transform = `translate(${e.clientX - 10}px, ${e.clientY}px)`;
	};

	document.addEventListener('mousemove', updateCursorPosition);

	onUnmounted(() => {
		document.removeEventListener('mousemove', updateCursorPosition);
	});
});*/
</script>

<template>
	<div id="cursor-shadow"></div>
	<!-- HEADER -->
	<headerComponent></headerComponent>

	<!-- CONTINGUT -->
	<main>
		<Toast />
		<div id="contingut">
			<RouterView @missatge-success="missatgeSuccess" @missatge-error="missatgeError"
				@missatge-info="missatgeInfo" @login-correcte="actualitzarDades" @tancarSessio="tancarSessio"></RouterView>
		</div>
	</main>

	<!-- FOOTER -->
	<footerComponent></footerComponent>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

/*MODE DIA I COLORS PREDEFINITS*/
:root {
	--verd: #00BF63;
	--verdFosc: #00924B;
	--vermell: #E24128;
	--vermellFosc: #b02f12;
	--marro: #6c4423;
	--beix: #d8c3a5;
	--negre: #1f1f1f;
	--blanc: #ffffff;
	--header: rgba(250, 250, 250, 0.5);
	--gris: #C6C6C6;
	--grisFosc: #DDDDDD;
	--border-taula: rgb(131, 131, 131);
	--box-shadow: rgb(206, 206, 206);
	--font-primaria: "Inter Tight", sans-serif;
	--font-secundaria: "Inter Tight", sans-serif;
	--background: rgb(251, 251, 251);
	--text-primary-color: #1f1f1f;
	--text-secondary-color: #5e5e5e;
	--text-primary-color-inputs: rgba(18, 18, 18, 0.8);
	--hoverTaules: rgba(0, 0, 0, 0.035);
	--seleccionat: rgba(0, 0, 0, 0.1);
	--color-icones: var(--grocFosc);
	--borderElementsTauler: none;
}

/*ESTILS GENERALS*/
#app {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

html,
body {
	height: auto;
	width: 100%;
}

body {
	display: flex;
	flex-direction: column;
	font-family: var(--font-secundaria);
	background-color: var(--background);
	color: var(--text-secondary-color);
	font-size: 16.5px;
	line-height: 1.35;
	font-weight: 500;
	min-height: 100vh;
}

main {
	flex: 1 !important;
	width: 100%;
	display: flex;
	justify-content: center;
}

#contingut {
	margin: 50px 0;
	width: 65%;
	max-width: 1000px;
	height: 100%;
}

#cursor-shadow {
	position: absolute;
	width: 25px;
	height: 25px;
	box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.1);
	background: var(--text-primary-color);
	backdrop-filter: contrast(1);
	border-radius: 50%;
	pointer-events: none;
	z-index: -1;
}

.p-toast {
	max-width: 85vw;
}

a {
	color: var(--text-primary-color);
	text-decoration: none;
	width: fit-content;
}

a:hover {
	cursor: pointer;
}

/*ESTILS TITOLS*/
h1,
h2,
h3,
h4,
a {
	color: var(--text-primary-color);
	font-family: var(--font-primaria);
	line-height: 1.1em;
	letter-spacing: -0.015em;
	margin-block-end: 0.3em;
}

h1 {
	font-size: 45px;
	margin-bottom: 20px;
	transition: 0.2s;
}

button:hover,
input[type="submit"]:hover {
	cursor: pointer;
}

.botoSecundari {
	font-size: 15px;
	color: var(--negre);
	font-family: 'Open Sans', sans-serif;
	cursor: pointer;
}

.botoSecundari:hover {
	text-decoration: underline;
}

form {
	max-width: 600px;
	margin: 0 auto;
	display: block;
}

form label {
	font-weight: 500;
}

label {
	display: block;
	text-align: left;
	padding-bottom: 8px;
	font-size: 17px;
}

input,
textarea,
select {
	display: block;
	width: 100%;
	padding: 7px;
	margin-top: 5px;
	margin-bottom: 15px;
	border: 1px solid #b6b6b6;
	background-color: var(--background);
	color: var(--text-primary-color-inputs);
	font-family: var(--montserrat);
}

button,
input[type="submit"] {
	border: 3.5px solid var(--negre);
	background: linear-gradient(135deg, var(--negre) 50%, var(--blanc) 50%);
	background-size: 300% 100%;
	background-position: right;
	padding: 10px;
	margin-top: 15px;
	font-weight: 600;
	color: var(--text-primary-color);
	transition: all 0.3s ease-in-out;
}

button:hover,
input[type="submit"]:hover {
	background-position: left;
	color: var(--blanc);
}

button:disabled,
input[type="submit"]:disabled {
	opacity: 0.3;
	pointer-events: none;
}

textarea {
	min-height: fit-content;
	resize: vertical;
	border-radius: 5px;
	min-width: 100%;
	max-width: 100%;
	max-height: 150px;
}

input[type="date"],
select {
	padding: 7px !important;
	width: 100% !important;
	margin-top: 5px imo !important;
	margin-bottom: 15px !important;
	border: 1px solid #b6b6b6 !important;
	border-radius: 5px !important;
}

hr {
	max-width: 300px;
	margin: 5px 0;
	border-top: 1px solid var(--gris);
}

.iconaCarregantDades {
	border: 6px solid var(--blanc);
	border-top: 6px solid var(--verd);
	border-radius: 50%;
	width: 100px;
	height: 100px;
	animation: rotar 1.5s linear infinite;
}

@keyframes rotar {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}


.accionsDataTable {
	text-align: right;
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 10px;
}

/* Íconos */
.icona {
	background-color: var(--grisFosc);
	padding: 10px;
	border-radius: 3em;
	color: var(--negre);
	margin: 0 5px;
	cursor: pointer;
	transition: 0.2s;
}

.icona:hover {
	filter: contrast(0.7);
}

/* DataTable */
.p-datatable {
	margin-top: 30px;
	border-radius: 0.5em;
	overflow: hidden;
}

.p-datatable>tr:hover {
	background-color: rosybrown;
}

.p-datatable-thead>tr {
	border: 1px solid black;
}

.p-datatable-thead>tr>th {
	/*background-color: rgb(240, 240, 240);
    color: var(--blanc);*/
	min-width: fit-content;
	padding: 15px 20px;
}

/* Precios */
.preu>*::after {
	content: "€";
}

/* Capitalize */
.capitalize {
	text-transform: capitalize;
}

.contenidor-botons {
	display: flex;
	gap: 8px;
}

.pi-trash {
	color: #ff3459;
	background-color: #ffccd5;
	cursor: pointer;
}

.pi-pencil {
	color: var(--verdFosc);
	background-color: #b4ecb7;
	cursor: pointer;
}

.contingut-dialog {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>