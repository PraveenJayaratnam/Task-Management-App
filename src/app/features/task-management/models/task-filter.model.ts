import { Filter } from '@shared/models';

export interface TaskFilter extends Filter {
  status?: number;
  priority?: number;
}
