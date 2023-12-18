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
    console.log(data);       // ye data mujhe array ke form me milega isliye isme se direct data.id access nahi ki ja sakti. agar hame har item me se id extract  karni hai to hame usme for-od loop chalana hoga jo ki array ke har ek item per chalega..
    resolve({ data });
  });
}

export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/cart/" + update.id, {
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
    const response = await fetch("http://localhost:8080/cart/" + itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    // console.log(data);
    resolve({ data: { id: itemId } }); // yaha se deleteItemFromCartAsync iss function ko jisne ise call kiya hai cart ke item ko delete karne ke liye use response me itemId di ja ri hai jise wo delete kar dega.
  });
}

export function resetCart(userId) {
  // console.log(userId);        // here we got userId
  // get all items of user's cart and then delete each.
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId(userId);
    const items = response.data; // loggedInUser ke cart me add kiye hue sare items yaha aa jayenge.
    // console.log(items);

    for (let item of items) {
      // console.log(item.id);
      const deletedItem = await deleteItemFromCart(item?.id); // isse kewal redux ki state se data delete ho ra hai database se nahi.
      console.log(deletedItem);
    }

    resolve({ status: "success" });
  });
}
