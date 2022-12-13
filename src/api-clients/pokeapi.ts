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

export const fetchPokemonPage = async (page = 1) => {
  const limit = 20;
  const offset = limit * (page - 1);
  let response = await fetch(
    `${BASE_URL}/pokemon-species/?offset=${offset}&limit=${limit}`
  );

  const { results, count } = pokemonSpeciesUrlListSchema.parse(
    await response.json()
  );
  const numberOfPages = count / limit;
  const isLastPage = page === numberOfPages;

  let promises = [];
  promises = results.map(({ url }) => fetch(url));

  let responses = await Promise.all(promises);
  const speciesList = (
    await Promise.all(responses.map((response) => response.json()))
  ).map((data) => pokemonSpeciesResourceSchema.parse(data));

  promises = speciesList.map((species) =>
    fetch(species.varieties[0].pokemon.url)
  );
  responses = await Promise.all(promises);
  const pokemonList = (
    await Promise.all(responses.map((response) => response.json()))
  ).map((data) => pokemonResourceSchema.parse(data));

  return {
    data: pokemonList.map((pokemon, index) => ({
      nationalPokedexEntryNumber: speciesList[index].id,
      name: speciesList[index].name,
      types: pokemon.types.map(({ type }) => type.name),
      imageUrl: pokemon.sprites.other["official-artwork"].front_default,
    })),
    nextPage: isLastPage ? null : page + 1,
  };
};
