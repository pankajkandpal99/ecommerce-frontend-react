// ye post request data.json file me jayegi. jisme hum backend ka server chala rahe hain temporary.
export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // console.log(data);
    //  TODO: on server it will only return relevant info of user (not password).
    resolve({ data });
  });
}

export function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    const email = loginInfo.email;
    const password = loginInfo.password;

    const response = await fetch("http://localhost:8080/users?email=" + email);
    const data = await response.json();
    // console.log({ data });
    if (data.length) {
      if (password === data[0].password) {
        resolve({ data: data[0] }); // hame data array return hoga jisme har object me user ka email aur password store hoga. aur ye data.jso se aa raha hai.
      } else {
        reject({ message: "wrong credentials" });
      }
    } else {
      reject({ message: "user not found" });
    }
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    console.log(update);
    const response = await fetch(`http://localhost:8080/users/${update.id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    // TODO: on server it will only return some info of user(not password).
    resolve({ data });
  });
}
