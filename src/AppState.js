import StateStore from "./StateStore";
import { makeFilters, workersData } from "./Handlers";

export const AppState = new StateStore({

    workersList: workersData.slice(0, 5),

    workersSource: workersData,

    labels: Object.keys(workersData[0]).reduce((map, label) => {
        switch (label) {
            case "id":
                map[label] = "ID";
                break;
            case "firstName":
                map[label] = "First Name";
                break;
            case "lastName":
                map[label] = "Last Name";
                break;
            case "dateOfBirth":
                map[label] = "Date of Birth";
                break;
            case "function":
                map[label] = "Position";
                break;
            case "experience":
                map[label] = "Experience";
                break;
            default:
                break;
        }
        return map;
    }, {}),

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
        activePage: 1,
        pageSize:   5,
    },

    paginationNav: []


});