import './App.css';

import { useReducer, useState } from 'react';
import { Box, Button, Drawer, Link, List, Stack, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { DataGrid, GridColDef, GridColTypeDef, GridRenderEditCellParams, GridRowId, GridRowsProp, GridValueGetterParams, GridValueSetterParams, useGridApiContext } from '@mui/x-data-grid';
import Header from './Header';
import { addHours, format } from 'date-fns';
import { timeColumnType } from './DateEditor';
import { PanoramaFishEyeSharp } from '@mui/icons-material';


export enum LocalStorageKeys {
  WORKS_KEY   = 'm510-grid-data',
  NEXT_ID_KEY = 'm510-next-id',
}

const TextButton = styled(Button)`
  text-transform: none;
`

function getWorkTime(params:GridValueGetterParams) {
    const row = params.row;
    const start = Math.floor(row.startTime.getTime() / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const end   = Math.floor(row.endTime.getTime()   / 1000 / 60) / 60;// 分単位で切り捨ててから時間にする
    const time = (end - start) - row.restTime;
    return time;
}
function MyCustomEditComponent(props: GridRenderEditCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  return <input type="text" value={props.value} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue+'!' });
  }} />;
}
var projects = [
  { id: 0, name: "xyz project contract1", code: 12345 },
  { id: 1, name: "abc project contract1", code: 67890 },
  { id: 3, name: "hoge project contractX", code: 59630 },
];

const columns: GridColDef[]= [
  { field: 'id', headerName: 'ID', width: 10 },
  { field: 'workDate',
    type: 'date',
    headerName: 'Date',
    width: 150, editable: true,
  },
  { field: 'startTime', headerName: 'Start',
    ...timeColumnType,
    width: 70, editable: true,
  },
  { field: 'endTime', headerName: 'End',
    ...timeColumnType,
    width: 70, editable: true,
  },
  { field: 'restTime', headerName: 'Rest', type: 'number', width: 80, editable: true },
  { field: 'workTime', headerName: 'Working', width: 60,
    valueGetter: getWorkTime
  },
  { field: 'work', headerName: 'Work', width: 300, editable: true,
    renderEditCell: (params: GridRenderEditCellParams) => (
      <MyCustomEditComponent {...params} />
    ),
  },
  { field: 'projectId', headerName: 'ProjectName', width: 300, editable: true,
    type: "singleSelect",
    valueOptions: projects.map((prj) => { return { value: prj.id, label: prj.name } })
  },
  { field: 'projectCd', headerName: 'ProjectCD', width: 10, 
    valueGetter: (params:GridValueGetterParams) => {
      const pj = projects.find((p)=>{ return p.id === params.row.projectId});
      return pj && pj.code
    }
   },
  { field: 'task', headerName: 'task', width: 300, editable: true },
];

function App() {
  const [rows,setRows] = useState([
    { id: 0, workDate: new Date('2022-04-03'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:0, workTime:null,
      work: 'mail' , projectId: projects[0].id, task: 'design' },
    { id: 1, workDate: new Date('2022-04-03'), startTime: new Date('1970-01-01 10:00'), endTime: new Date('1970-01-01 11:00'), restTime:0, workTime:null,
      work: 'coding' , projectId: projects[0].id, projectCd: 'xyz', task: 'design' },
    { id: 2, workDate: new Date('2022-04-03'), startTime: new Date('1970-01-01 11:00'), endTime: new Date('1970-01-01 14:00'), restTime:1, workTime:null,
      work: 'meeting' , projectId: projects[0].id, projectCd: 'xyz', task: 'design' },
    { id: 3, workDate: new Date('2022-04-04'), startTime: new Date('1970-01-01 09:00'), endTime: new Date('1970-01-01 10:00'), restTime:0, workTime:null,
      work: 'writing' , projectId: projects[0].id, projectCd: 'xyz', task: 'design' },
  ]
  );
  const [nextId, setNextId] = useReducer((id: number) => id + 1, rows[rows.length - 1].id + 1);
  const defaultWorkTime = 1;

  const [dateValue, setDateValue] = useState("");
  const [dateDispValue, setDateDispValue] = useState("");
  const [items, updateItems] = useState([
    { name: "item 1", done: false },
    { name: "item 2", done: true },
    { name: "item 3", done: false }
  ]);
  const [numValue, setNumValue] = useState<number>(0.0);
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
      return [...prevRows.slice(0, selectedRowIdx+1), newRow, ...prevRows.slice(selectedRowIdx+1)]
    });
  };
  const [selectedRowId, setSelectedRowId] = useState<Set<GridRowId>>(new Set());
  return (
    <div>
      <Header/>
      <div style={{ height: 300, width: '100%'}}>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={handleAddRow}>
            Add a row
          </Button>
          <Button size="small" onClick={() => {
            setRows((prevRows) => {
              if ( selectedRowId.size !== 1) return [ ...prevRows ];
              return prevRows.filter((row)=> !selectedRowId.has(row.id))
            });
          }}>
            Delete a row
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
          <Button size="small" onClick={()=> {
            console.log("projects",projects)
            console.log("selectedRowId",selectedRowId)
          }}>
            DebugLog
          </Button>
        </Stack>
        <DataGrid
          rowHeight={25}
          rows={rows}
          columns={columns}
          // editMode="row"
          onRowSelectionModelChange={(newSelectionModel) => {
            // console.log("new selection model",newSelectionModel)
            const selectedRowId = new Set(newSelectionModel);
            const selectedRows = rows.filter((row) => selectedRowId.has(row.id));
            console.log("selected rows", selectedRows)
            setSelectedRowId(selectedRowId);
          }}
          onCellEditStart={(params, event)=>{
            console.log("onCellEditStart params",params);
            console.log("onCellEditStart event",event);
            // event.defaultMuiPrevented = true;
          }}
          onCellEditStop={(params, event)=>{
            console.log("onCellEditStop params",params);
            console.log("onCellEditStop event",event);
            // event.defaultMuiPrevented = true;
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
      {/* <div>
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
        </LocalizationProvider> */}
      {/* </div> */}
    </div>
  );
}

export default App;
