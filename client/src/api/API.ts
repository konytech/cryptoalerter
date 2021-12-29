import axios, { AxiosResponse } from "axios";

const baseUrl: string = "http://localhost:4000";

export const getWatchers = function(): Promise<AxiosResponse<ApiDataType>> {
    return axios.get(baseUrl + "/watchers");
};

export const addWatcher = function(formData: Watcher): Promise<AxiosResponse<ApiDataType>> {
    const watcher: Watcher = {
        coinInfo: {
            url: formData.coinInfo.url,
            symbol: formData.coinInfo.symbol,
            cmcId: formData.coinInfo.cmcId
        }
    }
    return axios.post(baseUrl + "/add-watcher", { watcher });
};

export const getCoinInfo = function(url: string): Promise<AxiosResponse<ApiDataType>> {
    return axios.post(baseUrl + "/coinInfo", { url });
};

// TODO edit

// TODO remove