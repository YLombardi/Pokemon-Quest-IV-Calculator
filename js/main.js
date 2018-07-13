var allPokemon;

$(document).ready(function(){
    loadAllPokemon();
});

function updateFields(){
    let formdata = {};
    $("form").serializeArray().forEach(function(obj, index){
        formdata[obj.name] = obj.value;
    });
    let pokemon = allPokemon[formdata['pokemon']];

    // Update the valculated IV's
    document.getElementById('hitpoints_iv').innerText = calcIV(pokemon['hitpoints'], +formdata['hitpoints'], +formdata['level']);
    document.getElementById('attack_iv').innerText = calcIV(pokemon['attack'], +formdata['attack'], +formdata['level']);
    // Add attack + hp then devide by 2 to get the total IV value
    document.getElementById('total_iv').innerText = calcIV((pokemon['attack'] + pokemon['hitpoints']) / 2, (+formdata['attack'] + +formdata['hitpoints']) / 2, +formdata['level']);
}

function calcIV(base_attack, current_attack, level){
    base_attack += level;
    let diff = current_attack - base_attack;
    if (diff >= 0 && diff <= 10) // Brass Pot
        return (diff * 10) + '% (brass)';
    else if (diff >= 50 && diff <= 100) // Bronze Pot
        return ((diff - 50) * 2) + '% (bronze)';
    else if (diff >= 100 && diff <= 250) // Silver Pot (serebii says it's a range of 100, but i have multiple pokemon in the range of 150 - mobile edition)
        return (diff - 150) + '% (silver)';
    else if (diff >= 251 && diff <= 299) // No pokemon should be in this range (maybe silver, but have yet to find any)
        return '¯\\_(ツ)_/¯';
    else if (diff >= 300 && diff <= 400) // Gold Pot
        return (diff - 300) + '% (gold)';
    else // Still entering value ?
        return `N/A`;
}

let myList = [];

function addToList() {
    let pokemon = {"name": $('#pokemon').val(), "level": parseInt($('#level').val()), "hp": parseInt($('#hitpoints').val()), "atk": parseInt($('#attack').val())};
    myList.push(pokemon);
    displayMyList();
}

function saveMyList() {
    localStorage.pokemonQuestIVList = JSON.stringify(myList);
}

function loadMyList() {
    myList = JSON.parse(localStorage.pokemonQuestIVList);
    displayMyList();
}

function removeFromList(index) {
    myList.splice(index, 1);
    console.table(myList);
    displayMyList();
}

function displayMyList() {
    let table = $('#mylist');
    table.empty();
    table.append('<tr><th>Pokémon</th><th>Level</th><th>Hit Points</th><th>Attack</th><th>Hit Points IV</th><th>Attack IV</th><th></th></tr>');
    if (myList.length > 0) {
        myList.forEach(function(pokemon, index) {
            // console.log(allPokemon);
            let data = allPokemon[pokemon.name];
            console.log(pokemon);
            console.log(data);
            let hpIV = calcIV(data.hitpoints, pokemon.hp, pokemon.level);
            let atkIV = calcIV(data.attack, pokemon.atk, pokemon.level);
            table.append('<tr id="pokemon-' + index + '"><td>' + pokemon.name + '</td><td>' + pokemon.level +
                '</td><td>' + pokemon.hp + '</td><td>' + pokemon.atk + '</td><td>' + hpIV + '</td><td>' + atkIV + '</td>' +
                '<td><button onclick="removeFromList(' + index + ')">Remove</button></td></tr>')
        })
    }
}

function loadAllPokemon(language = "en") {
    $.getJSON('./json/pokemon_' + language + '.json', function (data) {
        allPokemon = data;

        // Add each of the pokemon options to the select element
        $('#pokemon').empty();
        Object.keys(allPokemon).forEach(function(pokemon, index){
            $('#pokemon').append($('<option>', {
                value: pokemon,
                text : pokemon + ' #' + allPokemon[pokemon].dex
            }));
        });

        $('#pokemon').change(function(){
            let pokemon = allPokemon[$(this).val()];

            // Update image top currently selected pokemon
            document.getElementById('pokemon_img').src = pokemon.img;

            // Set minimum value, and placeholder value to current pokemons base values
            document.getElementById('hitpoints').placeholder = pokemon['hitpoints'] + ' - ' + (pokemon['hitpoints'] + 500);
            document.getElementById('hitpoints').min = pokemon['hitpoints'];
            document.getElementById('hitpoints').max = pokemon['hitpoints'] + 500;
            document.getElementById('attack').placeholder = pokemon['attack'] + ' - ' + (pokemon['attack'] + 500);
            document.getElementById('attack').min = pokemon['attack'];
            document.getElementById('attack').max = pokemon['attack'] + 500;

            updateFields();
        });

        $('input').change(function(){
            updateFields();
        })
    });
}