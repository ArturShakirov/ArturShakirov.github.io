<script setup>
</script>

<template>
  <section class="sobre-nosaltres">
    <div class="contenidor-sobrenosaltres">
      <h1>Sobre nosaltres</h1>
      <p>Benvinguts a <strong>Shakarcia</strong>, un restaurant online on la qualitat i la proximitat són l'essència de la
        nostra cuina. Des del nostre equip, ens comprometem a oferir experiències gastronòmiques úniques,
        elaborades amb els millors ingredients de la nostra terra seleccionats amb cura.</p>

      <div class="contenidor-imatges-sobrenosaltres">
        <div class="image-contenidor-sobrenosaltres">
          <img src="/imatges/imatge-portada.png" alt="Imatge">
        </div>
        <div class="image-contenidor-sobrenosaltres">
          <img src="/imatges/imatge-portada.png" alt="Imatge">
        </div>
      </div>

      <h2>La Nostra història</h2>
      <p>Tot va començar amb un somni i una passió per la cuina autèntica. Els fundadors de <strong>Shakarcia</strong>
        van decidir unir tradició i innovació per crear una plataforma online on plat fos una celebració dels sabors naturals de
        Catalunya i que arribin fins a la vostra llar. Inspirats per la riquesa de la nostra terra, han transformat ingredients locals i de temporada en
        obres d'art culinàries, mantenint sempre el respecte per la natura i la sostenibilitat.</p>

      <h2>Els nostres valors</h2>
      <p>Ens apassiona el compromís amb la qualitat, la sostenibilitat i la proximitat.
        Treballem amb productors locals que comparteixen els nostres valors i apostem per una gastronomia responsable
        que ressalta la frescor, la qualitat i la proximitat de cada ingredient.</p>

      <div class="contenidor-imatges-sobrenosaltres">
        <div class="image-contenidor-sobrenosaltres">
          <img src="/imatges/imatge-portada.png" alt="Productors locals">
        </div>
        <div class="image-contenidor-sobrenosaltres">
          <img src="/imatges/imatge-portada.png" alt="Ingredients de qualitat">
        </div>
      </div>

      <h2>Una experiència única</h2>
      <p>Aquí no només oferim un menjar excel·lent, sinó que també volem que cada comanda sigui
        una experiència plena d'emocions i descobriments. La nostra carta canvia amb la temporada per aprofitar el
        millor de cada moment, assegurant que cada plat porti una història d'autenticitat i passió per la gastronomia
        catalana.</p>
    </div>
  </section>
</template>

<style>
/* Estils per la secció Sobre Nosaltres */
.sobre-nosaltres {
  text-align: center;
  padding: 20px 0;
}

.sobre-nosaltres .contenidor-sobrenosaltres {
  max-width: 800px;
  margin: 0 auto;
}

.sobre-nosaltres h1 {
  margin-bottom: 20px;
}

.sobre-nosaltres h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin: 20px 0;
  margin-top: 50px;
}

.sobre-nosaltres p {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Estils per als contenidors d'imatges */
.contenidor-imatges-sobrenosaltres {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.image-contenidor-sobrenosaltres {
  flex: 1;
  max-width: 450px;
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 20px;
}

.image-contenidor-sobrenosaltres img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 8px;
}
</style>