import textEditorClassname from 'react-data-grid';
import DatePicker, { registerLocale } from "react-datepicker"
import ja from 'date-fns/locale/ja';
import "react-datepicker/dist/react-datepicker.css";
import {createPortal} from 'react-dom';

export default function dateEditor({ column, row, onRowChange, onClose } ) {
  return (
    <input type="date"
      className={textEditorClassname}
      value={((d)=>{
        console.log("date value",d);
        return `${d.getFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)}`;
      })(row[column.key])}
      onChange={(event) => onRowChange({ ...row, [column.key]: new Date(Date.parse(event.target.value)) })}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}

export function timeEditor({ column, row, onRowChange, onClose } ) {
  return (
    <input type="time"
      className={textEditorClassname}
      // value={row[column.key]}
      value={((t)=>{
        console.log("time value",t);
        return `${('0'+t.getHours()).slice(-2)}:${('0'+t.getMinutes()).slice(-2)}`;
      })(row[column.key])}
      step={900}
      onChange={(event) => {
        console.log("target value",event.target.value);
        const val = new Date(`1970-01-01 ${event.target.value}`);
        console.log("val",val);
        console.log("getTime",val.getTime());
        onRowChange({ ...row, [column.key]: val })
        // onRowChange({ ...row, [column.key]: new Date(`0000-00-00 ${event.target.value}`) })
      }}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}

export function datePickerEditor({ column, row, onRowChange, onClose } ) {
  registerLocale("ja",ja);
  return (
    <div tabIndex={-1} >
    <DatePicker
      className={textEditorClassname}
      selected={row[column.key]}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      // onBlur={() => onClose(true)}
      dateFormat="yyyy/MM/dd"
      locale="ja"
      popperContainer={({children}) => createPortal(children,document.body)}
    />
    </div>
  );
}
