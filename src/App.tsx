import './App.css';

import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import 'react-data-grid/lib/styles.css';
// import DataGrid, { textEditor } from 'react-data-grid';
// import { Column, SelectColumn,RowsChangeData } from 'react-data-grid';
// import dateEditor, { timeEditor, intervalEditor } from './DateEditor';
// import { TimeFormatter, IntervalFormatter } from './DateEditor';
// import { formatDate } from './DateEditor';
// import { Row } from'./types'
// import { createPortal } from 'react-dom';
import { Box, Button, Drawer, Link, List, Stack, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import styled from '@emotion/styled';
import { DataGrid, GridColDef, GridColTypeDef, GridRenderEditCellParams, GridRowId, GridRowsProp, GridValueGetterParams, GRID_DATE_COL_DEF, useGridApiContext } from '@mui/x-data-grid';
import Header from './Header';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import locale from 'date-fns/locale/ja'
import format from 'date-fns/format';
import { addHours } from 'date-fns';


export enum LocalStorageKeys {
  WORKS_KEY   = 'm510-grid-data',
  NEXT_ID_KEY = 'm510-next-id',
}

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
function getWorkTime(params:GridValueGetterParams) {
    const row = params.row;
    const start = Math.floor(row.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const end   = Math.floor(row.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const time = (end - start) - row.restTime;
    return time;
}
const columns: GridColDef[]= [
  { field: 'id', headerName: 'ID', width: 10 },
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
    { id: 0, workDate: new Date('2022-01-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:0, workTime:null,
      work: 'mail' , projectAlias: 'test-proj.', projectCd: 'xyz', task: 'design' },
  ]
  );
  const [contextMenuProps, setContextMenuProps] = useState<{
    rowIdx: number;
    top: number;
    left: number
  } | null>(null);
  const [nextId, setNextId] = useReducer((id: number) => id + 1, rows[rows.length - 1].id + 1);
  const defaultWorkTime = 1;
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
    setRows((prevRows) => {
      console.log("handleAddRow prevrows",prevRows);
      console.log("handleAddRow incremented idCounter",nextId);
      console.log("handleAddRow selected rowId", selectedRowId);
      if ( selectedRowId.size !== 1) return [ ...prevRows ];
      const selectedRow = rows.filter((row) => selectedRowId.has(row.id))[0];
      const selectedRowIdx = rows.indexOf(selectedRow);
      console.log("handleAddRow selected row idx,row", selectedRowIdx, selectedRow);
      const newRow = { ...selectedRow, 
                      id: nextId,
                      startTime: new Date(selectedRow.endTime),
                      endTime: addHours(selectedRow.endTime, defaultWorkTime),
                      restTime: 0,
                    }
      setNextId()
      // return [...prevRows, newRow]
      return [...prevRows.slice(0, selectedRowIdx+1), newRow, ...prevRows.slice(selectedRowIdx+1)]
    });
  };
  // const [selectionModel, setSelectionModel] = useState<Row[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<Set<GridRowId>>(new Set());
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
      <div style={{ height: 300, width: '100%'}}>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={handleAddRow}>
            Add a row
          </Button>
          <Button size="small" onClick={()=> {
            localStorage.setItem(LocalStorageKeys.WORKS_KEY, JSON.stringify(rows));
          }}>
            Save
          </Button>
          <Button size="small" onClick={()=>{
            const dateKeys = ['workDate','startTime','endTime'];
            const json = localStorage.getItem(LocalStorageKeys.WORKS_KEY);
            console.log("onClickLoad: loaded json", json);
            // https://oscdis.hatenablog.com/entry/2014/03/19/082015
            const rowsValue = JSON.parse((json ?  json : ''), (key,value)=>{
              console.log('json parse key,value', key, value);
              if (dateKeys.includes(key)) {
                console.log('date found', key, value)
                return new Date(Date.parse(value));
              }
              return value;
            });
            console.log("onClickLoad: loaded rows", rowsValue);
            setRows(rowsValue);
          }}>
            Load
          </Button>
          <Button size="small" onClick={()=> {
            localStorage.removeItem(LocalStorageKeys.WORKS_KEY);
          }}>
            RemoveSaved
          </Button>
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
          <DataGrid
            rowHeight={25}
            rows={rows}
            columns={columns}
            editMode="row"
            onRowSelectionModelChange={(newSelectionModel) => {
              console.log("new selection model",newSelectionModel)
              const selectedRowId = new Set(newSelectionModel);
              const selectedRows = rows.filter((row) => selectedRowId.has(row.id));
              console.log("selected rows", selectedRows)
              setSelectedRowId(selectedRowId);
            }}
            // https://mui.com/x/react-data-grid/editing/#full-featured-crud-component
            onCellEditStart={(params, event)=>{
              console.log("onCellEditStart params",params);
              console.log("onCellEditStart event",event);
            }}
            onCellEditStop={(params, event)=>{
              console.log("onCellEditStop params",params);
              console.log("onCellEditStop event",event);
            }}
            processRowUpdate={(newRow, oldRow) => {
              console.log("processRowUpdate newRow", newRow);
              console.log("processRowUpdate oldRow", oldRow);
              setRows((prevRows) => {
                console.log("processRowUpdate prevrows",prevRows);
                return prevRows.map((row) => (row.id === newRow.id ? newRow : row));
              });
              return newRow;
            }}
            // rowSelectionModel={selectionModel}
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
