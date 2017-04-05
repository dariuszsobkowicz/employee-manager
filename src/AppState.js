import StateStore from "./StateStore";
import { makeFilters, workersData, makeLabels } from "./Handlers";

export const AppState = new StateStore({

    workersList: workersData.slice(0, 5),

    workersSource: workersData,

    labels: makeLabels(workersData[0]),

    filtersList: makeFilters(Object.keys(workersData[0]), workersData),

    filtersMap: Object.keys(workersData[0]).reduce((map, data) => {

        if (data === "dateOfBirth") {
            map[data] = new Date().toLocaleDateString();
        } else {
            map[data] = "";
        }

        return map;

    }, {}),

    pagination: {
        pageSize:   5,
    },

    paginationNav: []


});