import Restaurant from "./restaurant.schema.js";


// create new restaurant 

export const addRestaurant = async (req, res) => {
    console.log(req.body)  
    try{

    const restaurant = await Restaurant.create(req.body)
    res.json({error: false, data: restaurant.toJSON()})
}
catch(e){
    res.json({error: true, data: e})
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
