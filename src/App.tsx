import './App.css';

import React, { useLayoutEffect, useReducer, useRef, useState } from 'react';
import 'react-data-grid/lib/styles.css';
// import DataGrid, { textEditor } from 'react-data-grid';
import { Column, SelectColumn,RowsChangeData } from 'react-data-grid';
import dateEditor, { timeEditor, intervalEditor } from './DateEditor';
import { TimeFormatter, IntervalFormatter } from './DateEditor';
import { formatDate } from './DateEditor';
import { Row } from'./types'
import { createPortal } from 'react-dom';
import { Box, Button, Drawer, Link, List, Stack, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import styled from '@emotion/styled';
import { DataGrid, GridColDef, GridColTypeDef, GridRenderEditCellParams, GridValueGetterParams, GRID_DATE_COL_DEF, useGridApiContext } from '@mui/x-data-grid';
import Header from './Header';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import locale from 'date-fns/locale/ja'
import format from 'date-fns/format';

const TextButton = styled(Button)`
  text-transform: none;
`

function GridEditDateCell({ id, field, value }: GridRenderEditCellParams<any, Date | null, string>) {
  const apiRef = useGridApiContext();

  function handleChange(newValue: Date | null) {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  }

  return (
    <DatePicker
      value={value}
      onChange={handleChange}
    />
  );
}

const dateAdapter = new AdapterDateFns({ locale });

const dateColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  // filterOperators: getDateFilterOperators(),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return dateAdapter.format(params.value, 'keyboardDate');
    }
    return '';
  },
};

function GridEditTimeCell({ id, field, value }: GridRenderEditCellParams<any, Date | null, string>) {
  const apiRef = useGridApiContext();

  function handleChange(newValue: Date | null) {
    console.log('time new value type',newValue)
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  }

  return (
    <TimePicker
      value={value}
      onChange={handleChange}
    />
  );
}
const timeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditTimeCell {...params} />;
  },
  // filterOperators: getDateFilterOperators(),
  valueFormatter: (params) => {
    if (typeof params.value === 'string') {
      return params.value;
    }
    if (params.value) {
      return format(params.value, 'HH:mm');
    }
    return '';
  },
};
// const columns: readonly Column<Row>[] = [
//   {
//     ...SelectColumn,
//     headerCellClass: "mycell",
//     cellClass: "mycell"
//   },
//   { key: 'id', name: 'ID', width: 10, cellClass: "mycell" },
//   { key: 'workDate', name: 'Date', width: 120, editor: dateEditor,
//     formatter(props) { return (<>{formatDate(props.row.workDate,'/')}</>); },
//   },
//   { key: 'startTime', name: 'Start', width: 60, editor: timeEditor,
//     formatter(props) { return (<TimeFormatter time={props.row.startTime} />); },
//   },
//   { key: 'endTime', name: 'End', width: 80, editor: timeEditor,
//     formatter(props) { return (<TimeFormatter time={props.row.endTime} />); },
//   },
//   { key: 'restTime', name: 'Rest', width: 80, editor: intervalEditor,
//     formatter : IntervalFormatter
//   },
//   { key: 'workTime', name: 'Working', width: 80,
//     // formatter(props) { return (<TimeFormatter time={props.row.workTime} />); },
//   },
//   { key: 'work', name: 'Work', width: 300, editor: textEditor },
//   { key: 'projectAlias', name: 'ProjectAlias', width: 300, editor: textEditor },
//   { key: 'projectCd', name: 'ProjectCD', width: 10 },
//   { key: 'task', name: 'task', width: 300, editor: textEditor },
// ];
function getWorkTime(params:GridValueGetterParams) {
    const row = params.row;
    const start = Math.floor(row.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const end   = Math.floor(row.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    console.log( "floor start,end", start, end);
    const time = (end - start) - row.restTime;
    return time;
}
// const columns: GridColDef[]= [
const columns: GridColDef[]= [
  { field: 'id', headerName: 'ID', width: 10 },
  // { field: 'workDate', headerName: 'Date', type: 'date', width: 120, editable: true },
  { field: 'workDate',
    ...dateColumnType,
    headerName: 'Date',
    width: 150, editable: true,
  },
  { field: 'startTime', headerName: 'Start',
  //  type: 'datetime',
    ...timeColumnType,
    width: 70, editable: true,
  },
  { field: 'endTime', headerName: 'End',
    // type: 'datetime',
    ...timeColumnType,
    width: 70, editable: true,
  },
  { field: 'restTime', headerName: 'Rest', type: 'number', width: 80, editable: true },
  { field: 'workTime', headerName: 'Working', width: 60,
    valueGetter: getWorkTime
  },
  { field: 'work', headerName: 'Work', width: 300, editable: true },
  { field: 'projectAlias', headerName: 'ProjectAlias', width: 300, },
  { field: 'projectCd', headerName: 'ProjectCD', width: 10 },
  { field: 'task', headerName: 'task', width: 300, },
];

function App() {
  const [rows,setRows] = useState([
    // { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:0, workTime:null,
    //   work: 'mail' , projectAlias: 'test-proj.', projectCd: 'xyz', task: 'design' },
    // { id: 0, workDate: '2022-01-03', startTime: '09:00', endTime: '10:00', restTime:0, workTime:null,
      // work: 'mail' , projectAlias: 'test-proj.', projectCd: 'xyz', task: 'design' },
    { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:0, workTime:null,
      work: 'mail' , projectAlias: 'test-proj.', projectCd: 'xyz', task: 'design' },
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
  // const onChangeRows = (rows: Row[], data: RowsChangeData<Row>) => {
  //   data.indexes.forEach(i => {
  //     setRows(()=>{
  //       return rows.map((oldRow, oldIdx)=>{
  //         if ( oldIdx === i) {
  //           console.log("changed index", i)
  //           console.log( "times", oldRow.endTime.getTime() , oldRow.startTime.getTime() , oldRow.restTime);
  //           const start = Math.floor(oldRow.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
  //           const end   = Math.floor(oldRow.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
  //           console.log( "floor start,end", start, end);
  //           const time = (end - start) - oldRow.restTime;
  //           console.log( "time", time);
  //           return { ...oldRow, workTime: time }
  //         }
  //         return oldRow;
  //       });
  //     });
  //   })
  // }
  function calculateWorkTime(row:Row) {
    const start = Math.floor(row.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const end   = Math.floor(row.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    console.log( "floor start,end", start, end);
    const time = (end - start) - row.restTime;
    return time;
  }
  const defaultWorkTime = 1;
  // function insertRowBefore(insertRowIdx: number) {
  //   const fromRow = rows[insertRowIdx];
  //   const st = fromRow.startTime;
  //   const newRow: Row = {
  //     id: nextId,
  //     workDate: new Date(fromRow.workDate),
  //     startTime: new Date(st.getFullYear(), st.getMonth(), st.getDay(), st.getHours()-defaultWorkTime, st.getMinutes(), 0),
  //     endTime:new Date(fromRow.startTime),
  //     restTime: 0,
  //     workTime: defaultWorkTime,
  //     work: fromRow.work,
  //     projectAlias: fromRow.projectAlias,
  //     projectCd: fromRow.projectCd,
  //     task: fromRow.task
  //   };
  //   setRows([...rows.slice(0, insertRowIdx), newRow, ...rows.slice(insertRowIdx)]);
  //   setNextId();
  // }
  // function insertRowAfter(insertRowIdx: number) {
  //   const fromRow = rows[insertRowIdx];
  //   const ed = fromRow.endTime;
  //   const newRow: Row = {
  //     id: nextId,
  //     workDate: new Date(fromRow.workDate),
  //     startTime:new Date(fromRow.endTime),
  //     endTime: new Date(ed.getFullYear(), ed.getMonth(), ed.getDay(), ed.getHours()+defaultWorkTime, ed.getMinutes(), 0),
  //     restTime: 0,
  //     workTime: defaultWorkTime,
  //     work: fromRow.work,
  //     projectAlias: fromRow.projectAlias,
  //     projectCd: fromRow.projectCd,
  //     task: fromRow.task
  //   };
  //   setRows([...rows.slice(0, insertRowIdx+1), newRow, ...rows.slice(insertRowIdx+1)]);
  //   setNextId();
  // }
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
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebarOpen=() => {
    setSidebarOpen(!isSidebarOpen)
  }
  const [datePickerDate, setDatePickerDate] = useState<Date | null>(new Date());
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, prevRows[0]]);
  };
  return (
    <div>
      <Header/>
      {/* <div>
      <Button onClick={toggleSidebarOpen}>hoge</Button>
      <Drawer className='Sidebar' anchor='left' open={isSidebarOpen} onClose={toggleSidebarOpen}
              variant="temporary"
              // variant="permanent"
      >
        <List>
          <p>hello</p>
          <p>hello2</p>
          <Link href="#" underline="hover">link hello</Link>
        </List>
      </Drawer>
      </div> */}
      {/* <Box sx={{ height: 400, width: '100%' }}> */}
      <div style={{ height: 300, width: '100%'}}>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={handleAddRow}>
            Add a row
          </Button>
          {/* <Button size="small" onClick={handleDeleteRow}>
            Delete a row
          </Button> */}
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
          <DataGrid
            rows={rows}
            columns={columns}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       pageSize: 5,
            //     }
            //   }
            // }}
          />
        </LocalizationProvider>
      </div>
      {/* </Box> */}
      {/* <div> */}
        {/* <DataGrid
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
        /> */}
        {/* {isContextMenuOpen &&
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
                    insertRowBefore(rowIdx);
                    setContextMenuProps(null);
                }}>
                上に行追加
                </button>
              </li>
              <li>
                <button type="button" onClick={()=>{
                    const { rowIdx } = contextMenuProps;
                    insertRowAfter(rowIdx);
                    setContextMenuProps(null);
                }}>
                下に行追加
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
          )} */}
      {/* </div> */}
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Box p={2}>
            <DatePicker
              label="DatePicker"
              value={datePickerDate}
              onChange={(newValue : Date | null)=>{
                console.log("datepicker onchange newvalue",newValue);
                setDatePickerDate(newValue);
              }}
              // renderInput={(params) => <TextField {...params}
              />
          </Box>
        </LocalizationProvider>
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
      {/* <div>
        <span>see https://qiita.com/daitai-daidai/items/5752b308e5e0f9457352</span>
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
                  >
                  change
                </button>
              </li>
            );
          })}
        </ul>
      </div> */}
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
      <div>
        <TextButton>text</TextButton>
        <Button variant='contained'>contained</Button>
        <Button variant='outlined'>outlined</Button>
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Box p={2}>
            <DatePicker
              label="DatePicker"
              value={datePickerDate}
              onChange={(newValue : Date | null)=>{
                console.log("datepicker onchange newvalue",newValue);
                setDatePickerDate(newValue);
              }}
              // renderInput={(params) => <TextField {...params}
              />
          </Box>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default App;
