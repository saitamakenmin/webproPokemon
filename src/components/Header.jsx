export default function Header() {
    return (
      <header>
        <div style={styles.divStyle}>
            <font face = "fantasy">
            <h1 style={styles.pokemonTitle}>pokemon illustrated book</h1>
            </font>
        </div>
        
      </header>
    );
  }

  var styles={
    divStyle:{
        textAlign: "center",
        marginTop: 0,
        marginLeft: 500,
        marginRight: 500,
        backgroundColor: '',
    }
}