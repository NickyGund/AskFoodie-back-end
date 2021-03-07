import axios from "axios";

const outputType = "json";

const getPlaceFromTextURL = "https://maps.googleapis.com/maps/api/place/findplacefromtext";
const inputtype = "textquery";
const findFields = "name,place_id,formatted_address";

const getPlaceDetailsURL = "https://maps.googleapis.com/maps/api/place/details";
const infoFields = "name,icon,formatted_address,url,formatted_phone_number,website";

// Finds a nearby place given a query
export async function find(req, res) {
    var textQuery;
    if ("textQuery" in req.query) {
        textQuery = req.query.textQuery;
    } else {
        console.log("You forgot your textQuery");
        return res.status(400).send("You forgot your textQuery.");
    }

    var placeDataRequest;
    try {
        // requests a place with the text query from google maps
        placeDataRequest = await axios({
            method: "get",
            url: `${getPlaceFromTextURL}/${outputType}`,
            params: {
                key: process.env.GOOGLE_API_KEY,
                inputtype: inputtype,
                input: textQuery,
                fields: findFields
            }
        });
        
        /* this is an example of the response format
        placeDataRequest = {
            data: {
                candidates: [
                    {
                        formatted_address: '6 Easton Ave, New Brunswick, NJ 08901, United States',
                        name: 'Vivi Bubble Tea/KBG',
                        place_id: 'ChIJ_UDANVHGw4kRyF7OUJ3Uxrw'
                    }
                ]
            }
        };*/
    } catch(error) {
        console.log(`Failed to get a place from Google API: ${error}`);
        return res.status(503).send(`Server failed to get a place from Google API: ${error}`);
    }

    console.log("Successfully got a place from google maps");
    console.log(JSON.stringify(placeDataRequest.data.candidates));

    return res.send(JSON.stringify(placeDataRequest.data.candidates));
}

// Gets the details of a place
export async function getInfo(req, res) {
    var place_id = "PLACE_ID";
    var url = `${getPlaceDetailsURL}/${outputType}?key=${process.env.GOOGLE_API_KEY}&place_id=${place_id}&fields=${infoFields}`;
    console.log(req.query);

    return res.send("ok");
}