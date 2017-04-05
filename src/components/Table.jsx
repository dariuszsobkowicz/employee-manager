import React from "react";

import actions from "./../Actions";

const TableHeader = (props) => (
    <thead>
    <tr>
        {Object.keys(props.data.labels).map((label) => {
            return (
                <th key={label}>
                    {props.data.labels[label]}
                    {" "}
                    <span className="glyphicon glyphicon-triangle-bottom"
                          onClick={(e) => props.onActivate(label, e)}></span>
                    {" "}
                    <span className="glyphicon glyphicon-triangle-top"
                          onClick={(e) => props.onDeactivate(label, e)}></span>
                </th>);
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
        return (
            <tbody>
            {this.state.workersList.map((data) => (
                <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.firstName}</td>
                    <td>{data.lastName}</td>
                    <td>{data.dateOfBirth.toLocaleDateString()}</td>
                    <td>{data.function}</td>
                    <td>{data.experience}</td>
                </tr>
            ))}
            </tbody>);
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

export default Table;