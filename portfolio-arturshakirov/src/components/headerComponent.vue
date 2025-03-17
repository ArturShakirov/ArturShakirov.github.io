<script setup>
</script>

<template>
  <header>
    <div id="contenidorHeader">
      <router-link to="/">
        <img src="/favicon.ico" alt="Logo" id="logo" />
      </router-link>

      <nav id="nav">
        <!-- HEADER PER USUARI LOGAT -->
        <ul class="llistaNav" ref="llistaNav">
          <div class="menuTancar" ref="menuTancar" @click="tancarMenu">
            <img class="iconaMenu" src="/imatges/SVG/x-solid.svg" alt="Icona tancar menú">
          </div>
          <li><router-link to="/teves-comandes">Les teves comandes</router-link></li>
          <li><router-link to="/sobre-nosaltres">Sobre nosaltres</router-link></li>
          <li id="botoDemanar"><router-link to="/menus">Demanar!</router-link></li>
          <li><router-link to="/perfil"><img id="imatgePerfil" src="/imatges/SVG/user-solid.svg"></router-link></li>
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
  padding: 20px;
  background-color: transparent;
  z-index: 1000;
}

#contenidorHeader {
  display: flex;
  width: 70%;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

#logo {
  height: 30px;
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
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

nav>ul>li>a:hover {
  color: var(--vermellFosc);
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
  background-color: transparent;
  border: 3px solid var(--vermellFosc);
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 3em;
  transition: 0.2s ease-in-out;
}

#botoDemanar *,
#botoRegistre * {
  color: var(--vermellFosc);
}

#botoDemanar:hover,
#botoRegistre:hover {
  background-color: var(--vermellFosc);
  cursor: pointer;
}

#botoDemanar:hover *,
#botoRegistre:hover * {
  color: var(--blanc);
}

/*MEDIA QUERY PEL HEADER I LA BARRA DE NAVEGACIÓ ALS 900px*/
/*OCULTAR BARRA DE NAVEGACIÓ I MOSTRAR MENÚ HAMBURGUESA*/
@media (max-width: 900px) {
  #contenidorHeader {
    width: 85%;
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