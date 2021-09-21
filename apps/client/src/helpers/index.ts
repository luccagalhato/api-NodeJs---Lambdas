export const handleAddressComponentsToDelivery = (
  address_components: any[],
) => {
  let street;
  let district;
  let city;
  let state;
  let country;
  let number;
  let postal_code;

  address_components.forEach(item => {
    if (item.types.some(item => item === 'street_number'))
      return (number = parseInt(item.long_name));
    if (item.types.some(item => item === 'sublocality_level_1'))
      return (district = item.long_name);
    if (item.types.some(item => item === 'route'))
      return (street = item.long_name);
    if (item.types.some(item => item === 'administrative_area_level_2'))
      return (city = item.long_name);
    if (item.types.some(item => item === 'administrative_area_level_1'))
      return (state = item.long_name);
    if (item.types.some(item => item === 'country'))
      return (country = item.long_name);
    if (item.types.some(item => item === 'postal_code'))
      return (postal_code = item.long_name);
  });

  return {
    postal_code,
    city,
    street,
    district,
    state,
    country,
    number,
  };
};
