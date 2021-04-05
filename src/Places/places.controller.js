import axios from "axios";
import User from "./../User/user.schema.js";

const outputType = "json";

const nearbysearchURL = "https://maps.googleapis.com/maps/api/place/nearbysearch";

const getPlaceDetailsURL = "https://maps.googleapis.com/maps/api/place/details";
const infoFields = "name,icon,formatted_address,url,formatted_phone_number,website";

function getKeyword(profileInfo) {
    if (("foodTypes" in profileInfo) && (profileInfo.foodTypes.length > 0)) {
        var foodTypes = profileInfo.foodTypes.join(" OR ");
        return `${foodTypes}`;
    } else {
        return undefined;
    }
}

function getPrice(profileInfo) {
    // Note 0 is least expensive, 4 is most
    if ("price" in profileInfo) {
        if (profileInfo.price == "none") {
            return undefined;
        } else {
            return profileInfo.price.length - 1;
        }
    } else {
        return undefined;
    }
}

function getRadius(profileInfo) {
    // Max 50000 meters
    if ("distance" in profileInfo) {
        if (profileInfo.distance > 50) {
            profileInfo.distance = 50;
        } else if (profileInfo.distance < 0) {
            profileInfo.distance = 0;
        }

        if (profileInfo.distance == 0) {
            return 50000;
        } else {
            return profileInfo.distance * 1000;
        }
    } else {
        return 50000;
    }
}

function getParams(location, radius, keyword, minprice) {
    var params = {};

    params.key = process.env.GOOGLE_API_KEY;
    params.location = location;
    params.radius = radius;
    params.type = "restaurant";

    if (keyword != undefined)
        params.keyword = keyword;

    if (minprice != undefined) {
        params.minprice = minprice;
        params.maxprice = 4;
    }

    return params;
}

// Finds a nearby place given a query
export async function find(req, res) {
    // Get email from query
    if (!("email" in req.headers)) {
        console.log(`Failed to get a email from headers`);
        return res.status(400).send(`Failed to get email from headers`);
    }

    // Get user from email
    var user = await User.findOne({ email: req.headers.email })

    // Get location from query
    if (!("latitude" in req.query) || !("longitude" in req.query)) {
        console.log(`Failed to get a location from request`);
        return res.status(400).send(`Failed to get location from request`);
    }
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    if (isNaN(latitude) || isNaN(longitude)) {
        console.log(`Failed to get a location from request`);
        return res.status(400).send(`Failed to get location from request`);
    }

    /*
    // Get filters from query
    if (!("filters" in req.query) || !("foodFilters" in req.query)) {
        console.log(`Failed to get a location from request`);
        return res.status(400).send(`Failed to get location from request`);
    }
    var filters = req.query.filters;
    var foodFilters = req.query.foodFilters;

    if (isNaN(filters) || isNaN(foodFilters)) {
        console.log(`Failed to get a location from request`);
        return res.status(400).send(`Failed to get location from request`);
    }
    */

    var location = `${latitude}, ${longitude}`;
    var radius = getRadius(user.profileInfo);
    var keyword = getKeyword(user.profileInfo)
    var minprice = getPrice(user.profileInfo);

    var params = getParams(location, radius, keyword, minprice);
    console.log(params);

    var placeDataRequest;
    try {
        // this is an example of the response format
        placeDataRequest = {
            data: {
                results: [
                    {
                        vicinity: '6 Easton Ave, New Brunswick, NJ 08901, United States',
                        name: 'Vivi Bubble Tea/KBG',
                        place_id: 'ChIJ_UDANVHGw4kRyF7OUJ3Uxrw',
                        photos: [
                            {
                                height : 1260,
                                html_attributions : [ "From a Google User" ],
                                photo_reference : "CnRwAAAAeM-aLqAm573T44qnNe8bGMkr_BOh1MOVQaA9CCggqtTwuGD1rjsviMyueX_G4-mabgH41Vpr8L27sh-VfZZ8TNCI4FyBiGk0P4fPxjb5Z1LrBZScYzM1glRxR-YjeHd2PWVEqB9cKZB349QqQveJLRIQYKq2PNlOM0toJocR5b_oYRoUYIipdBjMfdUyJN4MZUmhCsTMQwg",
                                width : 1890
                            }
                        ],
                    }
                ],
                status: "OK"
            }
        };

        /*
        // requests a place with the text query from google maps
        placeDataRequest = await axios({
            method: "get",
            url: `${nearbysearchURL}/${outputType}`,
            params: params
        });*/
    } catch(error) {
        console.log(`Failed to get a place from Google API: ${error}`);
        return res.status(503).send(`Server failed to get a place from Google API: ${error}`);
    }

    console.log(placeDataRequest.data);

    if (placeDataRequest.data.status != "OK") {
        console.log(`Failed to get a place from Google API: ${placeDataRequest.data.status}`);
        return res.status(503).send(`Server failed to get a place from Google API: ${placeDataRequest.data.status}`);
    }

    return res.send(JSON.stringify(placeDataRequest.data.results));
}

// Gets photos given the photo_reference, and maxheight or maxwidth
export async function getPhoto(req, res) {
    // Get the photo_reference
    var photo_reference = req.query.photo_reference;
    if (photo_reference == undefined) {
        console.log(`Missing photo_reference`);
        return res.status(400).send(`Missing photo_reference`);
    }

    // Get maxwidth and/or maxheight
    var maxwidth = req.query.maxwidth;
    var maxheight = req.query.maxheight;

    // Get the image url
    var image_request;
    try {
        var params = {
            key : process.env.GOOGLE_API_KEY,
            photo_reference : photo_reference,
            maxheight : maxheight,
            maxwidth : maxwidth
        };

        // requests a place with the text query from google maps
        image_request = await axios({
            method: "get",
            responseType: "arraybuffer",
            url: getPhotoURL,
            params: params
        });
    } catch(error) {
        console.log(`Status: ${image_request.status}\nFailed to get a photo from Google API: ${error}`);
        return res.status(503).send(`Server failed to get a photo from Google API: ${error}`);
    }

    console.log("Sending image");
    res.set('Content-Type', image_request.headers["content-type"]);
    res.set('Content-Length', image_request.data.length);
    res.send(image_request.data);
}