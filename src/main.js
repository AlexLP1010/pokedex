const pokeList = document.getElementById('pokeList')
const pokeImage = document.getElementById('pokeImage')
const pokemonId = document.getElementById('pokemonId')
const pokeName = document.getElementById('pokeName')
const pokeTypes = document.getElementById('pokeTypes')
const loadMore = document.getElementById('loadMore')

function getPokemonList() {
  let  url = 'https://pokeapi.co/api/v2/pokemon/'

  const next = () => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        data.results.forEach(pokemon => {
          const newPokemon = document.createElement('button')
          newPokemon.type = 'button'
          newPokemon.innerText = pokemon.name
          newPokemon.addEventListener('click', () => {
            selectPokemon(pokemon.url)
          })
          pokeList.appendChild(newPokemon)
        })
        url = data.next
      })
      .catch(err => console.error(err))
  }

  return next
}

function selectPokemon(url) {
  fetch(url)
    .then(res => res.json())
    .then(pokemon => {
      pokeImage.setAttribute('src', pokemon.sprites.front_default)
      pokemonId.innerText = pokemon.id
      pokeName.innerText = pokemon.name
      pokeTypes.innerHTML = ''
      pokemon.types.forEach(t => {
        const newType = document.createElement('span')
        newType.innerText = t.type.name + ' '
        pokeTypes.appendChild(newType)
      })
    })
}

const pokemonList = getPokemonList()

loadMore.addEventListener('click', () => {
  pokemonList()
})

pokemonList()