import React from "react";
import actions from "./../Actions";
import $ from "jquery";
import daterangepicker from "bootstrap-daterangepicker";

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
                        {console.log(this.state)}
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
                                className={"form-control " + (new Date(this.state[filter]).getTime() < (new Date().getTime() - (86400 * 1000)) ? "label-success" : null)}
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

export default Filters;