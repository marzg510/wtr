import { GridColTypeDef, GridRenderEditCellParams, GRID_DATE_COL_DEF, useGridApiContext } from "@mui/x-data-grid";
import { format } from "date-fns";

function TimeEditComponent(props: GridRenderEditCellParams) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  return (
    <input type="time"
      step={900}
      value={((d)=>{ return format(d, 'HH:mm'); })(props.value)}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        apiRef.current.setEditCellValue({ id, field, value:  new Date(`1970-01-01 ${event.target.value}`)  });
      }}
      autoFocus
    />
  );
}
export const timeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <TimeEditComponent {...params} />;
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

// export function intervalEditor<Row>({ column, row, onRowChange, onClose }:EditorProps<Row> ) {
//   return (
//     <input type="number"
//       className={`${textEditorClassname}`}
//       value={row[column.key as keyof Row] as string}
//       step={0.1} max={9.9} min={0.0}
//       onChange={(event) => { onRowChange({ ...row, [column.key]: parseFloat(event.target.value) }) }}
//       onBlur={() => onClose(true)}
//       autoFocus
//     />
//   );
// }
