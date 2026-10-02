export type StudentsStackParamList = {
  CourseStudentsScreen: undefined;
  StudentContact: undefined;
  AddStudents: undefined;
  SelectStudents: { initialSelectAll?: boolean } | undefined;
  SelectContactMethod: { selectedIds: string[] };
  EmailCompose: { selectedIds: string[] };
  NotifyCompose: { selectedIds: string[] };
  SpecialNeeds: undefined;
};
