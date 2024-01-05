// ye post request data.json file me jayegi. jisme hum backend ka server chala rahe hain temporary.
export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("/auth/signup", {
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

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log( data );
        resolve({ data });
      } else {
        const error = await response.text();
        console.log(error.message);
        return reject(error);
      }
    } catch (error) {
      console.log("Error occur while login --> ", error.message);
      reject(error);
    }
  });
}

export function checkAuth() {
  // console.log("request comes");
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/check");
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }

    // TODO: on server it will only return some info of user (not password)
  });
}

export function signOut() {
  console.log();
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info.
    resolve({ data: "success" });
  });
}
