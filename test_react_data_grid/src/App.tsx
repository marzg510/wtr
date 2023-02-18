import './App.css';

import { useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';

const columns = [
  { key: 'id', name: 'ID', width: 10 },
  { key: 'title', name: 'Title', width: 100, editor: textEditor }
];


function App() {
  const [rows,setRows] = useState([
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
  ]);
  return (
    <DataGrid
      columns={columns}
      rows={rows}
      onRowsChange={setRows}
    />
  );
}

export default App;
