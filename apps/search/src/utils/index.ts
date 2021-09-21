function stringifyJSON(data: any) {
  return JSON.stringify(data);
}

function transformToCategory(data: any) {
  try {
    const { id, name, department, icon_url, createdAt, updatedAt } = data;
    return {
      id: id ? id.S : undefined,
      name: name ? name.S : undefined,
      department: department ? department.S : undefined,
      icon_url: icon_url ? icon_url.S : undefined,
      createdAt: createdAt ? Number(createdAt.N) : undefined,
      updatedAt: updatedAt ? Number(updatedAt.N) : undefined,
    };
  } catch (error) {
    throw error;
  }
}

function transformToProduct(data: any) {
  try {
    const { sku, name, price, visible, image_url, description, partner_id, tags, createdAt, updatedAt } = data;
    return {
      sku: sku ? sku.S : undefined,
      name: name ? name.S : undefined,
      description: description ? description.S : undefined,
      image_url: image_url ? image_url.S : undefined,
      partner_id: partner_id ? partner_id.S : undefined,
      visible: visible ? visible.BOOL : undefined,
      price: price ? Number(price.N) : undefined,
      tags: transformToProductTags(tags),
      createdAt: createdAt ? Number(createdAt.N) : undefined,
      updatedAt: updatedAt ? Number(updatedAt.N) : undefined,
    };
  } catch (error) {
    throw error;
  }
}

function transformToProductTags(data: any): any[] {
  if (!data.L) return [];
  return data.L.map((item: any) => {
    return item ? item.S : undefined;
  });
}

function transformToPartner(data: any) {
  try {
    const {
      id,
      name,
      description,
      email,
      categories,
      contact,
      end_time,
      is_online,
      location,
      open_time,
      radius,
      status,
      logo_url,
      banner_url,
      createdAt,
      updatedAt,
    } = data;
    return {
      id: id ? id.S : undefined,
      name: name ? name.S : undefined,
      description: description ? description.S : undefined,
      email: email ? email.S : undefined,
      logo_url: logo_url ? logo_url.S : undefined,
      banner_url: banner_url ? banner_url.S : undefined,
      open_time: open_time ? Number(open_time.N) : undefined,
      end_time: end_time ? Number(end_time.N) : undefined,
      radius: radius ? Number(radius.N) : undefined,
      is_online: is_online ? is_online.BOOL : undefined,
      status: status ? status.S : undefined,
      createdAt: createdAt ? Number(createdAt.N) : undefined,
      updatedAt: updatedAt ? Number(updatedAt.N) : undefined,
      categories: transformToPartnerCategories(categories),
      contact: contact ? transformToPartnerContact(contact) : undefined,
      location: location ? transformToPartnerLocation(location) : undefined,
    };
  } catch (error) {
    throw error;
  }
}

function transformToPartnerCategories(data: any): any[] {
  if (!data.L) return [];
  return data.L.map((item: any) => {
    return item ? item.S : undefined;
  });
}

function transformToPartnerContact(data: any): any {
  if (!data.M) return undefined;
  const { email, telephone } = data.M;
  return {
    email: email ? email.S : undefined,
    telephone: telephone ? telephone.S : undefined,
  };
}

function transformToPartnerLocation(data: any): any {
  if (!data.M) return undefined;
  const {
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    country,
    postal_code,
    latitude,
    longitude,
  } = data.M;
  return {
    street: street ? street.S : undefined,
    number: number ? number.S : undefined,
    complement: complement ? complement.S : undefined,
    neighborhood: neighborhood ? neighborhood.S : undefined,
    city: city ? city.S : undefined,
    state: state ? state.S : undefined,
    country: country ? country.S : undefined,
    postal_code: postal_code ? postal_code.S : undefined,
    latitude: latitude ? Number(latitude.N) : undefined,
    longitude: longitude ? Number(longitude.N) : undefined,
  };
}

export {
  stringifyJSON,
  transformToCategory,
  transformToProduct,
  transformToPartner,
};
