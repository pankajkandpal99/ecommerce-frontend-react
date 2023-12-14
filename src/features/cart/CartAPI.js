export const addToCart = (item) => {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    // console.log(data);
    resolve({ data });
  });
};

// Ye function batayega ki kis user ne kon sa item cart me add kiya hai...
export function fetchItemsByUserId(userId) {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("http://localhost:8080/cart?user=" + userId);
    const data = await response.json();
    // console.log(data);
    resolve({ data });
  });
}


export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/"+update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    // console.log(data);
    resolve({ data });
  });
}


export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/"+itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    // console.log(data);
    resolve({ data: { id: itemId} });       // yaha se deleteItemFromCartAsync iss function ko jisne ise call kiya hai cart ke item ko delete karne ke liye use response me itemId di ja ri hai jise wo delete kar dega.
  });
}
