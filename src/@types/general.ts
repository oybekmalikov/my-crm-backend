export interface ReturnningType {
  message: {
    uz: string;
    ru: string;
    en: string;
  };
  data: [] | object | null;
  success: boolean;
}
export type RolesType =
  | 'SUPERADMIN'
  | 'ADMIN'
  | 'STUDENT'
  | 'TEACHER'
  | 'STAFF';
