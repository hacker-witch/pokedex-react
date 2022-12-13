import { useInfiniteQuery } from "@tanstack/react-query";
import { listAllSpecies } from "../api-clients/pokeapi";

type PokemonList = Awaited<ReturnType<typeof listAllSpecies>>["data"];

export const usePokemons = () => {
  const { data, status, ...rest } = useInfiniteQuery({
    queryKey: ["pokemon-species"],
    queryFn: ({ pageParam }) => listAllSpecies(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const initial: PokemonList = [];
  const pokemons = data?.pages.reduce((acc, page) => {
    return acc.concat(page.data);
  }, initial);

  return { pokemons, status, ...rest };
};
