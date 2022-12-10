import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'
import type { PokemonType } from './PokemonType'
import { TypeIcon } from './TypeIcon'

const BASE_URL = 'https://pokeapi.co/api/v2'

const pokemonSpeciesUrlListSchema = z.object({
  results: z.object({
    name: z.string().min(1),
    url: z.string().url()
  }).array().nonempty()
})

const pokemonSpeciesResourceSchema = z.object({
  name: z.string().min(1),
  id: z.number().int().min(1)
})

const pokemonResourceSchema = z.object({
  sprites: z.object({ 
    other: z.object({
      'official-artwork': z.object({
        'front_default': z.string().url()
      })
    })  
  }),
  types: z.object({
    type: z.object({
      name: z.enum([
        'bug', 
        'dark', 
        'dragon', 
        'electric', 
        'fairy', 
        'fighting', 
        'fire', 
        'flying',
        'ghost',
        'grass',
        'ground',
        'ice',
        'normal',
        'poison',
        'psychic',
        'rock',
        'steel',
        'water'
      ])
    })
  }).array().nonempty()
})

const listAllSpecies = async (page = 1) => {
  const limit = 20
  const offset = limit * (page - 1)
  let response = await fetch(`${BASE_URL}/pokemon-species/?offset=${offset}&limit=${limit}`)
  
  const { results } = pokemonSpeciesUrlListSchema.parse(await response.json())

  let promises = []
  promises = results.map(({ url }) => fetch(url))

  let responses = await Promise.all(promises)
  const speciesList = (await Promise.all(responses.map(response => response.json())))
    .map(data => pokemonSpeciesResourceSchema.parse(data))

  promises = speciesList.map(species => fetch(`${BASE_URL}/pokemon/${species.name}`))
  responses = await Promise.all(promises)
  const pokemonList = (await Promise.all(responses.map(response => response.json())))
    .map(data => pokemonResourceSchema.parse(data))

  return pokemonList.map((pokemon, index) => ({ 
    nationalPokedexEntryNumber: speciesList[index].id,
    name: speciesList[index].name,
    types: pokemon.types.map(({ type }) => type.name),
    imageUrl: pokemon.sprites.other['official-artwork'].front_default
  }))
}

function App() {
  const { data, status } = useInfiniteQuery({ 
    queryKey: ['pokemon-species'], 
    queryFn: ({ pageParam }) => listAllSpecies(pageParam) 
  })

  if (status === 'success') {
    return (
      <main className="app">
        <h1 className="app__title">Pokédex</h1>
        <ul className="pokemon-species-list app__pokemon-species-list">
          {
            data.pages.map(speciesList => (
              speciesList.map(species => (
                <li key={species.nationalPokedexEntryNumber}><PokemonSpeciesCard species={species} /></li>
              ))
            ))
          }
        </ul>
      </main>
    )
  }

  return null
}

type PokemonSpeciesProps = {
  species: {
    nationalPokedexEntryNumber: number,
    name: string,
    types: PokemonType[],
    imageUrl: string
  }
}

const PokemonSpeciesCard = ({ species }: PokemonSpeciesProps) => {
  const { nationalPokedexEntryNumber, name, types, imageUrl } = species
  
  const formattedNationalPokedexEntryNumber = `#${nationalPokedexEntryNumber.toString().padStart(3, '0')}`
  
  return (
    <article className={`pokemon-species-card pokemon-species-card--${types[0]}`}>
      <div className="pokemon-species-card__info">
        <p className="pokemon-species-card__entry-number">{formattedNationalPokedexEntryNumber}</p>
        <h2 className="pokemon-species-card__name">{name}</h2>
        <ul className="pokemon-species-card__types">
            <li key={types[0]} className={`type-badge type-badge--${types[0]}`}>
              <TypeIcon type={types[0]} className='type-badge__icon' /> {types[0]}
            </li>
            <li key={types[1]} className={`type-badge type-badge--${types[1]}`}>
              <TypeIcon type={types[1]} className='type-badge__icon' /> {types[1]}
            </li>
        </ul>
      </div>
      <div className="pokemon-species-card__image-container">
        <img className="pokemon-species-card__image" src={imageUrl} alt="" />
      </div>
    </article>
  )
}

export default App
