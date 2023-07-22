// DOM Objects
const pokeList = document.getElementById('pokeList')
const pokeImage = document.getElementById('pokeImage')
const pokemonId = document.getElementById('pokemonId')
const pokeName = document.getElementById('pokeName')
const pokeTypes = document.getElementById('pokeTypes')
const loadingElement = document.getElementById('loadingElement')
const details = document.getElementById('details')
const list = document.getElementById('list')
const stats = document.getElementById('stats')
const btnBack = document.getElementById('btnBack')
const pokeWeight = document.getElementById('pokeWeight')
const pokeHeight = document.getElementById('pokeHeight')
const selecctedPokemon = document.getElementById('selecctedPokemon')

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

let selectedPokemon = undefined

function toggleDetails() {
  details.classList.toggle('hide')
  list.classList.toggle('hide')
  pokeHeight.innerText = selectedPokemon.height
  pokeWeight.innerText = selectedPokemon.weight
  stats.innerHTML = ''
  selectedPokemon.stats.map(stat => {
    const statElement = document.createElement('p')
    statElement.innerText = `${stat.stat.name}: ${stat.base_stat}`
    stats.appendChild(statElement)
  })
}

/**
 * 
 * @param {string} url 
 */
function selectPokemon(url, pokemonId) {
  if (selectedPokemon && pokemonId === selectedPokemon.id.toString()){
    toggleDetails()
    return
  }

  selecctedPokemon.classList.add('loading')

  fetch(url)
    .then(res => res.json())
    .then(pokemon => {
      selectedPokemon = pokemon
      pokeImage.setAttribute('src', pokemon.sprites.front_default)
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
          const id = regex.exec(pokemon.url)[0]
          newPokemon.innerText = `${normalizeId(id)} ${pokemon.name}`
          newPokemon.addEventListener('click', () => {
            selectPokemon(pokemon.url, id)
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

function handleLoadingImg() {
  if (!selectedPokemon)
    return
  
  selecctedPokemon.classList.remove('loading')
  pokemonId.innerText = selectedPokemon.id
  pokeName.innerText = selectedPokemon.name
  pokeTypes.innerHTML = ''
  selectedPokemon.types.forEach(t => {
    const newType = document.createElement('span')
    newType.innerText = t.type.name
    newType.classList.add('pokemon-type')
    newType.style = `background-color: ${pokeTypeColors[t.type.name]};`
    pokeTypes.appendChild(newType)
  })
}

btnBack.addEventListener('click', toggleDetails)

pokeImage.addEventListener('load', handleLoadingImg)

observer.observe(loadingElement)