import React, { useState } from 'react';
import Header from "./components/Header";
import Introduce from "./components/Introduce";
import Main from "./components/Pokemons";

export default function App() {
  const [searchedPokemon, setSearchedPokemon] = useState('');
  const handleSearch = (searchTerm) => {
    setSearchedPokemon(searchTerm); 
  };

  return (
    <div>
      <Header />
      <Introduce />
      <Main searchedPokemon={searchedPokemon} />
    </div>
  ); 
}
