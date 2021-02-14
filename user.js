
class user {
  constructor(username,information) {
    this.username = username; //username
    this.information = information; //holds users information
    this.likedFoodieArray = []; //an array of restaurants they liked
    this.favoriteFoodieArray = []; //an array of favorite restaurants
    this.limitedFoodieArray = []; //an array of restaurants to not show the user for awhile
    this.blockedFoodieArray = []; //an array of restaurants to never show the user
  }

  //restaunrats they liked
  likedFoodie(restaurant) {
    this.likedFoodieArray.push(restaurant);
  }
  //An array of favorite restaurants
  favoriteFoodie(restaurant) {
    this.favoriteFoodieArray.push(restaurant);
  }

  //Restaurants to not show user for a period of time???
  limitedFoodie(restaurant) {
    this.limitedFoodieArray.push(restaurant);
  }

  //Restaurants to not show user
  blockedFoodie(restaurant) {
    this.blockedFoodieArray.push(restaurant);
  }

}

/*

testtt 
//let date = new dob("September",16,1998);

//let dateFile = require("./dob.js");

const dob = require("./dob.js");

const date = new dob("September",16,1998);

//let date = new dateFile("September",16,1998);

let user1 = new user('Gus','Garcia',date,"gus@me.com");

console.log(user1.dob.getDOB());

const location = require("./location.js");

const ihoplocation = new location("nj","edision",07001);

const restaurant = require("./restaurant.js");

const ihop = new restaurant("ihop",ihoplocation,"breakfast");

console.log(ihop.location.getLocation());
*/

const location = require("./location.js");

var zipp = 97001;

var ihoplocation = new location("nj","edision",09001); //just use strings when passing numbers, js things they're octal????

const restaurant = require("./restaurant.js");

var ihop = new restaurant("ihop",ihoplocation,"breakfast");

console.log(ihoplocation.getDetails());

console.log(ihop.getDetails());

ihop.like();
ihop.like();
ihop.like();
ihop.like();
ihop.like();

console.log(ihop.getDetails());

