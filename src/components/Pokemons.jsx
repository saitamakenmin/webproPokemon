import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination"; // Import Pagination from MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


// キャッシュを保存するためのオブジェクト
const pokemonCache = {};
const typeTranslations = {
    normal: "ノーマル",
    fire: "ほのお",
    water: "みず",
    electric: "でんき",
    grass: "くさ",
    ice: "こおり",
    fighting: "かくとう",
    poison: "どく",
    ground: "じめん",
    flying: "ひこう",
    psychic: "エスパー",
    bug: "むし",
    rock: "いわ",
    ghost: "ゴースト",
    dragon: "ドラゴン",
    dark: "あく",
    steel: "はがね",
    fairy: "フェアリー"
  };

  const typeMapping = {
    "ノーマル": "normal",
    "ほのお": "fire",
    "みず": "water",
    "でんき": "electric",
    "くさ": "grass",
    "こおり": "ice",
    "かくとう": "fighting",
    "どく": "poison",
    "じめん": "ground",
    "ひこう": "flying",
    "エスパー": "psychic",
    "むし": "bug",
    "いわ": "rock",
    "ゴースト": "ghost",
    "ドラゴン": "dragon",
    "あく": "dark",
    "はがね": "steel",
    "フェアリー": "fairy"
  };

  // 世代ごとのID範囲を定義
const generationRanges = {
  '第一世代': { start: 1, end: 151 },
  '第二世代': { start: 152, end: 251 },
  '第三世代': { start: 252, end: 386 },
  '第四世代': { start: 387, end: 493 },
  '第五世代': { start: 494, end: 649 },
  '第六世代': { start: 650, end: 721 },
  '第七世代': { start: 722, end: 809 },
  '第八世代': { start: 810, end: 899 },
};

  async function fetchPokemonData(id) {
    if (pokemonCache[id]?.data) {
      return pokemonCache[id].data;
    }
  
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
  
    // タイプを日本語に翻訳する
    const translatedTypes = data.types.map((typeEntry) => {
      return typeTranslations[typeEntry.type.name] || typeEntry.type.name;
    });
  
    const pokemonDataWithTranslatedTypes = {
      ...data,
      types: translatedTypes // 日本語に翻訳されたタイプ
    };
  
    pokemonCache[id] = { ...(pokemonCache[id] || {}), data: pokemonDataWithTranslatedTypes };
    return pokemonDataWithTranslatedTypes;
  }

async function fetchPokemonName(id) {
  if (pokemonCache[id]?.name) {
    return pokemonCache[id].name;
  }

  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const name = data.names.find((n) => n.language.name === "ja").name;

  pokemonCache[id] = { ...(pokemonCache[id] || {}), name };
  return name;
}

async function fetchFlavorText(id) {
  if (pokemonCache[id]?.flavorText) {
    return pokemonCache[id].flavorText;
  }

  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const flavorTextEntries = data.flavor_text_entries.filter((entry) => entry.language.name === "ja");
  const selectedFlavorText = flavorTextEntries.find((entry) => entry.version.name === "sword") || flavorTextEntries[0];
  let flavorText = selectedFlavorText.flavor_text;

  // 特殊文字の置換
  flavorText = flavorText.replace(/\\n/g, ' ');

  pokemonCache[id] = { ...(pokemonCache[id] || {}), flavorText };
  return flavorText;
}

async function fetchPokemonGenera(id) {
  if (pokemonCache[id]?.genera) {
    return pokemonCache[id].genera;
  }

  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const genera = data.genera.find((v) => v.language.name === "ja")?.genus || "";

  pokemonCache[id] = { ...(pokemonCache[id] || {}), genera };
  return genera;
}

export default function Pokemons() {
    const [pokemons, setPokemons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // 追加
    const [paginationRange, setPaginationRange] = useState({ start: 1, end: 10 });
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [flavorText, setFlavorText] = useState(""); 
    const [genera, setGenera] = useState(""); 
    const [types, setTypes] = useState(""); // 追加
    const [selectedType, setSelectedType] = useState('');
    const maxPage = 42;
    const [nameMapping, setNameMapping] = useState({});

    const [loading, setLoading] = useState(false); // ローディング状態の管理
    const [searchTerm, setSearchTerm] = useState(""); // 検索語の状態


    // 現在選択されている世代を追跡するための状態
const [selectedGeneration, setSelectedGeneration] = useState('');

// 世代に基づいてポケモンを検索する関数
const searchByGeneration = async (generation) => {
  if (!generation) return;

  setLoading(true);
  const range = generationRanges[generation];
  try {
    const pokemonPromises = [];
    for (let i = range.start; i <= range.end; i++) {
      pokemonPromises.push(fetchPokemonData(i));
    }
    let pokemonResults = await Promise.all(pokemonPromises);
    pokemonResults = pokemonResults.filter(pokemon => pokemon != null); // nullを除外

    // 日本語名を取得してデータに追加
    const updatedPokemonResults = await Promise.all(pokemonResults.map(async pokemon => {
      const japaneseName = await fetchPokemonName(pokemon.id);
      return { ...pokemon, japaneseName };
    }));

    setPokemons(updatedPokemonResults);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

    const displayPokemonDetails = () => {
      return (
          <div>
              <h2>No.{selectedPokemon.id} {selectedPokemon.japaneseName || selectedPokemon.name}</h2>
              <img
                  src={selectedPokemon.sprites.other["official-artwork"].front_default}
                  alt={`pokemon-${selectedPokemon.id}`}
                  width="200"
                  height="200"
              />
              <img
                  src={selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.japaneseName || selectedPokemon.name}
              />
              <p>タイプ: {selectedPokemon.types.join(', ')}</p> 
              <p>身長: {selectedPokemon.height / 10} m</p>
              <p>重さ: {selectedPokemon.weight / 10} kg</p>
              <p>{selectedPokemon.flavorText || flavorText}</p>
          </div>
      );
  };

  // タイプに基づいてポケモンを検索する関数
  const searchByType = async () => {
    if (!selectedType) return;

    setLoading(true);
    try {
      // 日本語名から英語名に変換
      const typeInEnglish = typeMapping[selectedType];
      const response = await fetch(`https://pokeapi.co/api/v2/type/${typeInEnglish}`);
      if (!response.ok) {
        throw new Error('タイプに合致するポケモンが見つかりませんでした');
      }
      const data = await response.json();
      const pokemonData = await Promise.all(data.pokemon.map(async (pokemon) => {
        const res = await fetch(pokemon.pokemon.url);
        return await res.json();
      }));
      setPokemons(pokemonData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const searchPokemon = async () => {
    if (!searchTerm) return;
  
    setLoading(true);
    try {
      const englishName = nameMapping[searchTerm.toLowerCase()] || searchTerm.toLowerCase();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${englishName}`);
      if (!response.ok) {
        throw new Error('ポケモンが見つかりませんでした');
      }
      const data = await response.json();
  
      // 英語名から日本語名を取得
      const japaneseName = await fetchPokemonName(data.id);
  
      // タイプを日本語に翻訳して配列にする
      const translatedTypes = data.types.map(typeEntry => typeTranslations[typeEntry.type.name] || typeEntry.type.name);
  
      // flavorTextを取得
      const flavorText = await fetchFlavorText(data.id);
  
      // 選択したポケモンの詳細をセット
      setSelectedPokemon({...data, japaneseName, types: translatedTypes, flavorText});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const fetchNames = async () => {
        const url = `https://pokeapi.co/api/v2/pokemon-species?limit=1200`;
        const response = await fetch(url);
        const data = await response.json();
        const names = data.results;

        const mapping = {};
        for (const name of names) {
            const speciesResponse = await fetch(name.url);
            const speciesData = await speciesResponse.json();
            const japaneseName = speciesData.names.find(n => n.language.name === 'ja')?.name;
            if (japaneseName) {
                mapping[japaneseName.toLowerCase()] = name.name;
            }
        }
        setNameMapping(mapping);
    };
    fetchNames();
}, []);
    

  useEffect(() => {
    const fetchTotalCount = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon`;
      const res = await fetch(url);
      const data = await res.json();
      return data.count;
    };

    fetchTotalCount().then((totalCount) => {
      const totalPages = Math.ceil(totalCount / 24);
      setTotalPages(totalPages); // ページ数をセット
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const pokemonIds = Array.from({ length: 24 }, (_, i) => i + 1 + (currentPage - 1) * 24);
      const pokemonDataPromises = pokemonIds.map((id) => fetchPokemonData(id));
      const pokemonNamePromises = pokemonIds.map((id) => fetchPokemonName(id));

      const pokemonDataResults = await Promise.all(pokemonDataPromises);
      const pokemonNameResults = await Promise.all(pokemonNamePromises);

      const combinedData = pokemonDataResults.map((data, index) => ({
        ...data,
        japaneseName: pokemonNameResults[index],
      }));

      setPokemons(combinedData);
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === paginationRange.end && currentPage < maxPage) {
      setPaginationRange({ start: currentPage, end: Math.min(currentPage + 10, maxPage) });
    }
  }, [currentPage, paginationRange]);

  const handlePokemonClick = async (pokemon) => {
    setSelectedPokemon(pokemon);

    const text = await fetchFlavorText(pokemon.id);
    setFlavorText(text);

    const generaText = await fetchPokemonGenera(pokemon.id);
    setGenera(generaText);

    const typesText = pokemon.types.join(", "); // タイプの配列を文字列に変換
    setTypes(typesText); // ステートにセット
  };

  useEffect(() => {
    // その他の useEffect ロジックは変更なし

    // ページが最大値を超えないようにする
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage]);

  const closeModal = () => {
    setSelectedPokemon(null);
    setFlavorText(""); // モーダルが閉じられたときに紹介文をクリア
    setGenera(""); // モーダルが閉じられたときに分類をクリア
  };

  return (
    <div style={styles.divStyle}>
        <Grid container spacing={2}>
            {pokemons.map((pokemon, index) => (
                <Grid item key={index} xs={2} sm={2} md={2} lg={2}>
                    <ImageList sx={{ width: 380, height: 250 }}>
                        <ImageListItem
                            key={pokemon.id}
                            onClick={() => handlePokemonClick(pokemon)}
                        >
                            <img
                                src={
                                    pokemon.sprites.other["official-artwork"].front_default
                                }
                                className="Pokemon-img"
                                alt={`pokemon-${index}`}
                                width="150"
                                height="150"
                            />
                            <ImageListItemBar
                                title={<span>{pokemon.japaneseName}</span>}
                                subtitle={`No.${pokemon.id}`}
                                position="below"
                            />
                        </ImageListItem>
                    </ImageList>
                </Grid>
            ))}
        </Grid>
        <div style={{ 
  display: "flex", 
  justifyContent: "center", 
  marginTop: "20px", 
  marginBottom: "20px",
  width: "100%" // 横幅を100%に設定
}}>
  <Pagination
    count={paginationRange.end}
    color="primary"
    onChange={(e, page) => setCurrentPage(page)}
    page={currentPage}
  />
</div>

        <div style={{ marginBottom: '10px' }}>
  {/* 検索フォーム */}
  <TextField
    label="ポケモン名を入力"
    variant="outlined"
    size="medium"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ marginRight: 10, width: 'calc(50% - 60px)' }}
  />
  <Button
    variant="contained"
    size="large"
    onClick={searchPokemon}
    style={{ width: '150px' , height: '56px'}}
  >
    検索
  </Button>
</div>

<div style={{ marginBottom: '10px' }}>
  <TextField
    select
    label="タイプを選択"
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
    variant="outlined"
    size="medium"
    SelectProps={{ native: true }}
    style={{ marginRight: 10, width: 'calc(50% - 60px)' }}
  >
    <option value="">タイプを選択</option>
    {Object.keys(typeMapping).map(type => (
      <option key={type} value={type}>{type}</option>
    ))}
  </TextField>
  <Button
    variant="contained"
    size="large"
    onClick={searchByType}
    style={{ width: '150px' , height: '56px'}}
  >
    タイプで検索
  </Button>
</div>

<div style={{ marginBottom: '10px' }}>
  <TextField
    select
    label="世代を選択"
    value={selectedGeneration}
    onChange={(e) => setSelectedGeneration(e.target.value)}
    variant="outlined"
    size="medium"
    SelectProps={{ native: true }}
    style={{ marginRight: 10, width: 'calc(50% - 60px)' }}
  >
    <option value="">世代を選択</option>
    {Object.keys(generationRanges).map(generation => (
      <option key={generation} value={generation}>{generation}</option>
    ))}
  </TextField>
  <Button
    variant="contained"
    size="large"
    onClick={() => searchByGeneration(selectedGeneration)}
    style={{ width: '150px' , height: '56px'}}
  >
    世代で検索
  </Button>
</div>


      {/* ローディングと検索結果の表示 */}
      {loading && <p>読み込み中...</p>}

        {selectedPokemon && (
            <div
                style={styles.modalBackdropStyle}
                onClick={closeModal}
            >
                <div
                    style={styles.modalContentStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    {selectedPokemon && displayPokemonDetails()}
                    <button onClick={closeModal}>戻る</button>
                </div>
            </div>
        )}
    </div>
);
}

const styles = {
  divStyle: {
    textAlign: "center",
    margin: "100px",
    padding: "0 10px",
  },
  modalBackdropStyle: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentStyle: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  formItem: {
    margin: "5px",
  },
};