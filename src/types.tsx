export interface Row {
  id: number;
  workDate: Date;
  startTime: Date;
  endTime: Date;
  restTime: number;
  workTime: number | null;
  work: string;
  projectAlias: string;
  projectCd: string;
  task: string;
}
