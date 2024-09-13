import type {RequestOption} from "./types";
import {CreateAxiosDefaults} from "axios";
import { isHttpSuccess } from './shared';
import { stringify } from 'qs';

export function createDefaultOptions<ResponseData = any>(options?: Partial<RequestOption<ResponseData>>) {
  const opts: RequestOption<ResponseData> = {
    onRequest: async config => config,
    isBackendSuccess: _response => true,
    onBackendFail: async () => {
    },
    transformBackendResponse: async response => response.data,
    onError: async () => {
    }
  }
  Object.assign(opts, options)

  return opts
}


export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000
  const axiosConfig: CreateAxiosDefaults = {
    timeout: TEN_SECONDS,
    headers: {
      'Content-Type': 'application/json'
    },
    validateStatus: isHttpSuccess,
    paramsSerializer: params => {
      return stringify(params)
    }
  }
  Object.assign(axiosConfig, config)
  return axiosConfig
}
