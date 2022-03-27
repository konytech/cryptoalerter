import axios, { AxiosResponse } from "axios";
import { getServerUrl } from "../utils";

const baseUrl = getServerUrl();

export const getWatchers = function(authToken: string): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/watchers", { authToken });
};

export const addWatcher = function(authToken: string, watcher: Watcher): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/add-watcher", { authToken, watcher });
};

export const getCoinInfo = function(authToken: string, url: string): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/coinInfo", { authToken, url });
};

export const setWatcherActive = function(authToken: string, watcherId: string, active: boolean) {
    return axios.post(baseUrl + "/set-watcher-active", { authToken, watcherId, active });
}

export const deleteWatcher = function(authToken: string, watcherId: string) {
    return axios.post(baseUrl + "/delete-watcher", { authToken, watcherId });
}