export function fetchAllProducts() {
  // TODO: we will not hard-code server URL here...
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/products");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductsByFilters(filter) {
  // filter = {"category" : "smartphone"}        // aane wala data kuchh iss tarah ka hoga..
  // TODO: on server we will support multi values 
  let queryString = '';
  for(let key in filter){
    queryString += `${key}=${filter[key]}&`;         // ye url me set hoga like this... localhost:3000/products?category=laptops....  isme category=laptops queryStrings me add karne per aayega....aur last me amphersant(&) isliye diya gaya hai kyuki ek se jyada category or filters ko ye handle kar sake....
  }

  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/products?${queryString}`);
    const data = await response.json();
    resolve({ data });
  });
}
