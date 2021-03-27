import axios from "axios";
import User from "./../User/user.schema.js";

const outputType = "json";

const nearbysearchURL = "https://maps.googleapis.com/maps/api/place/nearbysearch";

const getPlaceDetailsURL = "https://maps.googleapis.com/maps/api/place/details";
const infoFields = "name,icon,formatted_address,url,formatted_phone_number,website";

const getLonLatURL = "http://ip-api.com/json/";
const getMyIpURL = "http://ipv4bot.whatismyipaddress.com"

/*
    {
        filters: [ '$', 'Under 5 km', '$$', 'Under 10 km', 'Takeout', 'Dine In' ],
        foodFilters: [ 'Burgers', 'Japanese', 'Healthy', 'Dessert' ]
    }
*/

function getKeyword(foodFilters, profileInfo) {
    if (foodFilters.length > 1) {
        var foodTypes = `${foodFilters[0]}`
        for (var index = 1; index < foodFilters.length; index++) {
            var filterItem = foodFilters[index];
            foodTypes += ` OR ${filterItem}`;
        }
        return `${foodTypes}`;
    } else if (foodFilters.length == 1) {
        return `${foodFilters[0]}`
    }

    if (("foodTypes" in profileInfo) && (profileInfo.foodTypes.length > 0)) {
        var foodTypes = profileInfo.foodTypes.join(" OR ");
        return `${foodTypes}`;
    } else {
        return undefined;
    }
}

async function getLatLon(ip) {
    // requests location with the client's ip address
    var locationData = await axios({
        method: "get",
        url: `${getLonLatURL}/${ip}`
    });
    locationData = locationData.data;

    if (locationData.status == "success") {
        return `${locationData.lat}, ${locationData.lon}`;
    } else {
        if (locationData.message == "private range") { // If we're using a localhost, recurse using the server's ip
            console.log("We're using LAN, so getting the server's ip:");
            var ip = await axios({
                method: "get",
                url: getMyIpURL
            });
            return await getLatLon(ip.data);
        } else {
            throw(locationData.message);
        }
    }
}

function getPrice(filters, profileInfo) {
    // Note 0 is least expensive, 4 is most
    // Front-end sends '$', '$$', and/or '$$$'
    var min = 4;
    var max = 0;
    for (var index = 0; index < filters.length; index++) {
        var filterItem = filters[index]
        if (filterItem == "$") {
            if (min > 0) min = 0; // If min is higher than 0, lower it to 0
            if (max < 1) max = 1 // If max is lower than 1, raise it to 1
        } else if (filterItem == "$$") {
            if (min > 2) min = 2;
            if (max < 3) max = 3;
        } else if (filterItem == "$$$") {
            if (min > 4) min = 4;
            if (max < 4) max = 4;
        }
    }

    if (min <= max) { // If price has been specified in filters
        return [min, max]
    }

    if ("price" in profileInfo) { // If min price has been specified in profile info
        if (profileInfo.price == "none") {
            return undefined;
        } else {
            return [profileInfo.price.length - 1, 4];
        }
    } else {
        return undefined;
    }
}

function getRadius(filters, profileInfo) {
    var distance = 50000;
    for (var index = 0; index < filters.length; index++) {
        var filterItem = filters[index]
        if (filterItem == "Under 5 km") {
            if (distance > 5000) distance = 5000;
        } else if (filterItem == "Under 10 km") {
            if (distance > 10000) distance = 10000;
        } else if (filterItem == "Under 20 km") {
            if (distance > 20000) distance = 20000;
        }
    }
    return distance;
    /*
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
    */
}

function getParams(location, radius, keyword, price) {
    var params = {};

    params.key = process.env.GOOGLE_API_KEY;
    params.location = location;
    params.radius = radius;
    params.type = "restaurant";

    if (keyword != undefined)
        params.keyword = keyword;

    if (price != undefined) {
        params.minprice = price[0];
        params.maxprice = price[1];
    }

    return params;
}

// Finds a nearby place given a query
export async function find(req, res) {
    var user = await User.findOne({ email: req.headers.email })

    var latlon;
    try {
        latlon = await getLatLon(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    } catch(error) {
        console.log(`Failed to get a location from Client IP: ${error}`);
        return res.status(503).send(`Server failed to get a location from Client IP: ${error}`);
    }

    if (!( ("filters" in req.query) || ("foodFilters" in req.query) )) {
        console.log(`Failed to get a location from Client IP: ${error}`);
        return res.status(503).send(`Server failed to get a location from Client IP: ${error}`);
    }
    
    // Get filters and foodFilters from query
    var filters = JSON.parse(req.query.filters);
    var foodFilters = JSON.parse(req.query.foodFilters);

    var radius = getRadius(filters, user.profileInfo);
    var keyword = getKeyword(foodFilters, user.profileInfo)
    var price = getPrice(filters, user.profileInfo);

    var params = getParams(latlon, radius, keyword, price);
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
                        place_id: 'ChIJ_UDANVHGw4kRyF7OUJ3Uxrw'
                    }
                ],
                status: "OK"
            }
        };

        // requests a place with the text query from google maps
        placeDataRequest = await axios({
            method: "get",
            url: `${nearbysearchURL}/${outputType}`,
            params: params
        });
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

// Gets the details of a place
export async function getInfo(req, res) {
    var place_id = "PLACE_ID";
    var url = `${getPlaceDetailsURL}/${outputType}?key=${process.env.GOOGLE_API_KEY}&place_id=${place_id}&fields=${infoFields}`;
    console.log(req.query);

    return res.send("ok");
}