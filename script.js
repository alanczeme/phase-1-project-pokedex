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
      
const searchUL = document.getElementById("searchUL");

function showPokemonInSearchList(pokemonArray) {
    pokemonArray.forEach(pokemonObj => {
        const li = document.createElement("li");
        const anchor = document.createElement('a');
        anchor.href = pokemonObj.url;
        anchor.innerText = pokemonObj.name;

        li.appendChild(anchor);
        // console.log(li);
        searchUL.appendChild(li);
    })
}
