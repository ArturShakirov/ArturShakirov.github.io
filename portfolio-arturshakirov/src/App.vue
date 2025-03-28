<script setup>
//Imports
import footerComponent from './components/footerComponent.vue';
import headerComponent from './components/headerComponent.vue';
import { onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import emailjs from '@emailjs/browser';

// Inicialización de emailjs
emailjs.init({
    publicKey: 'GDZX6T3nbvbpuCF9p',
});

const toast = useToast();

function missatgeSuccess(missatge) {
	toast.add({ severity:'success', summary: missatge.titol, detail: missatge.missatge, life: missatge.duracio || 3000});
}

function missatgeError(missatge) {
	toast.add({ severity: 'error', summary: missatge.titol, detail: missatge.missatge, life: missatge.duracio || 3000});
}

function missatgeInfo(missatge) {
	toast.add({ severity: 'info', summary: missatge.titol, detail: missatge.missatge, life: missatge.duracio || 3000});
}

missatgeInfo({
	titol: 'Missatge de confirmació',
    missatge: 'Has confirmat la operació amb èxit.',
});

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
			<RouterView></RouterView>
		</div>
	</main>

	<!-- FOOTER -->
	<footerComponent></footerComponent>
</template>

<style>
@import 'primeicons/primeicons.css';
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
	--blanc: #fbfbfb;
	--header: rgba(250, 250, 250, 0.5);
	--gris: #C6C6C6;
	--grisFosc: #DDDDDD;
	--border-taula: rgb(131, 131, 131);
	--box-shadow: rgb(206, 206, 206);
	--font-primaria: "Inter Tight", sans-serif;
	--font-secundaria: "Inter Tight", sans-serif;
	--background: rgb(251, 251, 251);
	--text-primary-color: #1f1f1f;
	--text-secondary-color: #626262;
	--text-third-color: #c3c3c3;
	--hover: #808080; 
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
	scroll-behavior: smooth;
}

body {
	display: flex;
	flex-direction: column;
	font-family: var(--font-secundaria);
	background-color: var(--background);
	color: var(--text-secondary-color);
	font-size: 16.5px;
	line-height: 1.6;
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
	letter-spacing: -0.02em;
	margin-block-end: 0.3em;
	transition: 0.2s;
}

h1 {
	font-weight: 600;
	font-size: clamp(45px, 4vw + 4vh, 80px);
	margin-bottom: 20px;
	transition: 0.2s;
}

h2 {
	font-weight: 600;
    font-size: clamp(35px, 3vw + 2vh, 45px);
    margin-bottom: 15px;
}

h3 {
	font-weight: 500;
    font-size: clamp(25px, 2vw + 1.5vh, 40px);
    margin-bottom: 10px;
	color: var(--text-secondary-color);
}

h4 {
	font-weight: 500;
	font-size: clamp(20px, 1.5vw + 1vh, 25px);
    color: var(--text-primary-color);
}

p {
	font-size: clamp(15px, 2vw + 1.5vh, 20px);
	color: var(--text-secondary-color);
  	line-height: 1.6;
	font-weight: 400;
}

.contenedor {
	padding-top: 55px;
}

.titulo-contenedor {
	font-weight: 600;
    margin: 18px 0;
}

.contenedor-margin {
	margin-block-end: 60px;
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
	width: 100%;
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
	font-size: clamp(15px, 2vw + 1.5vh, 20px);
}

input,
textarea,
select {
	font-size: clamp(15px, 2vw + 1.5vh, 20px);
	display: block;
	width: 100%;
	padding: 7px;
	margin-top: 5px;
	margin-bottom: 20px;
	border: none;
	border-bottom: 1px solid var(--text-third-color);
	background-color: var(--background);
	color: var(--text-primary-color-inputs);
	font-family: var(--montserrat);
}

button,
input[type="submit"] {
	width: fit-content;
	border: none;
	padding: 8px 15px;
	margin-top: 10px;
	font-weight: 600;
	color: var(--text-primary-color);
	background-color: transparent;
	border: 2px solid transparent;
	transition: 0.2s ease-in-out;
}

button:hover,
input[type="submit"]:hover {
	border: 2px solid var(--text-primary-color);
}

button:disabled,
input[type="submit"]:disabled {
	opacity: 0.3;
	pointer-events: none;
}

textarea {
	min-height: 100px;
	resize: vertical;
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
  width: 50px;
  margin-bottom: 20px;
  margin-top: none;
  border-bottom: 0.5px solid var(--text-secondary-color);
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
.small-icon {
	padding: 10px;
	border-radius: 3em;
	color: var(--negre);
	transition: 0.2s;
}

.big-icon{
	padding: 15px;
    border-radius: 50%;
    color: var(--negre);
	font-size: 35px;
    transition: 0.2s;
}

.small-icon:hover, .big-icon:hover {
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
.precio>*::after {
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

.contingut-dialog {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>