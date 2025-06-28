export class CreateHabitDto {
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  value?: number;
}
