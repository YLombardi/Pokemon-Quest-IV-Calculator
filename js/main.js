$(document).ready(()=>{
  allPokemon.forEach((pokemon, index)=>{
    $('#pokemon').append($('<option>', {
      value: index,
      text : `${pokemon.name} #${(pokemon.number+'').padStart(3,0)}`
    }));
  });
  $('#pokemon').change(function(){
    document.getElementById('pokemon_img').src = allPokemon[$(this).val()].img
    update_IV();
  });
  $('input').change(function(){
    update_IV();
  })
});
function update_IV(){
  formdata = {};
  $("form").serializeArray().forEach(function(obj, index){
      formdata[obj.name] = obj.value;
  });
  console.log(formdata);
  pokemon = allPokemon[formdata['pokemon']];
  document.getElementById('hp_iv').innerText = calc_iv(pokemon['hitpoints'], +formdata['hitpoints'], +formdata['level']);
  document.getElementById('att_iv').innerText = calc_iv(pokemon['attack'], +formdata['attack'], +formdata['level']);
  document.getElementById('total_iv').innerText = calc_iv((pokemon['attack'] + pokemon['hitpoints']) / 2, (+formdata['attack'] + +formdata['hitpoints']) / 2, +formdata['level']);
}
function calc_iv(base_attack = 140, current_attack = 151, level = 1){
	base_attack += +level;
	var diff = current_attack - base_attack;
	if (diff >= 10 && diff <= 10) return `${(diff / 10) * 100}% (brass)`;
	else if (diff >= 50 && diff <= 100) return `${Math.round(((diff - 50) / 50) * 100)}% (bronze)`;
	else if (diff >= 100 && diff <= 250) return `${Math.round(((diff - 100) / 150) * 100)}% (silver)`;
	else if (diff >= 300 && diff <= 400) return `${Math.round(((diff - 300) / 100) * 100)}% (gold)`;
  else return `N/A`;
}
