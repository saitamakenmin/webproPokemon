import React, { useState } from 'react';
import Header from "./components/Header";
import Search from "./components/Search";
import Main from "./components/Pokemons";

export default function App() {
  const [searchedPokemon, setSearchedPokemon] = useState('');
  const handleSearch = (searchTerm) => {
    setSearchedPokemon(searchTerm); // 検索語をセットする
  };

  return (
    <div>
      <Header />
      <Search setSearchedPokemon={setSearchedPokemon} />
      <Main searchedPokemon={searchedPokemon} />
    </div>
  ); 
}
