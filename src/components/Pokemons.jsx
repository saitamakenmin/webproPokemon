import { useEffect, useState } from "react";
import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Grid from '@mui/material/Grid';

async function fetchPokemonData(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export default function Pokemons() {
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedPokemons = [];
            for (let i = 1; i <= 12; i++) {
                const pokemon = await fetchPokemonData(i);
                fetchedPokemons.push(pokemon);
            }
            setPokemons(fetchedPokemons);
        };
        fetchData();
    }, []);

    return (
        <div style={styles.divStyle}>
            <Grid container spacing={2}>
                {pokemons.map((pokemon, index) => (
                    <Grid item key={index} xs={2} sm={2} md={2} lg={2}>
                        <ImageList sx={{ width: 370, height: 250 }}>
                            <ImageListItem key={pokemon.id}>
                                <img
                                    src={pokemon.sprites.other["official-artwork"].front_default}
                                    className="Pokemon-img"
                                    alt={`pokemon-${index}`}
                                    width="150"
                                    height="150"
                                />
                                <ImageListItemBar
                                    title={`No.${pokemon.id}`}
                                    subtitle={<span>{pokemon.forms[0].name}</span>}
                                    position="below"
                                />
                            </ImageListItem>
                        </ImageList>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

var styles = {
    divStyle: {
        textAlign: "center",
        margin: "100px",
    }
};
