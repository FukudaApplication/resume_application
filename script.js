// 住所の入力エラー
async function searchAddress () {
    const postalCode = document.getElementById("searchAddressBox").value;
    const url = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + postalCode;
    const response = await fetch(url);
    const data = await response.json();
    if(!(data['results'])) {
    document.getElementById( "checkAddress" ).innerHTML = '該当データなし';
    } else {
    const address = data['results'][0]['address1'] + data['results'][0]['address2'] + data['results'][0]['address3']
    document.getElementById( "addressForm" ).value = address;
    }
}

function inputAddressCheck() {
    const inputValue = document.getElementById( "searchAddressBox" ).value;
    if (!(inputValue.match(/^[0-9]+$/)) || !(inputValue.length === 7)) {
    document.getElementById( "checkAddress" ).innerHTML = "<span style='color: red;'>半角数字7桁で入力してください！</span>";
    } else {
    document.getElementById( "checkAddress" ).innerHTML = '';
    }
}

// 電話番号の入力エラー
function inputTelCheck() {
    const inputValue = document.getElementById( "searchTelBox" ).value;
    if (!(inputValue.match(/^[0-9]+$/)) || !(inputValue.length === 11)) {
    document.getElementById( "checkTel" ).innerHTML = "<span style='color: red;'>半角数字11桁で入力してください！</span>";
    } else {
    document.getElementById( "checkTel" ).innerHTML = '';
    }
}

// メールアドレスの入力エラー
function inputMailCheck() {
    const inputValue = document.getElementById( "searchMailBox" ).value;
    if (!inputValue.match(/.+@.+\..+/)) {
    document.getElementById( "checkMail" ).innerHTML = "<span style='color: red;'>正しいメールアドレスを入力してください！</span>";
    } else {
    document.getElementById( "checkMail" ).innerHTML = '';
    }
}

document.querySelector('button').addEventListener('click', () => {
    // 新しい label 要素を作成
    const newLabel = document.createElement('label');
    newLabel.textContent = '連絡事項：'; // ラベルのテキストを設定

    // 新しい input 要素を作成
    const newInput = document.createElement('input');
    newInput.type = 'text'; // input のタイプをテキストに設定

    // ラベルの中に input を追加
    newLabel.appendChild(newInput);

    // div の中にラベルを追加
    document.querySelector('div').appendChild(newLabel);
});