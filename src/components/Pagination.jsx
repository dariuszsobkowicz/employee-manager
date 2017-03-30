import React from "react";
import { AppState } from "./../AppState";
import actions from "./../Actions";

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

export default Pagination;