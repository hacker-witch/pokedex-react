import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonPage } from "../api-clients/pokeapi";
import { allPokemonsInfiniteQuery } from "../queries/pokemon";

type PokemonList = Awaited<ReturnType<typeof fetchPokemonPage>>["data"];

export const usePokemons = () => {
  const { data, status, ...rest } = useInfiniteQuery(
    allPokemonsInfiniteQuery()
  );

  const initial: PokemonList = [];
  const pokemons = data?.pages.reduce((acc, page) => {
    return acc.concat(page.data);
  }, initial);

  return { pokemons, status, ...rest };
};
