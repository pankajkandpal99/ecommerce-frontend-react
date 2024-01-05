export const addToCart = (item) => {
  return new Promise(async (resolve) => {
    const response = await fetch("/cart", {
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

export function fetchItemsByUserId() {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("/cart");  
    const data = await response.json();
    // console.log(data); 
    resolve({ data });
  });
}

export function updateCart(update) {
  // console.log(update);
  return new Promise(async (resolve) => {
    const response = await fetch("/cart/" + update.id, {
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
    const response = await fetch("/cart/" + itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });

    await response.json();
    // console.log(data);
    resolve({ data: { id: itemId } }); // yaha se deleteItemFromCartAsync iss function ko jisne ise call kiya hai cart ke item ko delete karne ke liye use response me itemId di ja ri hai jise wo delete kar dega.
  });
}

export function resetCart() {              // get all items of user's cart and then delete each.
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId();
    const items = response.data; 
    console.log(items);

    for (let item of items) {
      const deletedItem = await deleteItemFromCart(item.id); 
      console.log(deletedItem);
    }

    resolve({ status: "success" });
  });
}
