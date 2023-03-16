import textEditorClassname, { EditorProps } from 'react-data-grid';

import DataGrid, { FormatterProps, textEditor } from 'react-data-grid';

export function formatDate(d: Date, sep:string):string {
  return `${d.getFullYear()}${sep}${('0'+(d.getMonth()+1)).slice(-2)}${sep}${('0'+d.getDate()).slice(-2)}`;
}
export function formatTime(t: Date):string {
  return `${('0'+t.getHours()).slice(-2)}:${('0'+t.getMinutes()).slice(-2)}`;
}
export function TimeFormatter({ time }: { time: Date }) {
  // return ( <>{('0'+time.getHours()).slice(-2)}:{('0'+time.getMinutes()).slice(-2)}</> );
  return ( <>{formatTime(time)}</> );
}
export function IntervalFormatter<Row>(props: FormatterProps<Row>) {
  const v = props.row[props.column.key as keyof Row] as number;
  return v ? ( <>{v.toFixed(1)}</> ) : null;
}

export default function dateEditor<Row>({ column, row, onRowChange, onClose }:EditorProps<Row> ) {
  return (
    <input type="date"
      className={`${textEditorClassname}`}
      value={((d)=>{ return formatDate(d,'-'); })(row[column.key as keyof Row] as Date)}
      onChange={(event) => onRowChange({ ...row, [column.key]: new Date(Date.parse(event.target.value)) })}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}

export function timeEditor<Row>({ column, row, onRowChange, onClose }:EditorProps<Row> ) {
  return (
    <input type="time"
      className={`${textEditorClassname}`}
      value={((t)=>{ return formatTime(t); })(row[column.key as keyof Row] as Date)}
      step={900}
      onChange={(event) => { onRowChange({ ...row, [column.key]: new Date(`1970-01-01 ${event.target.value}`) }) }}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}

export function intervalEditor<Row>({ column, row, onRowChange, onClose }:EditorProps<Row> ) {
  return (
    <input type="number"
      className={`${textEditorClassname}`}
      value={row[column.key as keyof Row] as string}
      step={0.1} max={9.9} min={0.0}
      onChange={(event) => { onRowChange({ ...row, [column.key]: parseFloat(event.target.value) }) }}
      onBlur={() => onClose(true)}
      autoFocus
    />
  );
}