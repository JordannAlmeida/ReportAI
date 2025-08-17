export type Report = {
  id: number;
  template: string;
  user_mail: string;
  active: boolean;
  create_at: string;
  update_at: string;
}

export type PaginatedReports = {
  reports: Report[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type CreateReportReq = {
  template: string;
  user_mail: string;
}

export type UpdateReportReq = {
  id: number;
  template: string;
}

export type TurnOnOffReq = {
  id: number;
  active: boolean;
}

export type FilterReportParams = {
  id: number;
  user_mail?: string;
  page?: number;
  page_size?: number;
}

export type ListReportsParams = {
  page?: number;
  page_size?: number;
}

export type GenerateReportFromFileParams = {
  idReport: number;
  prompt?: string;
  model?: string;
  file: File;
}
