import axios, { AxiosResponse } from "axios";
import { getServerUrl } from "../utils";

const baseUrl = getServerUrl();

export const getWatchers = function(): Promise<AxiosResponse<ApiDataType>> {
    return axios.get(baseUrl + "/watchers");
};

export const addWatcher = function(watcher: Watcher): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/add-watcher", { watcher });
};

export const getCoinInfo = function(url: string): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/coinInfo", { url });
};

export const setWatcherActive = function(watcherId: string, active: boolean) {
    return axios.post(baseUrl + "/set-watcher-active", { watcherId, active });
}

export const deleteWatcher = function(watcherId: string) {
    return axios.post(baseUrl + "/delete-watcher", { watcherId });
}

// TODO edit

// TODO remove