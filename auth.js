// Supabase認証用のJavaScriptファイル
// このファイルでは、Supabaseの認証機能を初期化し、便利な関数を提供します

// Supabaseクライアントの初期化
// config.jsで設定した値を使ってSupabaseに接続します
// ⚠️ 注意: このファイルは Supabase CDN と config.js の後に読み込む必要があります
const { createClient } = supabase;
const supabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// 現在のユーザー情報を取得する関数
async function getCurrentUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  return user;
}

// ログイン状態をチェックする関数
async function checkAuth() {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  return session !== null;
}

// ログアウトする関数
async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("ログアウトエラー:", error);
    return false;
  }
  return true;
}

// 認証状態の変化を監視する関数
// ログイン/ログアウトが発生した時に自動的に実行される処理を設定できます
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("認証状態が変化しました:", event, session);

  if (event === "SIGNED_IN") {
    console.log("ログインしました");
  } else if (event === "SIGNED_OUT") {
    console.log("ログアウトしました");
    // ログアウト時はログインページにリダイレクト
    if (window.location.pathname !== "/login.html") {
      window.location.href = "login.html";
    }
  }
});