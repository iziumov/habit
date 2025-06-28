import { PartialType } from '@nestjs/mapped-types';
import { CreateHabitLogDto } from './create-habit_log.dto';

export class UpdateHabitLogDto extends PartialType(CreateHabitLogDto) {}
