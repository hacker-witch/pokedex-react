/// <reference types="vite-plugin-svgr/client" />

import { ReactComponent as GrassIcon } from './assets/types/grass.svg'
import { ReactComponent as PoisonIcon } from './assets/types/poison.svg'
import { ReactComponent as FireIcon } from './assets/types/fire.svg'

function App() {
  const pokemonSpeciesList = [
    {
      nationalPokedexEntryNumber: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    },
    {
      nationalPokedexEntryNumber: 2,
      name: 'ivysaur',
      types: ['grass', 'poison'],
      imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png"
    },
    {
      nationalPokedexEntryNumber: 3,
      name: 'venusaur',
      types: ['grass', 'poison'],
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png'
    },
    {
      nationalPokedexEntryNumber: 4,
      name: 'charmander',
      types: ['fire'],
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
    }
  ]

  return (
    <main className="app">
      <h1 className="app__title">Pokédex</h1>
      <ul className="pokemon-species-list app__pokemon-species-list">
        {pokemonSpeciesList.map(species => <li key={species.nationalPokedexEntryNumber}><PokemonSpeciesCard species={species} /></li>)}
      </ul>
    </main>
  )
}

type PokemonSpeciesProps = {
  species: {
    nationalPokedexEntryNumber: number,
    name: string,
    types: string[],
    imageUrl: string
  }
}

const PokemonSpeciesCard = ({ species }: PokemonSpeciesProps) => {
  const types = species.types

  const TypeIcon1 = types[0] === 'grass'
    ? GrassIcon
    : types[0] === 'poison'
    ? PoisonIcon
    : types[0] === 'fire'
    ? FireIcon
    : () => null

  const TypeIcon2 = types[1] === 'grass'
    ? GrassIcon
    : types[1] === 'poison'
    ? PoisonIcon
    : types[1] === 'fire'
    ? FireIcon
    : () => null
  
  return (
    <article className={`pokemon-species-card pokemon-species-card--${species.types[0]}`}>
      <div className="pokemon-species-card__info">
        <p className="pokemon-species-card__entry-number">#00{species.nationalPokedexEntryNumber}</p>
        <h2 className="pokemon-species-card__name">{species.name}</h2>
        <ul className="pokemon-species-card__types">
            <li key={types[0]} className={`type-badge type-badge--${types[0]}`}>
              <TypeIcon1 className='type-badge__icon' /> {types[0]}
            </li>
            <li key={types[1]} className={`type-badge type-badge--${types[1]}`}>
              <TypeIcon2 className='type-badge__icon' /> {types[1]}
            </li>
        </ul>
      </div>
      <img className="pokemon-species-card__image" src={species.imageUrl} alt="" />
    </article>
  )
}

export default App
