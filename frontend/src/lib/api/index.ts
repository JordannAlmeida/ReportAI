import axios from "axios";
import type {
  Report,
  PaginatedReports,
  CreateReportReq,
  UpdateReportReq,
  TurnOnOffReq,
  FilterReportParams,
  ListReportsParams,
  GenerateReportFromFileParams
} from "../../types/reportAI";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export class ReportApi {
  static async listReports(params?: ListReportsParams): Promise<PaginatedReports> {
    const res = await axios.get<PaginatedReports>(`${API_BASE_URL}/reports`, { params });
    return res.data;
  }

  static async filterReports(params: FilterReportParams): Promise<PaginatedReports> {
    const res = await axios.get<PaginatedReports>(`${API_BASE_URL}/reports/filter`, { params });
    return res.data;
  }

  static async createReport(data: CreateReportReq): Promise<Report> {
    const res = await axios.post<Report>(`${API_BASE_URL}/reports`, data);
    return res.data;
  }

  static async updateReport(data: UpdateReportReq): Promise<Report> {
    const res = await axios.put<Report>(`${API_BASE_URL}/reports`, data);
    return res.data;
  }

  static async turnOnOffReport(data: TurnOnOffReq): Promise<void> {
    await axios.post(`${API_BASE_URL}/reports/turnonoff`, data);
  }

  static async generateReportFromFile(params: GenerateReportFromFileParams): Promise<string> {
    const formData = new FormData();
    formData.append("idReport", params.idReport.toString());
    if (params.prompt) formData.append("prompt", params.prompt);
    if (params.model) formData.append("model", params.model);
    formData.append("file", params.file);
    const res = await axios.post(`${API_BASE_URL}/reports/generate`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "text"
    });
    return res.data;
  }
}
