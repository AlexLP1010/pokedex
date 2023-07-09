// DOM Objects
const pokeList = document.getElementById('pokeList')
const pokeImage = document.getElementById('pokeImage')
const pokemonId = document.getElementById('pokemonId')
const pokeName = document.getElementById('pokeName')
const pokeTypes = document.getElementById('pokeTypes')
const loadingElement = document.getElementById('loadingElement')

const pokeTypeColors = {
  normal: '#4f5255',
  grass: '#62b658',
  fighting: '#c54069',
  flying: '#90a9e1',
  poison: '#ae66cc',
  ground: '#dd7a4e',
  rock: '#c2b388',
  bug: '#8fbf2f',
  ghost: '#546cac',
  steel: '#5a8da5',
  fire: '#ff9b4e',
  water: '#4e91d4',
  electric: '#f2d139',
  psychic: '#fc6f77',
  ice: '#71cec0',
  dragon: '#126fc4',
  dark: '#5e5569',
  fairy: '#ed93e8',
  unknown: '#fafafa',
  shadow: '#2d2726'
}

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
        newType.innerText = t.type.name
        newType.classList.add('pokemon-type')
        newType.style = `background-color: ${pokeTypeColors[t.type.name]};`
        pokeTypes.appendChild(newType)
      })
    })
}

/**
 * Add zeros to the id until it has 4 digits
 * @param {string} id Id of pokemon
 * @returns {string} Id normalized whit 4 digits
 */
function normalizeId(id) {
  if(id.length < 4)
    return normalizeId('0' + id)
  return id
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
          newPokemon.innerText = `${normalizeId(id)} ${pokemon.name}`
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