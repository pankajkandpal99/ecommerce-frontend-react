export function fetchLoggedInUserOrders(userId) {         // ye loggedInUser uss user se related sari information fetch kar lega jaise ki addresses, ordres etc..
  console.log(userId);
  return new Promise(async (resolve) => {
    const response = await fetch(
      `http://localhost:8080/orders/?user=${userId}`
    );                                                    // iss api se jitne bhi orders uss users ke hain wo sare aapke paas aa jayenge.
    const data = await response.json();
    console.log(data);
    resolve({ data });
  });
}

export function fetchLoggedInUser(userId) {
  console.log(userId);
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/users/${userId}`);
    const data = response.json();
    console.log({ data });
    resolve({ data });
  });
}

// its for user which is edit himself profile...
export function updateUser(update) {
  console.log(update);
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/users/${update.id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    resolve({ data });
  });
}
