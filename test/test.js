// https://github.com/mochajs/
import User from "./../src/User/user.schema.js";
import Restaurant from "./../src/Restaurant/restaurant.schema.js";
import {parentCommentSchema} from "./../src/Comment/comment.schema.js";
const mongoose = require("mongoose");

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const app = "http://localhost:3000";

const test_emails = [
    "address0@someDomain.com",
    "address1@someDomain.com",
    "🥝",
    "address2@someDomain.com",
];
const test_place_ids = [
    "🥝",
    "ChIJ57Pc-peww4kRxsjS7GsqWfQ",
    "ChIJ_UDANVHGw4kRyF7OUJ3Uxrw",
]
const test_place_names = [
    "Vivi Bubble Tea/KBG",
    "Wendy's",
    "🥝",
]
const test_comment_posters = [
    "userName0",
    "🥝",
]
var login_data;
var restaurant_data;
var parent_comment_data;

// Removes the test database data
function cleanup() {
    // Connect to DB
    mongoose.connect('mongodb://localhost:27017/Ask-Foodie-DB', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    // Remove test data in database
    Promise.all([
        User.deleteMany({ email: {$in: test_emails} }),
        Restaurant.deleteMany({ place_id: {$in: test_place_ids} }),
        Restaurant.deleteMany({ name: {$in: test_place_names} }),
        parentCommentSchema.deleteMany({ poster: {$in: test_comment_posters} }),
        parentCommentSchema.deleteMany({ restaurant: test_place_names[0] }),
    ])
        .then(function(values) {
            // Disconnect from DB
            mongoose.disconnect();
            return;
        })
        .catch(console.log);
    return;
};
before(cleanup);
after(cleanup);

// Test the user controller
describe("User Controller", function() {
    // Test registerring
    describe("POST /api/register", function() {
        it("should register user normally", function(done) {
            const params = {
                email: test_emails[0],
                firstName: "firstName0",
                userName: "userName0",
                birthdate: new Date(),
                password: "password0",
            };

            // Register a user
            chai
                .request(app)
                .post("/api/register")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(false);
                    done();
                });
        });

        it("should fail to register a duplicate email", function(done) {
            const params = {
                email: test_emails[0],
                firstName: "firstName1",
                userName: "userName1",
                birthdate: new Date(),
                password: "password1",
            };

            // Register a user
            chai
                .request(app)
                .post("/api/register")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data).equal("email already exists.");
                    done();
                });
        });
        
        it("should fail to register a duplicate username", function(done) {
            const params = {
                email: test_emails[1],
                firstName: "firstName0",
                userName: "userName0",
                birthdate: new Date(),
                password: "password0",
            };

            // Register a user
            chai
                .request(app)
                .post("/api/register")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data.name).equal("MongoError");
                    chai.expect(res.body.data.code).equal(11000);
                    done();
                });
        });
        
        it("should fail to register an invalid email", function(done) {
            const params = {
                email: test_emails[2],
                firstName: "firstName1",
                userName: "userName1",
                birthdate: new Date(),
                password: "password1",
            };

            // Register a user
            chai
                .request(app)
                .post("/api/register")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data).equal("\"email\" must be a valid email");
                    done();
                });
        });

        it("should register user normally 2", function(done) {
            const params = {
                email: test_emails[1],
                firstName: "firstName1",
                userName: "userName1",
                birthdate: new Date(),
                password: "password1",
            };

            // Register a user
            chai
                .request(app)
                .post("/api/register")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(false);
                    done();
                });
        });
    });

    // Test logging in
    describe("POST /api/login", function() {
        it("should login user normally", function(done) {
            const params = {
                email: test_emails[0],
                password: "password0"
            };

            chai
                .request(app)
                .post("/api/login")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(false);
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data).ownProperty("token");
                    login_data = res.body.data;
                    done();
                });
        });
        
        it("should fail to login invalid user", function(done) {
            const params = {
                email: test_emails[3],
                password: "password0"
            };

            chai
                .request(app)
                .post("/api/login")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data).equal("cannot find email");
                    done();
                });
        });
        
        it("should fail to login wrong password", function(done) {
            const params = {
                email: test_emails[0],
                password: "password1"
            };

            chai
                .request(app)
                .post("/api/login")
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data).equal("incorrect password");
                    done();
                });
        });
    });

    // Test adding profile info
    describe("POST /api/addProfileInfo", function() {
        it("should update profile normally", function(done) {
            const params = {
                foodTypes: ["chinese", "italian"],
                price: "$$",
                distance: 10,
                dining: 2,
            }

            chai
                .request(app)
                .post("/api/addProfileInfo")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("data");
                    done();
                });
        });

        it("should fail with extra params", function(done) {
            const params = {
                age: 6,
            }

            chai
                .request(app)
                .post("/api/addProfileInfo")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(400);
                    done();
                });
        });
    });
});

// Test the authentification
describe("Auth", function() {
    describe("GET /", function() {
        it("should authenticate normally", function(done) {
            chai
                .request(app)
                .get("/")
                .set("Authorization", `Bearer ${login_data.token}`)
                .end(function(err, res) {
                    chai.expect(res).to.have.status(200);
                    done();
                })
        });

        it("should fail with no token", function(done) {
            chai
                .request(app)
                .get("/")
                .end(function(err, res) {
                    chai.expect(res).to.have.status(401);
                    done();
                })
        });
        
        it("should fail with fake token", function(done) {
            chai
                .request(app)
                .get("/")
                .set("Authorization", `Bearer kiwi`)
                .end(function(err, res) {
                    chai.expect(res).to.have.status(401);
                    done();
                })
        });
    });
});

// Test the places controller
describe("Places Controller", function() {
    describe("GET /api/places/find", function() {
        it("should find a place normally", function(done) {
            const params = {
                latitude: '40.6129',
                longitude: '-74.416',
                filters: JSON.stringify(["$$$"]),
                foodFilters: JSON.stringify(["Fast Food"]),
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/find")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("text");
                    
                    var places;
                    try {
                        places = JSON.parse(res.text);
                    } catch(err) {
                        fail(err.message);
                    }

                    chai.expect(places).not.empty;
                    for (var result_i = 0; result_i < places.length; result_i++) {
                        chai.expect(places[result_i]).include.keys("vicinity", "name", "place_id");
                    }
                    restaurant_data = places[0];

                    done();
                });
        });
        
        it("should error without latitude", function(done) {
            const params = {
                longitude: '-74.416',
                filters: JSON.stringify(["$$$"]),
                foodFilters: JSON.stringify(["Fast Food"]),
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/find")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(400);
                    done();
                });
        });

        it("should error without longitude", function(done) {
            const params = {
                latitude: '40.6129',
                filters: JSON.stringify(["$$$"]),
                foodFilters: JSON.stringify(["Fast Food"]),
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/find")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(400);
                    done();
                });
        });
        
        it("should find a place with filters missing", function(done) {
            const params = {
                latitude: '40.6129',
                longitude: '-74.416'
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/find")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("text");
                    
                    var places;
                    try {
                        places = JSON.parse(res.text);
                    } catch(err) {
                        fail(err.message);
                    }

                    chai.expect(places).not.empty;
                    for (var result_i = 0; result_i < places.length; result_i++) {
                        chai.expect(places[result_i]).include.keys(["vicinity", "name", "place_id"]);
                    }
                    done();
                });
        });

        it("should error with too low longitude and too low latitude", function(done) {
            const params = {
                latitude: '-1',
                longitude: '-181',
                filters: JSON.stringify(["$$$"]),
                foodFilters: JSON.stringify(["Fast Food"]),
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/find")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(503);
                    done();
                });
        });
        
        it("should error with too high longitude and too high latitude", function(done) {
            const params = {
                latitude: '-1',
                longitude: '-181',
                filters: JSON.stringify(["$$$"]),
                foodFilters: JSON.stringify(["Fast Food"]),
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/find")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(503);
                    done();
                });
        });
    });

    describe("GET /api/places/photos", function() {
        /*
        it("should get an image normally", function(done) {
            const params = {
                photo_reference: "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU",
                maxwidth: 400,
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/photos")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res.headers["content-type"]).equals("image/jpeg");
                    done();
                });
        });

        it("should fail without photo_reference", function(done) {
            const params = {
                maxwidth: 400,
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/photos")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(400);
                    done();
                });
        });

        it("should fail without maxwidth", function(done) {
            const params = {
                photo_reference: "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU",
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/photos")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(503);
                    done();
                });
        });
        
        it("should fail with invalid photo_reference", function(done) {
            const params = {
                photo_reference: "🥝",
                maxwidth: 400,
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/photos")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(503);
                    done();
                });
        });
        
        it("should fail with invalid maxwidth", function(done) {
            const params = {
                photo_reference: "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU",
                maxwidth: "🥝",
            };

            // Register a user
            chai
                .request(app)
                .get("/api/places/photos")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(503);
                    done();
                });
        });
        */
    });
});

// Test the restaurant controller
describe("Restaurant Controller", function() {
    /*
    describe("POST /api/addRestaurant", function() {
        it("should add a restaurant normally", function(done) {
            const params = {
                place_id: restaurant_data.place_id,
                name: restaurant_data.name,
                address: restaurant_data.vicinity,
                phonenumber: "+1 908-8675-309",
                price: "$",
                cuisine: "italian",
            };

            chai
                .request(app)
                .post("/api/addRestaurant")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(false);
                    done();
                });
        });
        
        it("should fail to add a duplicate", function(done) {
            const params = {
                place_id: restaurant_data.place_id,
                name: restaurant_data.name,
                address: restaurant_data.vicinity,
                phonenumber: "+1 908-8675-309",
                price: "$",
                cuisine: "italian",
            };

            chai
                .request(app)
                .post("/api/addRestaurant")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
        
        it("should fail to add without place_id", function(done) {
            const params = {
                name: restaurant_data.name,
                address: restaurant_data.vicinity,
                phonenumber: "+1 908-8675-309",
                price: "$",
                cuisine: "italian",
            };

            chai
                .request(app)
                .post("/api/addRestaurant")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
        
        it("should fail with invalid place_id", function(done) {
            const params = {
                place_id: test_place_ids[0],
                name: restaurant_data.name,
                address: restaurant_data.vicinity,
                phonenumber: "+1 908-8675-309",
                price: "$",
                cuisine: "italian",
            };

            chai
                .request(app)
                .post("/api/addRestaurant")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
    });
    */
});

// Test the comments controller
describe("Comment Controller", function() {
    describe("POST /api/addParentComment", function() {
        it("should post a parent comment", function(done) {
            const params = {
                poster: login_data.userName,
                restaurant: restaurant_data.name,
                content: "Comment 0"
            };

            chai
                .request(app)
                .post("/api/addParentComment")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(false);
                    parent_comment_data = res.body;
                    done();
                });
        });
        
        it("should post a duplicate", function(done) {
            const params = {
                poster: login_data.userName,
                restaurant: restaurant_data.name,
                content: "Comment 0"
            };

            chai
                .request(app)
                .post("/api/addParentComment")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(false);
                    done();
                });
        });
        
        it("should fail without poster", function(done) {
            const params = {
                restaurant: restaurant_data.name,
                content: "Comment 0"
            };

            chai
                .request(app)
                .post("/api/addParentComment")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
        
        it("should fail without comment", function(done) {
            const params = {
                poster: login_data.userName,
                restaurant: restaurant_data.name,
                content: "Comment 0"
            };

            chai
                .request(app)
                .post("/api/addParentComment")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
        
        it("should fail with invalid poster", function(done) {
            const params = {
                poster: test_comment_posters[1],
                restaurant: restaurant_data.name,
                content: "Comment 0"
            };

            chai
                .request(app)
                .post("/api/addParentComment")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    parent_comment_data = res.body;
                    done();
                });
        });

        it("should fail with an invalid restaurant", function(done) {
            const params = {
                poster: login_data.userName,
                restaurant: "🥝",
                content: "Comment 0"
            };

            chai
                .request(app)
                .post("/api/addParentComment")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .send(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
    });
    
    describe("GET /api/findComments", function() {
        it("should get comments normally", function(done) {
            const params = {
                poster: login_data.userName,
            };

            chai
                .request(app)
                .get("/api/findComments")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).not.ownProperty("error");
                    chai.expect(res.body).ownProperty("data");
                    chai.expect(res.body.data).an("array");
                    chai.expect(res.body.data).not.empty;
                    done();
                });
        });
        
        it("should get fail without poster", function(done) {
            const params = {};

            chai
                .request(app)
                .get("/api/findComments")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).ownProperty("error");
                    chai.expect(res.body.error).equal(true);
                    done();
                });
        });
        
        it("should get no comments with poster that has no comments", function(done) {
            const params = {
                poster: test_comment_posters[1],
            };

            chai
                .request(app)
                .get("/api/findComments")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).not.ownProperty("error");
                    done();
                });
        });
        
        it("should get no comments with invalid poster", function(done) {
            const params = {
                poster: test_comment_posters[1],
            };

            chai
                .request(app)
                .get("/api/findComments")
                .set("email", login_data.email)
                .set("Authorization", `Bearer ${login_data.token}`)
                .query(params)
                .end(function(err, res) {
                    chai.expect(res).status(200);
                    chai.expect(res).ownProperty("body");
                    chai.expect(res.body).not.ownProperty("error");
                    done();
                });
        });
    });
});