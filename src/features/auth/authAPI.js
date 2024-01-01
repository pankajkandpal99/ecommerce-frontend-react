// ye post request data.json file me jayegi. jisme hum backend ka server chala rahe hain temporary.
export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/auth/signup", {
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
      const response = await fetch("http://localhost:8080/auth/login", {
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
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/auth/check`);
    const data = await response.json();
    resolve({ data });
  });
}

export function signOut(userId) {
  console.log(userId);
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info.
    resolve({ data: "success" });
  });
}
