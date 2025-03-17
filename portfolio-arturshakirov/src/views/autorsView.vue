<script setup>
document.title = "Autors"
</script>

<template>
  <center><h1>Autors</h1></center>
  <div id="contingutAutors">
    <div class="autor">
      <img src="/imatges/artur.png" alt="">
      <h3>Artur Shakirov</h3>
      <div class="contingutAutor"> 
        Artur Shakirov és un jove estudiant de desenvolupament d'aplicacions web amb una gran passió per la tecnologia i la gastronomia. <br><br>Des de sempre ha estat fascinat per com la innovació pot transformar sectors tradicionals, i amb Shakarcia ha volgut unir el món digital amb la cuina autèntica catalana. El seu objectiu és crear una experiència en línia fluida i intuïtiva que permeti a tothom gaudir de plats de qualitat des de casa.<br><br> Compromès amb la sostenibilitat i la proximitat, Artur treballa per fer de Shakarcia una plataforma moderna que respecti els valors tradicionals de la bona cuina.
      </div>
    </div>
    <div class="autor">
      <img src="/imatges/sergi.png" alt="">
      <h3>Sergi Garcia</h3>
      <div class="contingutAutor">
        Estudiant de desenvolupament d’aplicacions web i un gran entusiasta de la gastronomia local. <br><br>Sempre ha cregut en la importància d’apostar pels productes de qualitat i la cuina sostenible. Amb Shakarcia, Sergi ha volgut aportar la seva visió per crear una plataforma on la tecnologia sigui el pont entre els productors locals i els amants de la bona taula.<br><br> La seva dedicació per la innovació i el seu amor per la cultura gastronòmica catalana han estat claus en el desenvolupament d’aquest projecte, que busca portar l'excel·lència culinària a cada comanda.
      </div>
    </div>
  </div>
</template>

<style scoped>
#contingutAutors {
  display: flex;
  flex-direction: row;
  gap: 25px;
}

#contingutAutors h1 {
  text-align: center;
}

h3 {
  margin-top: 25px;
}

.autor {
  text-align: center;
}

.contingutAutor{
  margin-top: 25px;
  line-height: 1.5em;
}

img {
  height: 450px;
}

@media (max-width: 1000px) {
  #contingutAutors {
    flex-direction: column;
  }

  img {
    height: 350px;
    max-width: 100%;
  }
}
</style>