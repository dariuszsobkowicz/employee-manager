import workersSource from "./workers-source";

export function makeLabels (data) {

    return Object.keys(data).reduce((map, label) => {

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

    }, {});

}

export function makeFilters (list, data) {

    const filters = {};

    list.forEach((item) => {

        filters[item] = data.reduce((map, filter) => {
            if (map.indexOf(filter[item]) === -1) {
                map.push(filter[item]);
            }
            return map;

        }, []).sort((a, b) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

    });

    return filters;
}

export const workersData = workersSource.map((data) => {

    let date = data.dateOfBirth.split(".");
    let day = date.splice(1, 1)[0];

    date.unshift(day);
    data.dateOfBirth = new Date(date.join("/"));

    return data;

}).sort((a, b) => a.id - b.id);