fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151")
    .then(response => response.json())
    .then(data => showPokemonInSearchList(data.results))

function keyUpFilter() {
    // Declare variables
    const input = document.getElementById('myInput');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("searchUL");
    const li = ul.getElementsByTagName('li');
    
    let a, i, txtValue;
    
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        } else {
        li[i].style.display = "none";
        }
    }
}

// Create a List with all 151 Pokemon that can be Filtered/Searched
function showPokemonInSearchList(pokemonArray) {
    pokemonArray.forEach(pokemonObj => {
        const searchUL = document.getElementById("searchUL");
        const li = document.createElement("li");

        const pokemonName = capitalizeFirstLetter(pokemonObj.name);
        li.textContent = pokemonName;
        
        searchUL.appendChild(li);

        li.addEventListener("click", () => {
            // console.log(pokemonName)
            fetch(pokemonObj.url)
            .then(response => response.json())
            .then(data => populateCard(data))
            .catch(error => console.error(error))
        })
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }  

function populateCard(pokemonDataObj) {
    const pokemonCardName = document.querySelector("#pokemonCardName");
    pokemonCardName.textContent = capitalizeFirstLetter(pokemonDataObj.name);

    const pokemonCardImage = document.querySelector("#pokemonCardImage");
    pokemonCardImage.src = pokemonDataObj.sprites.other["official-artwork"].front_default

    const pokemonCardType = document.querySelector("#pokemonCardType");
    pokemonCardType.textContent = pokemonDataObj["types"][0]["type"]["name"].toUpperCase();

    const pokemonCardDescription = document.querySelector("#pokemonCardDescription");

    fetch(pokemonDataObj.species.url)
    .then(response => response.json())
    .then(data => {
        pokemonCardDescription.textContent = getFlavorText(data)
    })
    .catch(error => console.error(error))    
}

function getFlavorText(speciesDataObj) {
    const allFlavorTextEntries = speciesDataObj["flavor_text_entries"];
    const englishFlavorTextObject = allFlavorTextEntries.find(entry => entry.language.name === "en");
    
    return englishFlavorTextObject.flavor_text;
}