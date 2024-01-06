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
  // console.log('user signout called');
  return new Promise(async (resolve) => {
    // TODO: on server we will remove user session info.
    resolve({ data: "success" });
  });
}

// this is for mail sent api.. jisse server ki taraf se user ko mail jayega.. aur user ki taraf se server ko yaha se request jayegi..
export function resetPasswordRequest(email) {
  // console.log(email);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/reset-password-request", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "content-type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        resolve({ data });
      } else {
        console.log("Response is not ok.");
        const error = await response.text;
        reject(error);
      }
    } catch (err) {
      console.log("Error occur in forgot-password: ", err.message);
      reject(err);
    }
  });
}

// this is for change password api... ye user ka naya password leke server ko jayega aur server fir use database me jakar replace kar dega purane password se..
export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`/auth/reset-password`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        resolve(data);
      } else {
        const error = await response.text;
        reject(error);
      }
    } catch (err) {
      console.log("Error occur in change your password: ", err.message);
      reject(err);
    }
  });
}
