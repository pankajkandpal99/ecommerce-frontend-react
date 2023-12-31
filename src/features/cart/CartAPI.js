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
    console.log(data);
    resolve({ data });
  });
};

// Ye function batayega ki kis user ne kon sa item cart me add kiya hai... isme id ki koi jarurat ni hai kyuki server khud bata dega ki kon sa user loggedIn hai yaha se koi id send karne ki jarurat ni hai... backend me de-serialization yahi kaam kar raha hai ki wo session me se stored id ko retrieve karke req.user me daal ra hai jisse database me uss userId jo ki req.user me aayi hai usse data fetch hoga.
export function fetchItemsByUserId() {
  return new Promise(async (resolve) => {
    //TODO: we will not hard-code server URL here
    const response = await fetch("http://localhost:8080/cart");  
    const data = await response.json();
    console.log(data); 
    resolve({ data });
  });
}

export function updateCart(update) {
  // console.log(update);
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

export function resetCart() {              // get all items of user's cart and then delete each.
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId();
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
