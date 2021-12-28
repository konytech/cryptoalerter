import axios, { AxiosResponse } from "axios";

const baseUrl: string = "http://localhost:4000";

export const getWatchers = function(): Promise<AxiosResponse<ApiDataType>> {
    return axios.get(baseUrl + "/watchers");
};

export const addWatcher = function(formData: Watcher): Promise<AxiosResponse<ApiDataType>> {
    const watcher: Watcher = {
        url: formData.url,
        symbol: formData.symbol
    }
    return axios.post(baseUrl + "/add-watcher", { watcher });
};

// TODO edit

// TODO remove