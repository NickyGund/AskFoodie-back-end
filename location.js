class location {
    constructor(state,city,zipcode) {
        this.state = state;
        this.city = city;
        this.zipcode = zipcode;
    }

    getDetails() {
        return {state: this.state, city: this.city, zipcode: this.zipcode}
    }
}

module.exports = location;