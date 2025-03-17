<script setup>

</script>

<template>
  <footer>
    <div id="contenidorFooter">
      <div>&copy; Shakarcia</div>
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
            <a href="mailto:shakarcia@gmail.com">shakarcia@gmail.com</a>
            <p>+34 972878780</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  justify-content: center;
  background-color: rgb(24, 24, 24);
  padding: 25px 0;
  z-index: 0;
  bottom: 0;
  width: 100%;
  position: relative;
}

#contenidorFooter {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

#contenidorFooter *,  #contenidorFooter i {
  color: #dfdfdf;
  font-size: 13px;
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

hr {
  border-color: #cdcdcd;
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