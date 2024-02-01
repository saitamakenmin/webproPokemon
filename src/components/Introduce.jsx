import * as React from 'react';

export default function Search() {
  return (
    <div style={styles.divStyle}>
      <p>
      ポケモン第一世代~第八世代までのポケモン一覧です。下の方に検索機能もあります。</p>
<p>(第九世代以降はAPI上に紹介文がなかったり、一部画像データが存在しないポケモンがいたため、バザギリ~ミライドンまでのみを表示させています。)</p>
    </div>
  );
}

const styles = {
  divStyle: {
    textAlign: "center",
    marginTop: 0,
    marginLeft: 50,
    marginRight: 50,
  }
}
