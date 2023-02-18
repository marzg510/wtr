import './App.css';

import { useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';
import dateEditor, { timeEditor } from './DateEditor';

const columns = [
  { key: 'id', name: 'ID', width: 10 },
  { key: 'title', name: 'Title', width: 150, editor: textEditor },
  { key: 'entryDate', name: 'EntryDate', width: 120, editor: dateEditor },
  { key: 'startTime', name: 'StartDate', width: 120, editor: timeEditor },
];

function App() {
  const [rows,setRows] = useState([
    { id: 0, title: 'Example', entryDate: '2022-01-01', startTime: '09:00' },
    { id: 1, title: 'Demo' , entryDate: '2022-02-01', startTime: '10:00'},
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
