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
