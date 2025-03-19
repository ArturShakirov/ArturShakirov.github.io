<script setup>

</script>

<template>
  <footer>
    <div id="contenidorFooter">
      <div id="contingutFooter">
        <div id="apartats">
          <div>
            <h4>Pol·lítiques</h4>
            <hr>
            <ul>
              <li>
                <RouterLink to="/politiques/cookies">Pol·lítica sobre cookies</RouterLink>
              </li>
              <li>
                <RouterLink to="/politiques/privacitat">Pol·lítica de privacitat</RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4>Autors</h4>
            <hr>
            <ul>
              <li>
                <RouterLink to="/autors">Sobre els autors</RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div id="contacte">
          <div id="xarxesSocials">
            <a href="https://twitter.com" target="_blank"><img src="/imatges/SVG/x-twitter-brands-solid.svg" alt="Twitter"></a>
            <a href="https://instagram.com" target="_blank"><img src="/imatges/SVG/instagram-brands-solid.svg" alt="Instagram"></a>
            <a href="https://youtube.com" target="_blank"><img src="/imatges/SVG/youtube-brands-solid.svg" alt="Youtube"></a>
          </div>

          <div id="dadesEmpresa">
            <a href="mailto:arturiussicarius@gmail.com">arturiussicarius@gmail.com</a>
            <p>+34 676881557</p>
          </div>
        </div>
      </div>
      <p>Web dissenyada con Figma y desarrollada con VUE + JavaScript, HTML, vanilla CSS</p>
      <div class="copyrightText">&copy; Artur Shakirov<br>Casi todos los derechos reservados.</div>
    </div>
    <h1 id="titulo-footer">
      <span>Artur&nbsp;</span>
      <span>Shakirov</span>
    </h1>
  </footer>
</template>

<style scoped>
#titulo-footer {
  font-weight: 600;
  position: absolute;
  bottom: 0;
  color: #303030;
  letter-spacing: -0.05em;
  flex-wrap: nowrap;
  font-size: 17.3vw;
  text-align: center;
  padding: 0;
  margin: 0;
  transform: translateY(3.2vw);
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: url(/imatges/background-footer.webp);
  background-repeat: no-repeat;
  background-size:cover;
  padding: 35px 0;
  padding-bottom: 22vw;
  overflow: hidden;
  z-index: 0;
  bottom: 0;
  width: 100%;
  position: relative;
}

#contenidorFooter {
  width: 65%;
  max-width: 1000px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

#contenidorFooter *,  #contenidorFooter i {
  color: var(--text-third-color);
  border-color: var(--text-third-color);
  font-size: 13px;
}

#contenidorFooter .copyrightText {
  color: #8d8d8d;
}

#contingutFooter {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}

#autorsFooter {
  background-color: rgb(83, 83, 83);
}

#apartats {
  display: flex;
  flex-direction: row;
  gap: 50px;
}

h4 {
  margin-bottom: 5px;
  font-size: 14px !important;
}

#contingutFooter ul {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 3.5px;
}

#contacte {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: end;
}

#contacte #xarxesSocials {
  display: flex;
  flex-direction: row;
  background-color: transparent;
  justify-content: end;
  gap: 18px;
}

#contacte img {
  height: 23px;
}

#contacte #dadesEmpresa *{
  margin-top: 3px;
}

a {
  font-family: var(--montserrat);
  transition: 0.2s;
}

a:hover {
  color: rgb(235, 235, 235) !important;
}

@media (max-width: 625px) {
  #contenidorFooter, #contingutFooter {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  #contacte, #apartats, #contacte > #xarxesSocials {  
    display: flex;
    justify-content: center;
    text-align: center;
  }
}
</style>