import textEditorClassname from 'react-data-grid';
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import "react-datepicker/dist/react-datepicker.css";

// function dateValue() {
//   return "2022-12-24";
// }
function dateValue(row,column) {
  // return "2022-12-24";  // OK
  const d = row[column.key];
  return `${d.getFullYear()}-${('0'+d.getMonth()+1).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
}
function formatDate(date) {
  return `${date.getFullYear()}-${('0'+date.getMonth()+1).slice(-2)}-${('0'+date.getDate()).slice(-2)}`;
}

export default function dateEditor({ column, row, onRowChange, onClose } ) {
  return (
    <input type="date"
      className={textEditorClassname}
      // value={2022-12-24} //NG
      // value="2022-12-24" //OK
      // value={"2022-12-24"} //OK
      // value={()=>{return "2022-12-24"}} //NG
      // value={(row)=>{"2022-12-24"}} //NG
      // value={function(){return "2022-12-24"}} //NG
      // value={dateValue()} //OK
      // value={()=>{dateValue()}} //NG
      // value={()=>dateValue()} //NG
      // value={dateValue(row,column)} //OK
      // value={formatDate(row[column.key])} //OK
      value={((d)=>{
        console.log("row value",d);
        const val = `${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
        console.log("month ",d.getMonth()+1);
        console.log("month value",('0'+(d.getMonth()+1)).slice(-2));
        // console.log("return value",val);
        // return val;
        return `${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
        // return `${d.getFullYear()}-${('0'+d.getMonth()+1).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
      })(row[column.key])}
      // onChange={(event) => onRowChange({ ...row, [column.key]: new Date(Date.parse(event.target.value)) })}
      onChange={(event) => {
        console.log("event value",event.target.value);
        onRowChange({ ...row, [column.key]: new Date(Date.parse(event.target.value)) })
        // console.log("after on RowChange value",row[column.key]);
      }}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}

export function datePickerEditor({ column, row, onRowChange, onClose } ) {
  registerLocale("ja",ja);
  return (
    <DatePicker
      className={textEditorClassname}
      selected={row[column.key]}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      // onBlur={() => onClose(true)}
      dateFormat="yyyy/MM/dd"
      locale="ja"
    />
  );
}

export function timeEditor({ column, row, onRowChange, onClose } ) {
  return (
    <input type="time"
      className={textEditorClassname}
      value={row[column.key]}
      step={900}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}