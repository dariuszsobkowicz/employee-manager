import { AppState } from "./AppState";
import { workersData } from "./Handlers";

const actions = {
    changeValue: (value, filter) => {

        if (value === "") {

            for (let key in AppState.state.filtersMap) {

                if (key === "dateOfBirth") {
                    AppState.state.filtersMap[key] = new Date().toLocaleDateString();
                } else {
                    AppState.state.filtersMap[key] = "";
                }
            }
            AppState.state.workersSource = workersData;
            AppState.state.workersList = AppState.state.workersSource.slice(0, 5);
            AppState.dispatchEvent();

        } else {

            for (let key in AppState.state.filtersMap) {
                if (key === filter) {
                    AppState.state.filtersMap[filter] = value;
                } else {
                    if (key === "dateOfBirth") {
                        AppState.state.filtersMap[key] = new Date().toLocaleDateString();
                    } else {
                        AppState.state.filtersMap[key] = "";
                    }
                }
            }
            actions.filterList(workersData, value, filter);
        }
    },

    filterList: (list, value, filter) => {
        AppState.state.workersSource = list.filter((item) => {

            if (filter === "dateOfBirth") {
                return new Date(item[filter]).getTime() < new Date(value).getTime();
            } else {
                return item[filter].toString() === value;
            }
        });
        AppState.state.workersList = AppState.state.workersSource.slice(0, 5);
        AppState.dispatchEvent();
    },

    sortBy: (label, name) => {

        if (AppState.state.workersSource.length <= 1) return;

        if (name === "Activate") {
            AppState.state.workersSource.sort((a, b) => {
                if (a[label] < b[label]) {
                    return 1;
                } else if (a[label] > b[label]) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } else if (name === "Deactivate") {
            AppState.state.workersSource.sort((a, b) => {
                if (a[label] < b[label]) {
                    return -1;
                } else if (a[label] > b[label]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        AppState.state.workersList = AppState.state.workersSource.slice(0, 5);
        AppState.dispatchEvent();
    },

    getPaginationNumber: () => {

        let num = Math.floor(AppState.state.workersSource.length / AppState.state.pagination.pageSize);

        if (AppState.state.workersSource.length % AppState.state.pagination.pageSize > 0) {
            num++;
        }

        const arr = [...new Array(num).fill(false)];

        return arr;
    }

};

export default actions;
