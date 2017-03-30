import React from "react";
import Filters from "./Filters";
import Table from "./Table";
import Pagination from "./Pagination";

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

export default App;