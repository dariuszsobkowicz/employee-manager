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

export default StateStore;