<script setup>
import sobreNosaltresView from "./sobreNosaltresView.vue";
import { ref, onMounted } from "vue";

document.title = 'Artur Shakirov - Portfolio';

const phrases = [
  "Full-stack developer",
  "Frontend specialist",
  "Backend engineer",
  "Web artisan"
];
const phraseIndex = ref(0);
const charIndex = ref(0);
const isDeleting = ref(false);
const currentText = ref("");

const typeEffect = () => {
  const currentPhrase = phrases[phraseIndex.value];
  if (isDeleting.value) {
    currentText.value = currentPhrase.substring(0, charIndex.value - 1);
    charIndex.value--;
  } else {
    currentText.value = currentPhrase.substring(0, charIndex.value + 1);
    charIndex.value++;
  }

  let typingSpeed = isDeleting.value ? 50 : 100;

  if (!isDeleting.value && charIndex.value === currentPhrase.length) {
    typingSpeed = 2000;
    isDeleting.value = true;
  } else if (isDeleting.value && charIndex.value === 0) {
    isDeleting.value = false;
    phraseIndex.value = (phraseIndex.value + 1) % phrases.length;
    typingSpeed = 500;
  }

  setTimeout(typeEffect, typingSpeed);
};

onMounted(() => {
  typeEffect();
});
</script>

<template>
  <div id="contenidorPortada">
    <div id="portada">
      <h2 class="changingText">{{ currentText }}</h2>
      <h1>Hey, soy <span id="nameAuthor">Artur Shakirov</span>
        <hr>
      </h1>

      <div id="lista-btn">
        <button id="btn-contactame">
          <i class="pi pi-envelope icona"></i>
          Contactame
        </button>

        <button id="btn-curriculum">
          <i class="pi pi-file-pdf icona"></i>
          Currículum V.
        </button>
      </div>
    </div>

    <div id="contenidorImatgePortada">
    </div>
  </div>

  <sobreNosaltresView id="sobreNosaltresView" />

  <div id="habilidades">
    <h2>Habilidades</h2>
  </div>
</template>

<style scoped>
#lista-btn {
  display: flex;
  gap: 10px;
}

button { 
  font-family: var(--font-primaria);
}

.changingText {
  display: inline-block;
  font-size: clamp(20px, 2vw + 1vh, 25px);
  font-weight: 500;
  color: var(--text-secondary-color);
  margin-block-end: 1rem;
}

.changingText::after {
  content: '|';
  font-weight: 100;
  color: var(--text-secondary-color);
  animation: blink 0.8s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

h1 {
  font-weight: 500;
  font-size: clamp(50px, 4vw + 3.5vh, 85px);
}

#contenidorPortada {
  width: 100%;
  height: 100vh;
  min-height: min-content;
  display: flex;
  gap: 25px;
}

#contingutPortada {
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100vh;
}

#nameAuthor {
  font-weight: 700;
}

hr {
  width: 50px;
  margin: 1.5rem 0;
  margin-top: none;
  border-bottom: 0.5px solid var(--text-secondary-color);
}

#contenidorImatgePortada {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: clamp(200px, 20vw, 400px); /* Tamaño mínimo, relativo y máximo */
  min-height: clamp(200px, 20vw, 400px); /* Tamaño mínimo, relativo y máximo */
  max-height: 80vh;
  background-image: url('/imatges/SVG/imatge-portada.svg');
  background-position: top;
  background-repeat: no-repeat;
  background-size: contain;
}

#imatgePortada {
  width: 100%;
  max-width: max-content;
}
</style>

<style>
@media (max-width: 600px) {
  #contenidorPortada {
    flex-direction: column-reverse;
  }

  #contingut {
    width: 85%;
    padding: 0;
    padding-top: 5px;
    margin: 0;
  }

  #contenidorImatgePortada {
    display: flex;
    justify-content: center;
  }

  #imatgePortada {
    height: 300px;
  }

  main {
    padding: 0;
    margin: 0;
  }

  #contenidorPortada * {
    width: 100%;
  }

  h1 {
    font-size: 3.5em;
  }
}

@media (max-width: 1000px) {
  h1 {
    font-size: 50px;
  }
}
</style>