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
        li.style="cursor: pointer;";
        const anchor = document.createElement("a");

        const pokemonName = capitalizeFirstLetter(pokemonObj.name);
        anchor.innerText = pokemonName;
        // li.textContent = pokemonName;
        
        li.appendChild(anchor);
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
    pokemonCardName.style.fontSize = "20px";

    const pokemonCardImage = document.querySelector("#pokemonCardImage");
    const pokemonOfficialArtwork = pokemonDataObj.sprites.other["official-artwork"].front_default;
    pokemonCardImage.src = pokemonOfficialArtwork;

    const pokemonCardType = document.querySelector("#pokemonCardType");

    if (pokemonDataObj["types"][1] === undefined) {
        pokemonCardType.textContent = pokemonDataObj["types"][0]["type"]["name"].toUpperCase();
    } else {
     const type1 = pokemonDataObj["types"][0]["type"]["name"].toUpperCase();
     const type2 = pokemonDataObj["types"][1]["type"]["name"].toUpperCase();
     pokemonCardType.textContent = `${type1}, ${type2}`;
    }
    
    const pokemonCardDescription = document.querySelector("#pokemonCardDescription");

    fetch(pokemonDataObj.species.url)
    .then(response => response.json())
    .then(data => {
        pokemonCardDescription.textContent = getFlavorText(data)
    })
    .catch(error => console.error(error))   


    // Create "Add To My Team!" button ("Catch")
    // Add Event Listener to "Add To My Team!" button. On click:
    // Update the Cell in "My Team" table with pokemon name and image

    const myTeamTable = document.getElementById("my-team-table");

    const buttonDiv = document.getElementById("pokemon-button-div");
    buttonDiv.innerHTML = "";

    const catchButton = document.createElement("button");
    catchButton.innerHTML = "Catch 'em!"
    catchButton.id = "catch-button";
    catchButton.style="cursor: pointer;";
    buttonDiv.appendChild(catchButton);

    const catchWarningText = "Your Team is full! Release 1 or more Pokemon to catch new ones.";
    const catchWarning = document.createElement("div");
    catchWarning.id = "catch-warning";
    catchWarning.innerHTML = catchWarningText;

    const numberOfRows = myTeamTable.getElementsByTagName("tr").length;
    if(numberOfRows >= 6) {
        catchButton.disabled = true;
        catchButton.style="cursor: default;";
        buttonDiv.appendChild(catchWarning);
    }

    catchButton.addEventListener("click", () => {
        const tr = document.createElement("tr");

        const col1 = document.createElement("td");
        const tableImage = document.createElement("img");
        tableImage.src = pokemonOfficialArtwork;
        tableImage.height = 30;
        tableImage.width = 30;
        col1.appendChild(tableImage);
    
        const col2 = document.createElement("td");
        col2.innerHTML = capitalizeFirstLetter(pokemonDataObj.name);
    
        const col3 = document.createElement("td");
        const releaseButton = document.createElement("button");
        releaseButton.innerHTML = "RELEASE";
        releaseButton.style="cursor: pointer;";
        col3.appendChild(releaseButton);
  
        const catchWarning = document.createElement("div");
        catchWarning.id = "catch-warning";
        catchWarning.innerHTML = catchWarningText;
            
        const numberOfRows = myTeamTable.getElementsByTagName("tr").length    
        if(numberOfRows < 5) {
            myTeamTable.appendChild(tr).append(col1, col2, col3);
        } else if (numberOfRows === 5) {
            myTeamTable.appendChild(tr).append(col1, col2, col3);
            catchButton.disabled = true;
            catchButton.style="cursor: not-allowed;";
            buttonDiv.appendChild(catchWarning);
        } else {
            catchButton.disabled = true;
            catchButton.style="cursor: not-allowed;";
            buttonDiv.appendChild(catchWarning);
        }

        releaseButton.addEventListener("click", () => {
            tr.remove();
            const catchWarningOnPage = document.getElementById("catch-warning");
            const catchButtonOnPage = document.getElementById("catch-button");

            let numberOfRows = myTeamTable.getElementsByTagName("tr").length;
            if(numberOfRows < 6) {
                catchButtonOnPage.disabled = false;
                catchButtonOnPage.style="cursor: pointer;";
                catchWarningOnPage.remove();
            }
        })
    })
}

function getFlavorText(speciesDataObj) {
    const allFlavorTextEntries = speciesDataObj["flavor_text_entries"];
    const englishFlavorTextObject = allFlavorTextEntries.find(entry => entry.language.name === "en");
    
    return englishFlavorTextObject.flavor_text;
}
