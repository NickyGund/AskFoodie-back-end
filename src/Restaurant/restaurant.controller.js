import Restaurant from "./restaurant.schema.js";
import {addRestaurantValidation} from "./restaurant.validation.js"


// create new restaurant 
export const addRestaurant = async (restaurant_data) => {
    try{
<<<<<<< HEAD
    const restaurant = await Restaurant.create(req.body)
    res.json({error: false, data: restaurant.toJSON()})
}
catch(e){
    res.json({error: true, data: e})
}
=======
        const {error} = addRestaurantValidation(restaurant_data)
        if(error) {
            throw(error)
        }

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
>>>>>>> f14edd8b972012bd5876b594c82981c5ac5d253b
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