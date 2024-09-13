import {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";

export interface RequestOption<ResponseData = any> {
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean

  onBackendFail: (response: AxiosResponse<ResponseData>, instance: AxiosInstance) => Promise<AxiosResponse | null> | Promise<void>

  transformBackendResponse(response: AxiosResponse<ResponseData>): any | Promise<any>

  onError: (error: AxiosError<ResponseData>) => void | Promise<void>
}
