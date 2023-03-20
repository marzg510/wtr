import './App.css';

import React, { useLayoutEffect, useReducer, useRef, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, { textEditor } from 'react-data-grid';
import { Column, SelectColumn,RowsChangeData } from 'react-data-grid';
import dateEditor, { timeEditor, intervalEditor } from './DateEditor';
import { TimeFormatter, IntervalFormatter } from './DateEditor';
import { formatDate } from './DateEditor';
import { Row } from'./types'
import { createPortal } from 'react-dom';

const columns: readonly Column<Row>[] = [
  {
    ...SelectColumn,
    headerCellClass: "mycell",
    cellClass: "mycell"
  },
  { key: 'id', name: 'ID', width: 10, cellClass: "mycell" },
  { key: 'workDate', name: 'Date', width: 120, editor: dateEditor,
    formatter(props) { return (<>{formatDate(props.row.workDate,'/')}</>); },
  },
  { key: 'startTime', name: 'Start', width: 60, editor: timeEditor,
    formatter(props) { return (<TimeFormatter time={props.row.startTime} />); },
  },
  { key: 'endTime', name: 'End', width: 80, editor: timeEditor,
    formatter(props) { return (<TimeFormatter time={props.row.endTime} />); },
  },
  { key: 'restTime', name: 'Rest', width: 80, editor: intervalEditor,
    formatter : IntervalFormatter
  },
  { key: 'workTime', name: 'Working', width: 80,
    // formatter(props) { return (<TimeFormatter time={props.row.workTime} />); },
  },
  { key: 'work', name: 'Work', width: 300, editor: textEditor },
  { key: 'projectAlias', name: 'ProjectAlias', width: 300, editor: textEditor },
  { key: 'projectCd', name: 'ProjectCD', width: 10 },
  { key: 'task', name: 'task', width: 300, editor: textEditor },
];

function App() {
  const [rows,setRows] = useState<Row[]>([
    { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:0, workTime:null,
      work: '' , projectAlias: '', projectCd: '', task: '' },
    // { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:new Date('1970-01-01 00:00'), workTime:new Date('1970-01-01 00:00'), },
    // { id: 0, workDate: '2022-01-01', startTime: '09:00', endTime: '10:00', restTime:'0:00' },
    // { id: 1, workDate: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
    // { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), },
    // { id: 1, date: '2022-02-01', startTime: '10:00', endTime: '11:00', restTime:'0:00' },
  ]);
  const [contextMenuProps, setContextMenuProps] = useState<{
    rowIdx: number;
    top: number;
    left: number
  } | null>(null);
  const [nextId, setNextId] = useReducer((id: number) => id + 1, rows[rows.length - 1].id + 1);
  const onChangeRows = (rows: Row[], data: RowsChangeData<Row>) => {
    data.indexes.forEach(i => {
      setRows(()=>{
        return rows.map((oldRow, oldIdx)=>{
          if ( oldIdx === i) {
            console.log("changed index", i)
            console.log( "times", oldRow.endTime.getTime() , oldRow.startTime.getTime() , oldRow.restTime);
            const start = Math.floor(oldRow.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
            const end   = Math.floor(oldRow.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
            console.log( "floor start,end", start, end);
            const time = (end - start) - oldRow.restTime;
            console.log( "time", time);
            return { ...oldRow, workTime: time }
          }
          return oldRow;
        });
      });
    })
  }
  function calculateWorkTime(row:Row) {
    const start = Math.floor(row.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const end   = Math.floor(row.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    console.log( "floor start,end", start, end);
    const time = (end - start) - row.restTime;
    return time;
  }
  function insertRow(insertRowIdx: number) {
    const beforeRow = rows[insertRowIdx];
    const newRow: Row = {
      id: nextId,
      workDate: new Date(beforeRow.workDate),
      startTime: new Date(beforeRow.startTime),
      endTime:new Date(beforeRow.endTime),
      restTime: 0,
      workTime: calculateWorkTime(beforeRow),
      work: beforeRow.work,
      projectAlias: beforeRow.projectAlias,
      projectCd: beforeRow.projectCd,
      task: beforeRow.task
    };
    setRows([...rows.slice(0, insertRowIdx), newRow, ...rows.slice(insertRowIdx)]);
    setNextId();
  }
  const isContextMenuOpen = contextMenuProps !== null;
  const menuRef = useRef<HTMLMenuElement | null>(null);
  useLayoutEffect(() => {
    if (!isContextMenuOpen) return;

    function onClick(event: MouseEvent) {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
        return;
      }
      setContextMenuProps(null);
    }
    addEventListener('click', onClick);
    return () => {
      removeEventListener('click', onClick);
    };
  }, [isContextMenuOpen]);

  const [dateValue, setDateValue] = useState("");
  const [dateDispValue, setDateDispValue] = useState("");
  const [items, updateItems] = useState([
    { name: "item 1", done: false },
    { name: "item 2", done: true },
    { name: "item 3", done: false }
  ]);
  const [numValue, setNumValue] = useState<number>(0.0);
  return (
    <div>
      <div>
        <DataGrid
          columns={columns}
          rows={rows}
          rowHeight={20}
          // onRowsChange={setRows}
          onRowsChange={onChangeRows}
          onCellContextMenu={({ row }, event) => {
            event.preventDefault();
            setContextMenuProps({
              rowIdx: rows.indexOf(row),
              top: event.clientY,
              left: event.clientX
            });
          }}
        />
        {isContextMenuOpen &&
          createPortal(
            <menu
              ref={menuRef}
              className={"ContextMenu"}
              style={
                {
                  top: contextMenuProps.top,
                  left: contextMenuProps.left
                } as unknown as React.CSSProperties
              }
            >
              <li>
                <button type="button" onClick={()=>{
                    const { rowIdx } = contextMenuProps;
                    insertRow(rowIdx);
                    setContextMenuProps(null);
                }}>
                上に行追加
                </button>
              </li>
              <li> test1 </li>
              <li> test2 </li>
              <li>
                <a onClick={()=>{alert("hello");}}>
                  test3
                </a>
              </li>
              <li>
                <button type="button" onClick={()=>{alert("new")}}>新規作成</button>
              </li>
            </menu>,
            document.body
          )}
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
        <a onClick={()=>{alert("OK!")}}>OK</a>
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
      <div>
        <input type="number" step="0.1"
          max="9.9" min="0.0"
          value={numValue}
          onChange={(event) => {
            console.log(event.target.value);
            setNumValue(parseFloat(event.target.value));
          }}
          autoFocus
        />
      </div>
    </div>
  );
}

export default App;
