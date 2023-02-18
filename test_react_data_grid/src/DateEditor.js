import textEditorClassname from 'react-data-grid';

export default function dateEditor({ column, row, onRowChange, onClose } ) {
  return (
    <input type="date"
      className={textEditorClassname}
      value={row[column.key]}
      onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
      onBlur={() => onClose(true)}
      autoFocus
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