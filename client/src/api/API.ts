import axios, { AxiosResponse } from "axios";

const baseUrl: string = "http://localhost:4000";

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

// TODO edit

// TODO remove