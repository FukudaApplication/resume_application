// 新規登録
async function handleSignUp() {

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // null チェック
  if (!emailInput || !passwordInput) {
    console.error('入力要素が見つかりません');
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  // 入力値の検証
  if (!email || !password) {
    console.error('メールアドレスとパスワードを入力してください');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error('エラー:', error.message);
    return;
  }

  console.log('サインアップ成功:', data);
}

// ログイン処理
document.getElementById("loginForm").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Supabaseでログイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // エラーが発生した場合
      errorMessage.textContent = error.message;
      errorMessage.classList.add("show");
    } else {
      // ログイン成功
      window.location.href = "index.html";
    }
  } catch (err) {
    errorMessage.textContent = "ログインに失敗しました。";
    errorMessage.classList.add("show");
  }
});

// 履歴書の入力画面
// 半角カタカナを全角カタカナに変換する関数
function hankana2Zenkana(str) {
  // 半角カタカナと全角カタカナの対応マップ
  let kanaMap = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
  };

  // 正規表現で濁点付き文字、または単一の半角文字をマッチさせる
  var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');

  // 置換処理
  return str.replace(reg, function (match) {
    return kanaMap[match];
  });
}
// カタカナからひらがなにする
function katakanaToHiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  }).replace(/ー/g, 'ー');
}
// 郵便番号から住所を検索する
async function searchAddress() {
  const zipcode = document.getElementById("searchAddressBox").value;
  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      const result = data.results[0];
      // 漢字
      document.getElementById('addressForm').value = result.address1 + result.address2 + result.address3;

      // ふりがな（ひらがな）
      const address = result.kana1 + result.kana2 + result.kana3;
      document.getElementById('address_hiragana').value = katakanaToHiragana(hankana2Zenkana(address));
    }
  } catch (error) {
    console.error('住所取得エラー:', error);
  }
}

async function searchAddress_kinkyu() {
  const zipcode = document.getElementById("searchAddressBox_kinkyu").value;
  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      const result = data.results[0];
      // 漢字
      document.getElementById('addressForm_kinkyu').value = result.address1 + result.address2 + result.address3;

      // ふりがな（ひらがな）
      const address = result.kana1 + result.kana2 + result.kana3;
      document.getElementById('address_hiragana_kinkyu').value = katakanaToHiragana(hankana2Zenkana(address));
    }
  } catch (error) {
    console.error('住所取得エラー:', error);
  }
}


// 住所の入力エラー
function inputAddressCheck() {
  const inputValue1 = document.getElementById("searchAddressBox").value;
  const inputValue2 = document.getElementById("searchAddressBox_kinkyu").value;
  if (inputValue1.length > 0) {
    if (!(inputValue1.match(/^[0-9]+$/)) || !(inputValue1.length === 7)) {
      document.getElementById("checkAddress").innerHTML = "<span style='color: red;'>半角数字7桁で入力してください！</span>";
    } else {
      document.getElementById("checkAddress").innerHTML = '';
    }
  }
  if (inputValue2.length > 0) {
    if (!(inputValue2.match(/^[0-9]+$/)) || !(inputValue2.length === 7)) {
      document.getElementById("checkAddress_kinkyu").innerHTML = "<span style='color: red;'>半角数字7桁で入力してください！</span>";
    } else {
      document.getElementById("checkAddress_kinkyu").innerHTML = '';
    }
  }
}

// 電話番号の入力エラー
function inputTelCheck() {
  const inputValue1 = document.getElementById("searchTelBox").value;
  const inputValue2 = document.getElementById("searchTelBox_kinkyu").value;
  if (inputValue1.length > 0) {
    if (!(inputValue1.match(/^[0-9]+$/)) || !(inputValue1.length === 11)) {
      document.getElementById("checkTel").innerHTML = "<span style='color: red;'>半角数字11桁で入力してください！</span>";
    } else {
      document.getElementById("checkTel").innerHTML = '';
    }
  }
  if (inputValue2.length > 0) {
    if (!(inputValue2.match(/^[0-9]+$/)) || !(inputValue2.length === 11)) {
      document.getElementById("checkTel_kinkyu").innerHTML = "<span style='color: red;'>半角数字11桁で入力してください！</span>";
    } else {
      document.getElementById("checkTel_kinkyu").innerHTML = '';
    }
  }
}

// メールアドレスの入力エラー
function inputMailCheck() {
  const inputValue1 = document.getElementById("searchMailBox").value;
  const inputValue2 = document.getElementById("searchMailBox_kinkyu").value;
  if (inputValue1.length > 0) {
    if (!inputValue1.match(/.+@.+\..+/)) {
      document.getElementById("checkMail").innerHTML = "<span style='color: red;'>正しいメールアドレスを入力してください！</span>";
    } else {
      document.getElementById("checkMail").innerHTML = '';
    }
  }
  if (inputValue2.length > 0) {
    if (!inputValue2.match(/.+@.+\..+/)) {
      document.getElementById("checkMail_kinkyu").innerHTML = "<span style='color: red;'>正しいメールアドレスを入力してください！</span>";
    } else {
      document.getElementById("checkMail_kinkyu").innerHTML = '';
    }
  }
}

//欄の追加
// 学歴アイテムを追加する関数
function addEducationItem() {
  const educationList = document.getElementById("educationList");
  const newItem = document.createElement("div");
  newItem.className = "education-item";
  newItem.innerHTML = `
        <!-- 学校名入力欄 -->
            <label for="school_name">学校名</label>
            <input type="text" id="school_name" name="school_name" class="textbox" placeholder="例:〇〇学校"></br> 
            <!-- 学部学科名入力欄 -->
            <label for="major_name">学部学科名</label>
            <input type="text" id="major_name" name="major_name" class="textbox" placeholder="例:〇〇学部　〇〇学科"></br> 
            <!-- 入学年月選択欄 -->
            <label for="school_enroll">入学年月</label>
            <input type="date"/></br> 
            <!-- 卒業年月選択欄 -->
            <label for="school_enroll">卒業年月</label>
            <input type="date"/></br> 
            <label for="educationNote">備考</label>
            <input
            type="text"
            class="textbox"
            name="educationNote[]"
            placeholder="例：中退など"
            /></br>
        <button type="button" class="btn-remove" onclick="removeEducationItem(this)">削除</button></br>
    `;
  educationList.appendChild(newItem);
}

// 学歴アイテムを削除する関数
function removeEducationItem(button) {
  const educationList = document.getElementById("educationList");
  if (educationList.children.length > 1) {
    button.closest(".education-item").remove();
  } else {
    alert("最低1つの学歴項目が必要です。");
  }
}

// 職歴アイテムを追加する関数
function addWorkItem() {
  const workList = document.getElementById("workList");
  const newItem = document.createElement("div");
  newItem.className = "work-item";
  newItem.innerHTML = `
        <!-- 会社名入力欄 -->
            <label for="company_name">会社名</label>
            <input type="text" id="company_name" name="company_name" class="textbox" placeholder="例:〇〇株式会社"></br> 
            <!-- 部署名入力欄 -->
            <label for="branch_name">部署名</label>
            <input type="text" id="branch_name" name="branch_name" class="textbox" placeholder="例:〇〇部"></br> 
            <!-- 入社年月選択欄 -->
            <label for="company_enroll">入社年月</label>
            <input type="date"/></br> 
            <!-- 退社年月選択欄 -->
            <label for="company_enroll">退社年月</label>
            <input type="date"/></br>
            <label for="workNote">備考</label>
            <input
            type="text"
            class="textbox"
            name="workNote[]"
            placeholder="例：転籍など"
            /></br>
        <button type="button" class="btn-remove" onclick="removeWorkItem(this)">削除</button></br>
    `;
  workList.appendChild(newItem);
}

// 職歴アイテムを削除する関数
function removeWorkItem(button) {
  const workList = document.getElementById("workList");
  if (workList.children.length > 1) {
    button.closest(".work-item").remove();
  } else {
    alert("最低1つの職歴項目が必要です。");
  }
}

// 資格アイテムを追加する関数
function addCertificationItem() {
  const workList = document.getElementById("CertificationList");
  const newItem = document.createElement("div");
  newItem.className = "certification-item";
  newItem.innerHTML = `
        <!-- 資格などの名前入力欄 -->
            <label for="Certification_name">資格・免許名</label>
            <input type="text" id="Certification_name" name="Certification_name" class="textbox" placeholder="例:〇〇検定"></br> 
            <!-- 取得／合格年月選択欄 -->
            <label for="Certification_enroll">取得年月</label>
            <input type="date"/></br> 
            <label for="CertificationNote">備考</label>
            <input
            type="text"
            class="textbox"
            name="certificationNote[]"
            placeholder="例：合格、取得など"
            /></br>
        <button type="button" class="btn-remove" onclick="removeCertificationItem(this)">削除</button></br>
    `;
  workList.appendChild(newItem);
}

// 資格アイテムを削除する関数
function removeCertificationItem(button) {
  const certificationList = document.getElementById("CertificationList");
  if (certificationList.children.length > 1) {
    button.closest(".certification-item").remove();
  } else {
    alert("最低1つの職歴項目が必要です。");
  }
}