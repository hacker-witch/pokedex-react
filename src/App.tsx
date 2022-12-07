import { useQuery } from 'react-query'
import { z } from 'zod'
import { ReactComponent as GrassIcon } from './assets/types/grass.svg'
import { ReactComponent as PoisonIcon } from './assets/types/poison.svg'
import { ReactComponent as FireIcon } from './assets/types/fire.svg'

const BASE_URL = 'https://pokeapi.co/api/v2'

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
      name: z.string().min(1)
    })
  }).array().nonempty()
})

const listAllSpecies = async () => {
  let promises = []
  for (let i = 1; i <= 20; i++) {
    const promise = fetch(`${BASE_URL}/pokemon-species/${i}`)
    promises.push(promise)
  }

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
  const { data: pokemonSpeciesList, status } = useQuery({ queryKey: ['pokemon-species'], queryFn: listAllSpecies })

  if (status === 'success') {
    return (
      <main className="app">
        <h1 className="app__title">Pokédex</h1>
        <ul className="pokemon-species-list app__pokemon-species-list">
          {pokemonSpeciesList.map(species => <li key={species.nationalPokedexEntryNumber}><PokemonSpeciesCard species={species} /></li>)}
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
    types: string[],
    imageUrl: string
  }
}

const PokemonSpeciesCard = ({ species }: PokemonSpeciesProps) => {
  const { nationalPokedexEntryNumber, name, types, imageUrl } = species

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
  
  const formattedNationalPokedexEntryNumber = `#${nationalPokedexEntryNumber.toString().padStart(3, '0')}`
  
  return (
    <article className={`pokemon-species-card pokemon-species-card--${types[0]}`}>
      <div className="pokemon-species-card__info">
        <p className="pokemon-species-card__entry-number">{formattedNationalPokedexEntryNumber}</p>
        <h2 className="pokemon-species-card__name">{name}</h2>
        <ul className="pokemon-species-card__types">
            <li key={types[0]} className={`type-badge type-badge--${types[0]}`}>
              <TypeIcon1 className='type-badge__icon' /> {types[0]}
            </li>
            <li key={types[1]} className={`type-badge type-badge--${types[1]}`}>
              <TypeIcon2 className='type-badge__icon' /> {types[1]}
            </li>
        </ul>
      </div>
      <div className="pokemon-species-card__image-container">
        <img className="pokemon-species-card__image" src={species.imageUrl} alt="" />
      </div>
    </article>
  )
}

export default App
