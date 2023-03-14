import './App.css';

import { useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';
import { Column, SelectColumn } from 'react-data-grid';
import dateEditor, { timeEditor } from './DateEditor';
import { datePickerEditor } from './DateEditor';
// import DatePicker from 'react-datepicker';
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import "react-datepicker/dist/react-datepicker.css";

interface Row {
  id: number;
  // workDate: string;
  // workDate: number;
  workDate: Date;
  startTime: Date;
  endTime: string;
  restTime: string;
  testDate: Date;
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
  // { key: 'workDate', name: 'Date', width: 120, editor: dateEditor,
  //   formatter(props) {
  //     const d = props.row.workDate;
  //     return ( <>{d.getFullYear()}/{d.getMonth()+1}/{d.getDate()}</> );
  //   },
  // },
  { key: 'workDate', name: 'Date', width: 120, editor: datePickerEditor,
    formatter(props) {
      const d = props.row.workDate;
      return ( <>{d.getFullYear()}/{d.getMonth()+1}/{d.getDate()}</> );
    },
    // editorOptions: { renderFormatter: false}
  },
  { key: 'startTime', name: 'Start', width: 80, editor: textEditor,
    formatter(props) {
      const t = props.row.startTime;
      return ( <>{t.getHours()}:{('0'+t.getMinutes()).slice(-2)}</> );
    },
  },
  { key: 'endTime', name: 'End', width: 80, editor: timeEditor },
  { key: 'restTime', name: 'Rest', width: 80, editor: timeEditor },
  { key: 'testDate', name: 'testDate', width: 120, editor: dateEditor,
    formatter(props) {
      const d = props.row.testDate;
      return ( <>{d.getFullYear()}/{d.getMonth()+1}/{d.getDate()}</> );
    },
  },
  // { key: 'workTime', name: 'Working', width: 80 },
  // { key: 'work', name: 'Work', width: 300, editor: textEditor },
  // { key: 'projectCd', name: 'ProjectCD', width: 10, editor: textEditor },
  // { key: 'projectName', name: 'ProjectName', width: 300, editor: textEditor },
  // { key: 'phase', name: 'phase', width: 300, editor: textEditor },
  // { key: 'task', name: 'task', width: 300, editor: textEditor },
];

function App() {
  const [rows,setRows] = useState([
    // { id: 0, workDate: '2022-01-01', startTime: '09:00', endTime: '10:00', restTime:'0:00' },
    // { id: 1, workDate: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
    { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: '10:00', restTime:'0:00', testDate: new Date('2023-05-01') },
    // { id: 1, date: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
  ]);
  const [dateValue, setDateValue] = useState("");
  const [dateDispValue, setDateDispValue] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  registerLocale("ja",ja);
  return (
    <div>
      <div>
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={setRows}
          rowHeight={20}
        />
      </div>
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
        <input type="text" value={dateDispValue} readOnly />
        <button onClick={()=>{ setDateValue("2022-02-01"); }}>setValue20220101</button>
      </div>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy/MM/dd"
          locale="ja"
        />
        <input type="text" value={startDate?.getTime()} readOnly />
      </div>
      <div>
        <datePickerEditor />
      </div>
    </div>
  );
}

export default App;
