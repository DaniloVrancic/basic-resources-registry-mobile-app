export interface EmployeeSearchCriteria {
    name?: string;
    income_min?: number; //Going to filter in the range between min and max income of a all employees
    income_max?: number; //Filtering out everything above max income
  }