export default function Header() {
  const lineStyle = {
    borderTop: '5px solid #000', 
  };

  const containerStyle = {
    textAlign: "center",
    marginTop: 0,
    marginLeft: '-100px', 
    marginRight: '-100px', 
    backgroundColor: '',
  };

  return (
    <header>
      <div style={containerStyle}>
        <font face="fantasy">
          <h1 style={styles.pokemonTitle}>ポケモン図鑑</h1>
        </font>
        <div style={lineStyle}></div>
      </div>
    </header>
  );
}

var styles = {
  pokemonTitle: {
  },
};
