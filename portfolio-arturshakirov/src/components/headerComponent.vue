<script setup>
const emit = defineEmits('scrollContenedor');

function scrollAContenedor(id) {
  emit('scrollContenedor', id);
}
</script>

<template>
  <header>
    <div id="contenidorHeader">
      <a href="#app">
        <img src="/imatges/SVG/favicon.svg" alt="Logo" id="logo" />
      </a>

      <nav id="nav">
        <!-- HEADER PER USUARI LOGAT -->
        <ul class="llistaNav" ref="llistaNav">
          <div class="menuTancar" ref="menuTancar" @click="tancarMenu">
            <img class="iconaMenu" src="/imatges/SVG/x-solid.svg" alt="Icona tancar menú">
          </div>
          <li><a href="#habilidades">Habilidades</a></li>
          <li><a href="#proyectos">Proyectos</a></li>
          <li><a href="#experiencia">Experiencia</a></li>
          <li id="botoDemanar"><a href="#contacto">Contactame</a></li>
        </ul>

        <div class="menuObrir" ref="menuObrir" @click="obrirMenu">
          <img class="iconaMenu" src="/imatges/SVG/bars-solid.svg" alt="Icona obrir menú">
        </div>
      </nav>
    </div>
  </header>
</template>


<style scoped>
/*HEADER*/
header {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 15px 0;
  background-color: rgba(251, 251, 251, 0.8);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

#contenidorHeader {
  display: flex;
  max-width: 1000px;
  width: 65%;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

#logo {
  height: 35px;
}

/*ESTILS BARRA DE NAVEGACIÓ*/
nav {
  margin: auto 0;
}

nav ul {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

nav li {
  display: inline;
  margin-right: 10px;
}

nav a {
  color: black
    /*var(--color-text)*/
  ;
  background: transparent;
  padding: 5px 12px;
  text-decoration: none;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

nav>ul>li>a:hover {
  color: var(--hover);
}

nav>.menuObrir,
nav>ul>.menuTancar {
  display: none;
  cursor: pointer;
}

.iconaMenu {
  height: 20px;
}

#imatgePerfil {
  height: 18px;
  cursor: pointer;
}

#botoDemanar,
#botoRegistre {
  background-color: var(--negre);
  border: 2px solid var(--text-primary-color);
  font-size: 14px;
  padding: 3.5px;
  border-radius: 3.5em;
  transition: 0.2s ease-in-out;
}

#botoDemanar *,
#botoRegistre * {
  color: var(--blanc);
}

#botoDemanar:hover,
#botoRegistre:hover {
  border-radius: 0;
  cursor: pointer;
}

#botoDemanar:hover *,
#botoRegistre:hover * {
  color: var(--blanc);
}

@media (max-width: 900px) {
  #contenidorHeader {
    width: 85%;
  }
}

/*MEDIA QUERY PEL HEADER I LA BARRA DE NAVEGACIÓ ALS 900px*/
/*OCULTAR BARRA DE NAVEGACIÓ I MOSTRAR MENÚ HAMBURGUESA*/
@media (max-width: 675px) {
  header {
    padding: 15px 0;
    margin: 0;
  }

  .llistaNav.visible {
    opacity: 1;
    visibility: visible;
  }

  nav>ul {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 30px;
    background-color: var(--background);
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    padding: 2em 3em;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.6);
  }

  nav>ul * {
    transition: 0s;
    color: var(--color-text);
    margin: 0;
    padding: 0;
  }

  nav>.menuObrir,
  nav>ul>.menuTancar {
    display: flex;
  }
}
</style>