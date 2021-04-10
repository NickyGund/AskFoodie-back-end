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
