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
    </main>
  )
}

export default App
