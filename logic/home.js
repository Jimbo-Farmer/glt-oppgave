import {baseUrl} from "../resources/baseUrl.js";

const url = baseUrl + 'enheter/?page=0&size=1000';
const errorContainer = document.querySelector(".error-container");
let companiesList = [];

// Hent enheter fra APIen
(async function hentEnheter(){
  try {
    const svar = await fetch(url);
    const enheter = await svar.json();
    companiesList = enheter._embedded.enheter;
  } catch (error) {
    errorContainer.innerHTML = `Bekglager, en feil har oppstått. Detaljer: ${error}`;
  }
})();

// Funksjon for å filtrer enheter
function filterEnheter(list, searchText){
  const filtrertEnheter = list.filter((enhet)=>{
    if(enhet.organisasjonsnummer.includes(searchText.toLowerCase()) || enhet.navn.toLowerCase().includes(searchText.toLowerCase())){
      return true
    }
  })
  return filtrertEnheter;
}

const searchInput = document.querySelector(".main-search");
const dropDown = document.querySelector(".search-dropdown");

// Filtrer og tegne enheter forløppende
searchInput.onkeyup = (event)=>{
  dropDown.innerHTML = "";
  if(!event.target.value){
    return
  }
  let filtrertEnheter = filterEnheter(companiesList, event.target.value);
  filtrertEnheter.forEach(enhet => {
    dropDown.innerHTML += 
    `<div class="search-dropdown__item">
      <div>${enhet.organisasjonsnummer}</div>
      <div>${enhet.navn}</div>
    </div>`
  });
  if(!filtrertEnheter.length){
    dropDown.innerHTML = "<p>Ingen resultater</p>";
    
  }
  const dropdownItems = document.querySelectorAll(".search-dropdown__item");
  const modal = document.querySelector(".modal");
  for(let i = 0; i< dropdownItems.length; i++){
    dropdownItems[i].addEventListener("click", ()=>{
      const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=" + filtrertEnheter[i].forretningsadresse.adresse[0].split(" ").join("+") + "%2C" + filtrertEnheter[i].forretningsadresse.postnummer;
      modal.classList.add("åpen");
      modal.innerHTML = `
      <button class="lukke"></button>
      <h3>${filtrertEnheter[i].navn}</h3>
      <div>Organisasjonsnummer: ${filtrertEnheter[i].organisasjonsnummer}</div>
      <div>Organisasjonsform: ${filtrertEnheter[i].organisasjonsform.beskrivelse}</div>
      <div>Adresse:</div>
      <a target=”_blank” href="${googleMapsLink}"><p>${filtrertEnheter[i].forretningsadresse.adresse[0]}<br>
        ${filtrertEnheter[i].forretningsadresse.kommune}<br>
        ${filtrertEnheter[i].forretningsadresse.postnummer}
        </p>
      </a>
      `;
      const closeButton = document.querySelector(".lukke");
      closeButton.onclick = ()=>{
      modal.classList.remove("åpen");
      modal.innerHTML = "";
      }
    })
  }
}
