import {baseUrl} from "../resources/baseUrl.js";

let url = baseUrl;
const errorContainer = document.querySelector(".error-container");
let enheterListe = [];

// Funksjon for å hente enheter fra APIen
async function hentEnheter(){
  try {
    const svar = await fetch(url);
    const enheter = await svar.json();
    if(enheter._embedded){
      enheterListe = enheter._embedded.enheter;
      tegneDropdown();
    }
  } catch (error) {
    errorContainer.innerHTML = `Bekglager, en feil har oppstått. Detaljer: ${error}`;
  }
};

const searchInput = document.querySelector(".main-search");
const dropDown = document.querySelector(".search-dropdown");
// 982831962

// Detekt keyup og hent enheter
searchInput.onkeyup = (event)=>{
  dropDown.innerHTML = "";
  if(!event.target.value){
    return;
  }
  if(isNaN(parseInt(event.target.value))){
    url = baseUrl + "enheter?navn=" + event.target.value.split(" ").join("+");
  } else if(!isNaN(parseInt(event.target.value)) && event.target.value.trim().length === 9){
    url = baseUrl + "enheter?organisasjonsnummer=" + event.target.value.trim();
  } else return;
  hentEnheter();
}

function tegneDropdown(){
  enheterListe.forEach(enhet => {
    dropDown.innerHTML += 
    `<div class="search-dropdown__item">
      <div>${enhet.organisasjonsnummer}</div>
      <div>${enhet.navn}</div>
    </div>`
  });
  const dropdownItems = document.querySelectorAll(".search-dropdown__item");
  const modal = document.querySelector(".modal");
  for(let i = 0; i< dropdownItems.length; i++){
    dropdownItems[i].addEventListener("click", ()=>{
      const googleMapsLink = "https://www.google.com/maps/search/?api=1&query=" + enheterListe[i].forretningsadresse.adresse[0].split(" ").join("+") + "%2C" + enheterListe[i].forretningsadresse.postnummer;
      modal.classList.add("åpen");
      modal.innerHTML = `
      <button class="lukke"></button>
      <h3>${enheterListe[i].navn}</h3>
      <div>Organisasjonsnummer: ${enheterListe[i].organisasjonsnummer}</div>
      <div>Organisasjonsform: ${enheterListe[i].organisasjonsform.beskrivelse}</div>
      <div>Adresse:</div>
      <a target=”_blank” href="${googleMapsLink}"><p>${enheterListe[i].forretningsadresse.adresse[0]}<br>
        ${enheterListe[i].forretningsadresse.kommune}<br>
        ${enheterListe[i].forretningsadresse.postnummer}
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
  if(!enheterListe.length){
    dropDown.innerHTML = "<p>Ingen resultater</p>"; 
  }
}
