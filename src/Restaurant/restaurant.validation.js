import Joi from "@hapi/joi";

export const addRestaurantValidation = (data) => {
  const schema = Joi.object({
    place_id: Joi.string().required(),
    name: Joi.string(),
    address: Joi.string(),
    phonenumber: Joi.string(),
    price: Joi.string(),
    cuisine: Joi.string(),
    rating: Joi.string(),
  });
  return schema.validate(data);
};
