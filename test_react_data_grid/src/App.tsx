import './App.css';

import { useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';
import { Column, SelectColumn } from 'react-data-grid';
import dateEditor, { timeEditor } from './DateEditor';

interface Row {
  id: number;
  workDate: Date;
  startTime: Date;
  endTime: Date;
  restTime: Date;
  workTime: Date;
  work: string;
  projectAlias: string;
  projectCd: string;
  task: string;
}
const dateFormatter = new Intl.DateTimeFormat(navigator.language);
function TimestampFormatter({ timestamp }: { timestamp: number }) {
  return <>{dateFormatter.format(timestamp)}</>;
}
function DateFormatter({ date }: { date: Date }) {
  return ( <>{date.getFullYear()}/{('0'+(date.getMonth()+1)).slice(-2)}/{('0'+date.getDate()).slice(-2)}</> );
}
function TimeFormatter({ time }: { time: Date }) {
  return ( <>{('0'+time.getHours()).slice(-2)}:{('0'+time.getMinutes()).slice(-2)}</> );
}

const columns: readonly Column<Row>[] = [
  {
    ...SelectColumn,
    headerCellClass: "mycell",
    cellClass: "mycell"
  },
  { key: 'id', name: 'ID', width: 10, cellClass: "mycell" },
  { key: 'workDate', name: 'Date', width: 120, editor: dateEditor,
    formatter(props) {
      // const date = props.row.workDate;
      // return ( <>{date.getFullYear()}/{date.getMonth()+1}/{date.getDate()}</> );
      return (<DateFormatter date={props.row.workDate} />);
    },
  },
  { key: 'startTime', name: 'Start', width: 60, editor: timeEditor,
    formatter(props) {
      // const t = props.row.startTime;
      // return ( <>{t.getHours()}:{('0'+t.getMinutes()).slice(-2)}</> );
      return (<TimeFormatter time={props.row.startTime} />);
    },
  },
  { key: 'endTime', name: 'End', width: 80, editor: timeEditor,
    formatter(props) {
      // const t = props.row.endTime;
      // return ( <>{t.getHours()}:{('0'+t.getMinutes()).slice(-2)}</> );
      return (<TimeFormatter time={props.row.endTime} />);
    },
  },
  { key: 'restTime', name: 'Rest', width: 80, editor: timeEditor,
    formatter(props) { return (<TimeFormatter time={props.row.restTime} />); },
  },
  { key: 'workTime', name: 'Working', width: 80,
    formatter(props) {
      const wt = props.row.endTime.getTime()
               - props.row.startTime.getTime()
               - props.row.restTime.getTime();
      return (<TimeFormatter time={props.row.restTime} />);
    },
  },
  { key: 'work', name: 'Work', width: 300, editor: textEditor },
  { key: 'projectAlias', name: 'ProjectAlias', width: 300, editor: textEditor },
  { key: 'projectCd', name: 'ProjectCD', width: 10, editor: textEditor },
  { key: 'task', name: 'task', width: 300, editor: textEditor },
];

function App() {
  const [rows,setRows] = useState([
    { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:new Date('1970-01-01 00:00'), workTime:new Date('1970-01-01 00:00'),
      work: '' , projectAlias: '', projectCd: '', task: '' },
    // { id: 0, workDate: '2022-01-01', startTime: '09:00', endTime: '10:00', restTime:'0:00' },
    // { id: 1, workDate: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
    // { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), },
    // { id: 1, date: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
  ]);
  const [dateValue, setDateValue] = useState("");
  const [dateDispValue, setDateDispValue] = useState("");
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
    </div>
  );
}

export default App;
