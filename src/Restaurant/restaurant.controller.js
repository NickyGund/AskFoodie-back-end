import Restaurant from "./restaurant.schema.js";

// create new restaurant 
export const addRestaurant = async (restaurant_data) => {
    try{
        await Restaurant.updateOne(
            {
                "place_id": restaurant_data.place_id
            },
            restaurant_data,
            {
                upsert: true
            }
        );
    } catch(e) {
        throw(e)
    }
}

export const findRestaurant = async (req, res) => {
    var restaurantRequest;
    console.log(req.body)
    try{
        restaurantRequest = await Restaurant.find({});
        console.log(restaurantRequest)
        return res.json({data:restaurantRequest});
    }catch(error){
        console.log(`Failed to get restaurants from the backend: ${error}`);  
        res.json({error: true, data: error})
    }
}
