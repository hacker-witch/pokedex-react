import { useInfiniteQuery } from "@tanstack/react-query";
import { listAllSpecies } from "../api-clients/pokeapi";
import { PokemonType } from "../PokemonType";

type Pokemon = {
  nationalPokedexEntryNumber: number;
  name: string;
  types: PokemonType[];
  imageUrl: string;
};

export const usePokemons = () => {
  const { data, status, ...rest } = useInfiniteQuery({
    queryKey: ["pokemon-species"],
    queryFn: ({ pageParam }) => listAllSpecies(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const initial: Pokemon[] = [];
  const pokemons = data?.pages.reduce((acc, page) => {
    return acc.concat(page.data);
  }, initial);

  return { pokemons, status, ...rest };
};
