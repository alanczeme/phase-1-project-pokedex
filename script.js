const h2 = document.createElement("h2");
h2.textContent = "This content added by JavaScript";

fetch("https://pokeapi.co/api/v2/pokemon/")
    .then(response => response.json())
    .then(data => console.log(data.results))