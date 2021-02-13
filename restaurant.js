class restaurant {
    constructor(name,location,genre) {
        this.name = name; //name of the restaurant
        this.location = location; //location object
        this.genre = genre; //type of restaurant ex) mexican,asian,soulfood etc
        this.likes = 0; //likes and dislikes for like/dislike ratio, 
        this.dislikes = 0;
    }

    getDetails() {
        return {name: this.name, location: this.location.getDetails(), genre: this.genre, likes: this.likes, dislikes: this.dislikes}
    }

    like() {
        this.likes = this.likes + 1;
        return;
    }

    dislike() {
        if (this.dislikes != 0) {
            this.dislikes = this.dislikes - 1;
        }
        return;
    }

    removeDislike() {
        //maybe if they add to their favorites, we remove some dislikes?
        return;
    }

}

module.exports = restaurant;