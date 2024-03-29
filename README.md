# WTR

Work Time Recorder


## Links

- https://mui.com/material-ui/getting-started/overview/
- https://mui.com/x/react-data-grid/
- [tauri_test](https://github.com/marzg510/tauri_test)

## date-fns

```bash
npm install date-fns
```

## tauri

```bash
cargo install tauri-cli
```

## Material UI

- https://mui.com/
- https://mui.com/material-ui/getting-started/overview/
- https://mui.com/material-ui/getting-started/installation/
- https://mui.com/x/react-data-grid/
- https://mui.com/x/react-data-grid/editing/
- https://mui.com/x/react-data-grid/editing/#full-featured-crud-component
- https://ralacode.com/blog/post/react-material-ui/
- https://qiita.com/uniuni__8282/items/359a5ec90742a696a1c1

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/x-data-grid
npm install @mui/icons-material
```

## Material UI(DatePicker)

- DatePickerを日付入力に使うかは要検討⇒Gridの中では使わない

```
npm install @mui/x-date-pickers
npm install @date-io/date-fns
```

## 開発環境構築メモ

```bash
nvm use v18
cargo install tauri-cli
npx create-react-app test_react_data_grid --template typescript
cd test_react_data_grid
npm start
(Ctrl-C)
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/x-data-grid
npm install @mui/icons-material
npm install date-fns
# App.tsx編集
npm start
```

## Debug

```bash
cd tauri-wtr
yarn tauri dev
```

## 過去の検討

- [react-data-grid](https://github.com/adazzle/react-data-grid)
- [react-data-grid demo](https://adazzle.github.io/react-data-grid/)


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
