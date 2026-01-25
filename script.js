// 新規登録
async function handleSignUp(){

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

// 画像取得

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