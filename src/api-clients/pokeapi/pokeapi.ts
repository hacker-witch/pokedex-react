import { z } from "zod";

const pokemonSpeciesUrlListSchema = z.object({
  count: z.number().int().gte(1),
  results: z
    .object({
      name: z.string().min(1),
      url: z.string().url(),
    })
    .array(),
});

const pokemonSpeciesResourceSchema = z.object({
  name: z.string().min(1),
  id: z.number().int().min(1),
  varieties: z
    .object({
      pokemon: z.object({
        url: z.string(),
      }),
    })
    .array(),
});

const pokemonResourceSchema = z.object({
  sprites: z.object({
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().url(),
      }),
    }),
  }),
  types: z
    .object({
      type: z.object({
        name: z.enum([
          "bug",
          "dark",
          "dragon",
          "electric",
          "fairy",
          "fighting",
          "fire",
          "flying",
          "ghost",
          "grass",
          "ground",
          "ice",
          "normal",
          "poison",
          "psychic",
          "rock",
          "steel",
          "water",
        ]),
      }),
    })
    .array()
    .nonempty(),
});

const BASE_URL = "https://pokeapi.co/api/v2";
const LIMIT = 20;

const fetchPokemonSpeciesUrlPage = async (page: number) => {
  const offset = LIMIT * (page - 1);

  const response = await fetch(
    `${BASE_URL}/pokemon-species/?offset=${offset}&limit=${LIMIT}`
  );

  return pokemonSpeciesUrlListSchema.parse(await response.json());
};

const fetchSpeciesPage = async (page: number) => {
  const { results, count } = await fetchPokemonSpeciesUrlPage(page);

  const numberOfPages = count / LIMIT;
  const isLastPage = page === numberOfPages;

  const promises = results.map(({ url }) => fetch(url));
  const responses = await Promise.all(promises);

  const speciesList = (
    await Promise.all(responses.map((response) => response.json()))
  ).map((data) => pokemonSpeciesResourceSchema.parse(data));

  const speciesPage = {
    data: speciesList,
    nextPage: isLastPage ? null : page + 1,
  };

  return speciesPage;
};

const fetchPokemonVariantsFromSpeciesList = async (
  speciesList: z.infer<typeof pokemonSpeciesResourceSchema>[]
) => {
  const promises = speciesList.map((species) =>
    fetch(species.varieties[0].pokemon.url)
  );
  const responses = await Promise.all(promises);
  const pokemonVariants = (
    await Promise.all(responses.map((response) => response.json()))
  ).map((data) => pokemonResourceSchema.parse(data));

  return pokemonVariants;
};

export const fetchPokemonPage = async (page = 1) => {
  const { data: speciesList, nextPage } = await fetchSpeciesPage(page);
  const pokemonVariants = await fetchPokemonVariantsFromSpeciesList(
    speciesList
  );

  return {
    data: pokemonVariants.map((pokemon, index) => ({
      nationalPokedexEntryNumber: speciesList[index].id,
      name: speciesList[index].name,
      types: pokemon.types.map(({ type }) => type.name),
      imageUrl: pokemon.sprites.other["official-artwork"].front_default,
    })),
    nextPage,
  };
};
