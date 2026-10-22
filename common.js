/* ===== 全ページ共通：PDF出力（印刷）ボタン ===== */
(function () {
  var origTitle = document.title;
  var opened = [];

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function stamp() {
    var d = new Date();
    return {
      long: d.toLocaleString("ja-JP", {
        year: "numeric", month: "long", day: "numeric", weekday: "short",
        hour: "2-digit", minute: "2-digit"
      }),
      ymd: d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
    };
  }

  // 紙には「例文テンプレート」など折りたたみも全部ひらいて出す
  function openAll() {
    document.querySelectorAll("details").forEach(function (d) {
      if (!d.open) { d.open = true; opened.push(d); }
    });
    // 遅延読み込みの画像も先に読み込む
    document.querySelectorAll('img[loading="lazy"]').forEach(function (i) {
      i.loading = "eager";
    });
  }

  function restore() {
    opened.forEach(function (d) { d.open = false; });
    opened = [];
    document.title = origTitle;
  }

  function updateMeta() {
    var s = stamp();
    var meta = document.querySelector(".print-meta");
    if (meta) {
      var url = location.href.split("#")[0];
      meta.innerHTML =
        "<div><b>出力日時：" + s.long + "</b>　（この紙は出力した時点の内容です）</div>" +
        "<div>最新版はこちら：" + url + "</div>";
    }
    // 保存されるPDFのファイル名に日付を入れる（版の見分け用）
    document.title = origTitle + "_" + s.ymd;
  }

  function doPrint() {
    openAll();
    updateMeta();
    setTimeout(function () { window.print(); }, 80);
  }

  window.addEventListener("beforeprint", function () { openAll(); updateMeta(); });
  window.addEventListener("afterprint", restore);

  function init() {
    var sheet = document.querySelector(".sheet");
    var body = document.querySelector(".sheet .body");
    if (!sheet || !body) return;

    // 印刷専用の見出し（画面では非表示）
    if (!document.querySelector(".print-meta")) {
      var meta = document.createElement("div");
      meta.className = "print-meta";
      sheet.insertBefore(meta, sheet.firstChild);
    }

    // ページ上部のPDF出力ボタン
    if (!document.querySelector(".tools")) {
      var tools = document.createElement("div");
      tools.className = "tools";
      tools.innerHTML =
        '<span class="tools-hint">開いた画面で「PDFに保存」を選ぶと、いまの最新の内容でPDFになります</span>' +
        '<button type="button" class="pdf-btn">📄 PDF出力（印刷）</button>';
      body.insertBefore(tools, body.firstChild);
      tools.querySelector("button").addEventListener("click", doPrint);
    }
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
