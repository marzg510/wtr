import './App.css';

import { useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';
import { Column, SelectColumn,RowsChangeData } from 'react-data-grid';
import dateEditor, { timeEditor } from './DateEditor';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

interface Row {
  id: number;
  workDate: Date;
  startTime: Date;
  endTime: Date;
  restTime: Date;
  workTime: Date;
  // work: string;
  // projectAlias: string;
  // projectCd: string;
  // task: string;
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
    formatter(props) { return (<TimeFormatter time={props.row.workTime} />); },
    // formatter(props) {
    //   const wt = props.row.endTime.getTime()
    //            - props.row.startTime.getTime()
    //            - props.row.restTime.getTime();
    //   return (<TimeFormatter time={props.row.restTime} />);
    // },
  },
  // { key: 'work', name: 'Work', width: 300, editor: textEditor },
  // { key: 'projectAlias', name: 'ProjectAlias', width: 300, editor: textEditor },
  // { key: 'projectCd', name: 'ProjectCD', width: 10, editor: textEditor },
  // { key: 'task', name: 'task', width: 300, editor: textEditor },
];

function App() {
  const [rows,setRows] = useState<Row[]>([
    // { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:new Date('1970-01-01 00:00'), workTime:new Date('1970-01-01 00:00'),
      // work: '' , projectAlias: '', projectCd: '', task: '' },
    { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:new Date('1970-01-01 00:00'), workTime:new Date('1970-01-01 00:00'), },
    // { id: 0, workDate: '2022-01-01', startTime: '09:00', endTime: '10:00', restTime:'0:00' },
    // { id: 1, workDate: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
    // { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), },
    // { id: 1, date: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
  ]);
  const onChangeRows3 = (rows: Row[], data: RowsChangeData<Row>) => {
    data.indexes.forEach(i => {
      setRows(()=>{
        return rows.map((oldRow, oldIdx)=>{
          if ( oldIdx === i) {
            console.log("changed index", i)
            console.log( "times", oldRow.endTime.getTime() , oldRow.startTime.getTime() , oldRow.restTime.getTime());
            const time = oldRow.endTime.getTime() - oldRow.startTime.getTime() - oldRow.restTime.getTime();
            console.log( "time", time);
            return { ...oldRow, workTime: new Date(time) }
            // return { ...oldRow, workTime: new Date(oldRow.endTime.getTime() - oldRow.startTime.getTime() - oldRow.restTime.getTime()) }
          }
          return oldRow;
        });
      });
    })
  }
  const onChangeRows2 = (rows: Row[], data: RowsChangeData<Row>) => {
    console.log("onChangeRows:data",data);
    // setRows((oldRows) => {
    //   return oldRows.map((oldRow, oldIdx)=> {
    //     data.indexes.map((i)=> {
    //       if ( oldIdx === i ) {
    //         return { ...oldRow, workTime: new Date(oldRow.endTime.getTime() - oldRow.startTime.getTime() - oldRow.restTime.getTime()) }
    //       }
    //     })
    //   });
    // });
    // if ( data.column.key === "startTime" ) {
    // }
  }
  const onChangeRows = (rows: Row[], data: RowsChangeData<Row>) => {
    console.log("onChangeRows:data",data);
    if ( data.column.key === "startTime" ||
         data.column.key === "endTime" ||
         data.column.key === "restime" ) {
      console.log("onChangeRows:worktime update");
      data.indexes.forEach((v)=>{
        const r = rows[v];
        r.workTime = new Date(r.endTime.getTime() - r.startTime.getTime() - r.restTime.getTime());
        // r.work = "working!"+r.workTime.getTime();
        console.log("onChangeRows:worktime updated", rows[v]);
      })
    }
    setRows({...rows});
  }
  const [dateValue, setDateValue] = useState("");
  const [dateDispValue, setDateDispValue] = useState("");
  const [items, updateItems] = useState([
    { name: "item 1", done: false },
    { name: "item 2", done: true },
    { name: "item 3", done: false }
  ]);
  return (
    <div>
      <div>
        <DataGrid
          columns={columns}
          rows={rows}
          // onRowsChange={setRows}
          // onRowsChange={onChangeRows}
          // onRowsChange={onChangeRows2}
          onRowsChange={onChangeRows3}
          // onRowsChange={(rows: Row[], data: RowsChangeData<Row>)=>{
          //   data.indexes.forEach(i => {
          //     setRows((oldRows)=>{
          //       return oldRows.map((oldRow, oldIdx)=>{
          //         // return oldRow;
          //         // return oldRows;
          //         if ( oldIdx === i) {
          //           console.log("changed index", i)
          //           return { ...oldRow, workTime: new Date(Date.now())};
          //         }
          //         return oldRow;
          //       });
          //     });
          //   })
          // }
          // }
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
        {/* see https://qiita.com/daitai-daidai/items/5752b308e5e0f9457352 */}
        <h2>Todo list</h2>
        <ul>
          {items.map((item, idx) => {
            return (
              <li key={idx}>
                <span>{`${item.name} ${item.done} `}</span>
                <button
                  onClick={() => {
                    updateItems((oldItems) => {
                      return oldItems.map((oldItem, oldIdx) => {
                        if (oldIdx === idx) {
                          return { ...oldItem, done: !oldItem.done };
                        }
                        return oldItem;
                      });
                    });
                  }}
                  // NG
                  // onClick={() => {
                  //   updateItems((oldItems) => {
                  //     // 新しいオブジェクトを作成
                  //     oldItems[idx] = {
                  //       ...oldItems[idx],
                  //       done: !oldItems[idx].done
                  //     };
                  //     return oldItems;
                  //   });
                  // }}
                  // NG
                  // onClick={() => {
                  //   updateItems((oldItems) => {
                  //     oldItems[idx].done = !oldItems[idx].done;
                  //     return oldItems;
                  //   });
                  // }}
                  >
                  change
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
