import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPokemonPage } from "../api-clients/pokeapi";

type PokemonList = Awaited<ReturnType<typeof fetchPokemonPage>>["data"];

export const usePokemons = () => {
  const { data, status, ...rest } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: ({ pageParam }) => fetchPokemonPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const initial: PokemonList = [];
  const pokemons = data?.pages.reduce((acc, page) => {
    return acc.concat(page.data);
  }, initial);

  return { pokemons, status, ...rest };
};
