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
    <div id="contingutPortada">
      <h2 class="changingText">{{ currentText }}</h2>
      <h1>Hey, soy <span id="nameAuthor">Artur Shakirov</span>
        <hr>
      </h1>
      <p>Al acabar la ESO entre al ciclo de grado medio de informatica porque me quedaba cerca de casa y no porque
        especialmente me gustase. Aunque al principio tuvimos algunas batallas, después de poco tiempo lo tuve claro, me
        queria dedicar a la tecnologia y especificamente a la programación web.
        <br><br>Eso de tener la habilidad de crear lo que quisiese y que fuera tan accesible como para que la gente que
        me rodea lo puediese ver con solo 3 toques me parecia impresionante, como un pintor con sus obras.
        <br><br>Al final del ciclo me gradué con matrícula de honor (quien lo diria &#128517;). <br>A partir de allí
        pude estudiar el ciclo de grado superior de Desarrollo de Aplicaciones Web, en el que estoy actualmente.
      </p>

      <RouterLink to="/menus"><button>Demanar</button></RouterLink>
    </div>

    <div id="contenidorImatgePortada">
      <img id="imatgePortada" src="/imatges/SVG/imatge-portada.svg" alt="Imatge portada">
    </div>
  </div>

  <sobreNosaltresView id="sobreNosaltresView" />
</template>

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
</style>

<style scoped>
.changingText {
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
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
  font-size: 5em;
}

h2 {
  color: var(--text-secondary-color);
  margin-block-end: 1rem;
}

#contenidorPortada {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  gap: 25px;
}

#contingutPortada {
  display: flex;
  flex-direction: column;
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
  min-width: 35%;
}

#imatgePortada {
  width: 100%;
  max-height: 450px;
  max-width: max-content;
}

@media (max-width: 1000px) {
  h1 {
    font-size: 50px;
  }
}
</style>