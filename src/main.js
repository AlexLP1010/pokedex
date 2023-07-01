// DOM Objects
const pokeList = document.getElementById('pokeList')
const pokeImage = document.getElementById('pokeImage')
const pokemonId = document.getElementById('pokemonId')
const pokeName = document.getElementById('pokeName')
const pokeTypes = document.getElementById('pokeTypes')
const loadingElement = document.getElementById('loadingElement')

/**
 * 
 * @param {string} url 
 */
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

function getPokemonList() {
  let  url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50'

  const next = () => {
    if (!url) {
      observer.disconnect()
      loadingElement.innerText = 'End'
      return
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        data.results.forEach(pokemon => {
          const newPokemon = document.createElement('button')
          newPokemon.type = 'button'
          newPokemon.classList.add('pokemon-button')
          const regex = /(?<!v)\d+/gm
          const id = regex.exec(pokemon.url)
          newPokemon.innerText = `${id} ${pokemon.name}`
          newPokemon.addEventListener('click', () => {
            selectPokemon(pokemon.url)
          })
          pokeList.appendChild(newPokemon)
        })
        url = data.next
      })
      .catch(err => {
        observer.disconnect()
        loadingElement.innerText = 'Error'
        console.error(err)
      })
  }

  return next
}

const pokemonList = getPokemonList()

const observer = new IntersectionObserver(handleRequestList)
/**
 * 
 * @param {IntersectionObserverEntry[]} entries 
 */
function handleRequestList(entries) {
  const entry = entries[0]
  if (entry.isIntersecting)
    pokemonList()
}

observer.observe(loadingElement)