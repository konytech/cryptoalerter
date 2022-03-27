import axios, { AxiosResponse } from "axios";
import { getServerUrl } from "../utils";

const baseUrl = getServerUrl();
const authToken = process.env.REACT_APP_AUTH_TOKEN;

export const getWatchers = function(): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/watchers", { authToken });
};

export const addWatcher = function(watcher: Watcher): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/add-watcher", { authToken, watcher });
};

export const getCoinInfo = function(url: string): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/coinInfo", { authToken, url });
};

export const setWatcherActive = function(watcherId: string, active: boolean) {
    return axios.post(baseUrl + "/set-watcher-active", { authToken, watcherId, active });
}

export const deleteWatcher = function(watcherId: string) {
    return axios.post(baseUrl + "/delete-watcher", { authToken, watcherId });
}