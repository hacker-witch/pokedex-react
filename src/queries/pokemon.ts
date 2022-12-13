import { UseInfiniteQueryOptions } from "@tanstack/react-query";
import { fetchPokemonPage } from "../api-clients/pokeapi";

export const allPokemonsInfiniteQuery = (): UseInfiniteQueryOptions<
  Awaited<ReturnType<typeof fetchPokemonPage>>
> => ({
  queryKey: ["pokemon"],
  queryFn: ({ pageParam }) => fetchPokemonPage(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
