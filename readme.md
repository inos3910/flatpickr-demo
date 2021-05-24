# flatpickrデモ

- デフォルト
- 日本語表示
- 期間制限（明日〜3ヶ月後）
- 祝日を反映（背景を赤にする）
- 特定の期間を選択不可にする（翌日、5日後~10日後、水曜日）
- カレンダー + 時間
- 時間のみ
- カレンダー + 時間<br>
特定の日付の場合に時間の範囲を変更（明日、2日後、3日後）

## 環境
- gulp 4.0.2
  - sassコンパイル
  - image 圧縮
  - svg 最適化
- webpack 5.9
  - js バンドル 圧縮 最適化
- babel 7.x
  - js es6最適化
- browserSync
  - ライブリロード

## メモ
- タスクランナーはテーマに設置してあるのでテーマディレクトリで起動する
- `sudo yarn` or `npm install`で環境作成
- node_modulesがpermission errorの場合は `sudo chmod 777 [node_modulesのパス]`で権限を変更すればOK

### npm scripts
- `npm run dev` or `yarn dev` 開発モードでビルド
- `npm run build` or `yarn build` 本番モードでビルド
- `npm run imagemin` or `yarn imagemin` 画像圧縮
- `npm run sprite` or `yarn sprite` スプライト画像の生成
- `npm run spritemin` or `yarn spritemin`スプライト画像の圧縮

### gulp タスク
- `npx gulp` or `yarn gulp` gulp起動
- `npx gulp imagemin` or `yarn gulp imagemin` 画像圧縮
- `npx gulp sprite` or `yarn gulp  sprite` スプライト画像の生成
- `npx gulp spritemin` or `yarngulp  spritemin` スプライト画像の圧縮
