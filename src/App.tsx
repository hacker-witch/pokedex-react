import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { listAllSpecies } from "./api-clients/pokeapi";
import type { PokemonType } from "./PokemonType";
import { TypeIcon } from "./TypeIcon";

function App() {
  const [lastPokemonRef, lastPokemonIsInView] = useInView();
  const { data, status, fetchNextPage } = useInfiniteQuery({
    queryKey: ["pokemon-species"],
    queryFn: ({ pageParam }) => listAllSpecies(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (lastPokemonIsInView) {
    fetchNextPage();
  }

  if (status === "success") {
    return (
      <main className="app">
        <h1 className="app__title">Pokédex</h1>
        <ul className="pokemon-species-list app__pokemon-species-list">
          {data.pages.map(({ data: pokemonSpeciesList }, pagesIndex, pages) =>
            pokemonSpeciesList.map((species, speciesListIndex) => {
              const isLastElement =
                pagesIndex === pages.length - 1 &&
                speciesListIndex === pokemonSpeciesList.length - 1;

              return (
                <li
                  key={species.nationalPokedexEntryNumber}
                  ref={isLastElement ? lastPokemonRef : null}
                >
                  <PokemonSpeciesCard species={species} />
                </li>
              );
            })
          )}
        </ul>
      </main>
    );
  }

  return null;
}

type PokemonSpeciesProps = {
  species: {
    nationalPokedexEntryNumber: number;
    name: string;
    types: PokemonType[];
    imageUrl: string;
  };
};

const PokemonSpeciesCard = ({ species }: PokemonSpeciesProps) => {
  const { nationalPokedexEntryNumber, name, types, imageUrl } = species;

  const formattedNationalPokedexEntryNumber = `#${nationalPokedexEntryNumber
    .toString()
    .padStart(3, "0")}`;

  return (
    <article
      className={`pokemon-species-card pokemon-species-card--${types[0]}`}
    >
      <div className="pokemon-species-card__info">
        <p className="pokemon-species-card__entry-number">
          {formattedNationalPokedexEntryNumber}
        </p>
        <h2 className="pokemon-species-card__name">{name}</h2>
        <ul className="pokemon-species-card__types">
          <li key={types[0]} className={`type-badge type-badge--${types[0]}`}>
            <TypeIcon type={types[0]} className="type-badge__icon" /> {types[0]}
          </li>
          <li key={types[1]} className={`type-badge type-badge--${types[1]}`}>
            <TypeIcon type={types[1]} className="type-badge__icon" /> {types[1]}
          </li>
        </ul>
      </div>
      <div className="pokemon-species-card__image-container">
        <img className="pokemon-species-card__image" src={imageUrl} alt="" />
      </div>
    </article>
  );
};

export default App;
