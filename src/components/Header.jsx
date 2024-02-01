export default function Header() {
  const lineStyle = {
    borderTop: '5px solid #000', // 直線のスタイルを設定
  };

  const containerStyle = {
    textAlign: "center",
    marginTop: 0,
    marginLeft: '-100px', // 左のマージンを調整
    marginRight: '-100px', // 右のマージンを調整
    backgroundColor: '',
  };

  return (
    <header>
      <div style={containerStyle}>
        <font face="fantasy">
          <h1 style={styles.pokemonTitle}>ポケモン図鑑</h1>
        </font>
        <div style={lineStyle}></div> {/* 直線を描画 */}
      </div>
    </header>
  );
}

var styles = {
  pokemonTitle: {
    // タイトルのスタイル
  },
};
