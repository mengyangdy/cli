import axios,{AxiosError} from "axios";

import type {AxiosResponse,CreateAxiosDefaults,InternalAxiosRequestConfig} from 'axios'
import axiosRetry from "axios-retry";

import {nanoid} from "nanoid";
import {RequestOption} from "@/axios/types";
import {createDefaultOptions} from "./options";


function createCommonRequest<ResponseData =any>(axiosConfig?:CreateAxiosDefaults,options?:Partial<RequestOption<ResponseData>>){
  const opts=createDefaultOptions<ResponseData>(options)
  const axiosConf=createAxiosConfig(axiosConfig)
}
