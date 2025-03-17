<script setup>
</script>

<template>
  <div id="contenidorPortada">
    <div id="contingutPortada">
      <h1>Artur Shakirov 
      </h1>
      <p>Els plats de tota la vida, per demanar i amb ingredients de proximitat d'alta qualitat! <br><br><span>Què vols més?</span></p>
      <RouterLink to="/menus"><button>Demanar</button></RouterLink>
    </div>

    <div id="contenidorImatgePortada">
      <img id="imatgePortada" src="/imatges/imatge-portada.png" alt="Imatge portada">
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 700;
  font-size: 5.5em;
  line-height: 1.1em;
  letter-spacing: -0.035em;
  margin-block-end: 0.6em;
}

#contenidorPortada {
  width: 100%;
  display: flex;
  gap: 25px;
}

#contingutPortada {
  display: flex;
  flex-direction: column;
  width: 50%;
}

#contingutPortada p {
  margin-bottom: 10px;
  font-size: 1.1em;
}

#contenidorImatgePortada {
  width: 50%;
}

#imatgePortada {
  width: 100%;
  max-height: 450px;
  max-width: max-content;
}

#spanTitol {
  position: relative;
  border-bottom: 3px solid black;
  transition: color 0.3s ease, transform 0.3s ease;
  font-weight: 800;
}

#spanTitol:hover{
  color: var(--vermell);
}

@media (max-width: 1000px) {
  h1 {
    font-size: 50px;
  }
}

@media (max-width: 600px) {
  #contenidorPortada {
    flex-direction: column-reverse;
  }

  #contenidorPortada * {
    width: 100%;
  }

  h1 {
    font-size: 3.5em;
  }
}
</style>