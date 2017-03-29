import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

import workersSource from "./workers-source";

/* HELPERS */

const workersData = workersSource.map((data) => {
    let date = data.dateOfBirth.split(".");
    let day = date.splice(1, 1)[0];

    date.unshift(day);
    data.dateOfBirth = new Date(date.join("."));

    return data;

}).sort((a, b) => a.id - b.id);

/* STORE */

class StateStore {
    constructor (state) {
        this.state = state;
        this.callback = function () {
        };
    }

    dispatchEvent () {
        this.callback(this.state);
    }

    eventListener (callback) {
        this.callback = callback;
    }
}

function makeFilters (list, data) {

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

const AppState = new StateStore({

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

/* TABLE */

const TableHeader = (props) => (
    <thead>
    <tr>
        {Object.keys(props.data.labels).map((label) => {
            return <th key={label}>
                {props.data.labels[label]}
                {" "}
                <span className="glyphicon glyphicon-triangle-bottom"
                      onClick={(e) => props.onActivate(label, e)}></span>
                {" "}
                <span className="glyphicon glyphicon-triangle-top" onClick={(e) => props.onDeactivate(label, e)}></span>
            </th>;
        })}
    </tr>
    </thead>
);

class TableBody extends React.Component {

    constructor (props) {
        super(props);
        this.state = this.props.data;
    }

    render () {
        return <tbody>{this.state.workersList.map((data) => (
            <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.dateOfBirth.toLocaleDateString()}</td>
                <td>{data.function}</td>
                <td>{data.experience}</td>
            </tr>
        ))}</tbody>;
    }
}

class Table extends React.Component {

    constructor (props) {
        super(props);
        this.state = this.props;
    }

    onActivate (label, e) {
        actions.sortBy(label, "Activate");
    }

    onDeactivate (label, e) {
        actions.sortBy(label, "Deactivate");
    }

    render () {
        return (
            <div className="table-responsive">
                <table className="table">
                    <TableHeader onActivate={this.onActivate} onDeactivate={this.onDeactivate} {...this.state}/>
                    <TableBody {...this.state}/>
                </table>
            </div>
        );
    }
}

/* ACTIONS */

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
            AppState.state.workersSource = workersSource;
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

        if (AppState.state.workersSource.length <= 5) return;

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

/* PAGINATION */

class Pagination extends React.Component {
    constructor (props) {
        super(props);
        this.state = this.props.data;
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            paginationNav: actions.getPaginationNumber()
        });
    }

    componentDidMount () {
        this.setState({
            paginationNav: actions.getPaginationNumber()
        });

    }

    changePage (page, e) {
        let pageSize = this.state.pagination.pageSize;
        let counter = page + 1;

        AppState.state.workersList = AppState.state.workersSource.slice((page * pageSize), (counter * pageSize));
        AppState.dispatchEvent();
    }

    render () {
        return (
            <div>
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {this.state.paginationNav.map((item, i) => {
                            return <li key={i} className={item ? "active" : null}
                                       onClick={(e) => this.changePage(i, e)}><a href="#">{i + 1}</a></li>;
                        })}
                    </ul>
                </nav>
            </div>
        );
    }
}

/* FILTERS */

class Filters extends React.Component {

    constructor (props) {
        super(props);
        this.state = this.props.data.filtersMap;
        this.setNewDate = this.setNewDate.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        this.setState(nextProps.data.filtersMap);
        $(this.daterange).data('daterangepicker').setStartDate(nextProps.data.filtersMap.dateOfBirth);
    }

    componentDidMount () {

        $(this.daterange).daterangepicker({
                singleDatePicker: true,
                showDropdowns:    true,
                opens:            "right",
                locale:           {
                    format: "DD/MM/YYYY"
                },
                autoUpdateInput:  true
            },
            (start, end) => {
                actions.changeValue(start._d, "dateOfBirth");
            });
    }

    setNewDate (e) {
        this.setState({
            dateOfBirth: e.target.value
        });
    }

    render () {
        return (
            <div>
                {Object.keys(this.state).map((filter) => (

                    <div key={filter} className="col-xs-4 col-md-2">

                        {filter !== "dateOfBirth" ?
                            <select className={"form-control " + (this.state[filter] !== "" ? "label-success" : null)}
                                    value={this.state[filter]}
                                    onChange={(e) => actions.changeValue(e.target.value, filter)}>

                                <option
                                    value="">{this.state[filter] === "" ? this.props.data.labels[filter] : "X Reset"}</option>

                                {this.props.data.filtersList[filter].map((item) => {
                                    return <option value={item} key={item}>{item}</option>;
                                })
                                }
                            </select> :

                            <input
                                className={"form-control " + (new Date(this.state[filter]).getDate() < new Date().getDate() ? "label-success" : null)}
                                type="text"
                                ref={(input) => {
                                    this.daterange = input;
                                }}
                                name="daterange"
                                onChange={this.setNewDate}
                                value={this.state[filter]}/>
                        }
                    </div>

                ))}
            </div>
        );
    }
}

/* APP */

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = this.props.store.state;
    }

    componentDidMount () {
        this.props.store.eventListener((state) => {
            this.setState(state);
        });
    }

    render () {
        return (
            <div className="container">
                <div className="row" style={{marginTop: "30px", marginBottom: "30px"}}>
                    <div className="col-xs-12">
                        <h4>Filter by</h4>
                    </div>
                    <Filters data={this.state}/>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Table data={this.state}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <Pagination data={this.state}/>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App store={AppState}/>, document.getElementById("root"));



