class information{
    constructor(first_name,last_name,dob,email,location) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.dob = dob;
        this.email = email;
        this.location = location;
    }

    getDetails() {
        return {first_name: this.first_name, last_name: this.last_name, dob: this.dob.getDetails(), 
            email: this.email, location: this.location.getDetails()}
    }
}