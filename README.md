# 本環境について
typescriptでの実装方法について

- GAS（Google Apps Script）へのpushはclaspを使用します。
- claspがpushする際にGASで動作するコードにコンバートしてくれます。
- claspではtypescriptのimportに対応されないため、esbuildでbundleします。
- bundleする際IIFE形式で出力させ、指定したグローバル変数に登録します。
- このままではGASがエントリポイントとして認識しないので、main.tsでexportされている関数をGASが認識するように変換します。(自作)
- bundle＆buildしたファイルをdistフォルダに格納し、distフォルダの中身をpushします。

# 使い方

コードを修正して`npm run push`するだけでGASにpushされます。

以下のスプレッドシートのGASにpushされます。

https://docs.google.com/spreadsheets/d/1y91MNM8A2SkBox2mFKLM2N0JoVsX1OTw2y7Xz-Jk41k/edit#gid=0

# 以下、typescriptの環境の作り方

### 初期化
```
npm init -y
```

### ライブラリインストール
```
npm i @google/clasp @types/google-apps-script typescript esbuild ts-node
```
- @google/clasp: GASのCLIツール
- @types/google-apps-script: GASの型定義
- typescript: typescript
- esbuild: bundleに使用後
- ts-node: エントリポイント生成で使用


### Googleへログイン
```
clasp login
```

ブラウザでログインページが表示されるのでログインする

"Logged in! You may close this page. "と表示されればOK


### GASプロジェクトの作成
```
clasp create
```

既存のGASプロジェクトをCloneする場合は以下。
```
clasp clone <スクリプトID>
```

<スクリプトID>はブラウザでGASを開いた時のURLの以下の部分
https://script.google.com/home/projects/<スクリプトID>/edit

### tsconfig.jsonの作成

```
npx tsc --init
```

### src/main.tsの作成
```
mkdir src
touch src/main.ts
```
※bundleするので、エントリポイントの関数はexportする必要がある。

### distディレクトリの作成
distファイルへビルド生成物を出力するため、GASへpushするのに必要なappsscript.jsonをdistフォルダへ移動します。

```
mkdir dist
mv appsscript.json dist/$1
```

### .clasp.jsonの更新
```
{
    "scriptId":<スクリプトID>,
    "rootDir":"dist",
}
```
cloneした場合はセットされています。

※.clasp.jsonとtsconfig.jsonは同じディレクトリに配置しないといけない

### bundle
importに対応するためbundleします。

生成物はdistフォルダに出力します。

```
npx esbuild src/main.ts --bundle --outdir=dist --format=iife --global-name=_entry
```

### build
```
npx ts-node -T build.ts
```
- build.tsは自作ファイルです。
- bundleするとesbuildで指定した名称のオブジェクトにkey：関数名、value：IIFEの戻り値が格納されます。
- オブジェクトになってしまい、関数がなくなってしまうため、'./src/main.ts'でexportされている関数をビルド後のjsファイルへ関数定義します。
- build.tsはtypescriptのASTを解析してsrc/main.ts関数一覧を取得し、jsファイルへ関数定義します。


### push
```
clasp push
```

### コマンド統合
```
    "bundle": "esbuild src/main.ts --bundle --outdir=dist --format=iife --global-name=_entry",
    "build": "npm run bundle && ts-node -T build.ts",
    "push": "npm run build && clasp push"
```


