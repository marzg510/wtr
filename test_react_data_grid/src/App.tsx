import './App.css';

import { useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';
import { Column, SelectColumn } from 'react-data-grid';
import dateEditor, { timeEditor } from './DateEditor';
// TODO: Try DatePicker
// https://reactdatepicker.com/

interface Row {
  id: number;
  // workDate: string;
  workDate: number;
  startTime: string;
  endTime: string;
  restTime: string;
  // workTime: Date;
  // work: string;
}
const dateFormatter = new Intl.DateTimeFormat(navigator.language);
function TimestampFormatter({ timestamp }: { timestamp: number }) {
  return <>{dateFormatter.format(timestamp)}</>;
}

const columns: readonly Column<Row>[] = [
// const columns = [
  {
    ...SelectColumn,
    headerCellClass: "mycell",
    cellClass: "mycell"
  },
  { key: 'id', name: 'ID', width: 10, cellClass: "mycell" },
  { key: 'workDate', name: 'Date', width: 120, editor: dateEditor,
    formatter(props) {
      return <TimestampFormatter timestamp={props.row.workDate} />;
    }
  },
  // { key: 'date', name: 'Date', width: 120, editor: dateEditor },
  { key: 'startTime', name: 'Start', width: 80, editor: timeEditor },
  { key: 'endTime', name: 'End', width: 80, editor: timeEditor },
  { key: 'restTime', name: 'Rest', width: 80, editor: timeEditor },
  { key: 'workTime', name: 'Working', width: 80 },
  { key: 'work', name: 'Work', width: 300, editor: textEditor },
  { key: 'projectCd', name: 'ProjectCD', width: 10, editor: textEditor },
  { key: 'projectName', name: 'ProjectName', width: 300, editor: textEditor },
  { key: 'phase', name: 'phase', width: 300, editor: textEditor },
  { key: 'task', name: 'task', width: 300, editor: textEditor },
];

function App() {
  const [rows,setRows] = useState([
    // { id: 0, workDate: '2022-01-01', startTime: '09:00', endTime: '10:00', restTime:'0:00' },
    // { id: 1, workDate: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
    { id: 0, workDate: new Date(Date.parse('2022-01-01')).getTime(), startTime: '09:00', endTime: '10:00', restTime:'0:00' },
    // { id: 1, date: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
  ]);
  const [dateValue, setDateValue] = useState("");
  const [dateDispValue, setDateDispValue] = useState("");
  return (
    <div>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
      />
      <div>
        <input type="date"
          // className={textEditorClassname}
          // value={Intl.DateTimeFormat("ja-JP").format(row[column.key])}
          // id="m510-date"
          value={dateValue}
          onChange={(event) => {
            setDateValue(event.target.value);
            setDateDispValue(event.target.value);
            console.log(event.target.value);
          }}
          // onBlur={() => onClose(true)}
          autoFocus
        />
        <button onClick={()=>{ alert(`value! ${dateValue}`); }}>alert</button>
        <input type="text" value={dateDispValue}/>
        <button onClick={()=>{ setDateValue("2022-02-01"); }}>setValue20220101</button>
      </div>
    </div>
  );
}

export default App;
