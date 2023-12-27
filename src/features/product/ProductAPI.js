// ye 2 functions hain jo products ko json-server se fetch kar rahe hain... fetchAllProducts() function sabhi products ko fetch karta hai aur dusra function fetchProductsByFilters(filter, sort) filters aur sort ke basis par products ko fetch karta hai

export function createProduct(product) {
  console.log(product);
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/products/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(product),
    });

    const data = await response.json();
    console.log(data);
    resolve({ data });
  });
}

// for get products from database..
export function fetchProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/products/${id}`);
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductsByFilters(filter, sort, pagination, admin) {
  // filter = {"category" : ["smartphone", "laptop"]}        // aane wala data kuchh iss tarah ka hoga..
  // sort = { _sort: "price", _order="desc"}
  // pagination = {_page: 1, _limit=10}
  // TODO: on server we will support multi values
  // TODO: Server will filter deletedd products in case of non-admin

  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key]; // ye user per depend karta hai ki usne filter object me kon si key me click kiya hai. fir uske baad 'filter' object mein current key ke sath associated values ka array lein. kyuki humne filter[key] kiya hai to hame uss key ki sari values mil jayengi jo ki ek array hai... to hame wo poora array mil jayega..
    if (categoryValues.length) {
      const lastCategoryValue = categoryValues[categoryValues.length - 1]; // to fir hame uss array ka last element return kar diya jayega..
      queryString += `${key}=${lastCategoryValue}&`; // http://localhost:3000/products?category=laptops....  isme category=laptops queryStrings me add karne per aayega....aur last me amphersant(&) isliye diya gaya hai kyuki ek se jyada category or filters ko ye handle kar sake.... isme category="laptops" uss returned array ka wo last element hai jo humne upper select kiya tha.. isme kewal last selected element hi queryString me add hoga jo ki url pe set hoga aur json-server se backend se data fetch karke layega...
      // console.log(queryString);
    }
  }

  for (let key in sort) {
    //  --> sort = {_sort: 'price', _order: 'asc'}
    queryString += `${key}=${sort[key]}&`; // queryString kuchh aisi ho jayegi --> _sort=price&_order=desc& --> ye aise URL me add ho jayega..
    // console.log(queryString);
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`; // queryString kuchh aisi ho jayegi --> _page=1&_limit=10 -> ye aise URL me add ho jayega..
    // console.log(queryString);
  }

  if (admin) {
    queryString += `admin=true`;
  }

  return new Promise(async (resolve) => {
    const response = await fetch(
      `http://localhost:8080/products?${queryString}`
    );
    const data = await response.json();
    const totalItems = await response.headers.get("X-Total-Count"); // ye 'X-Total-Count' hame json-server hi deta hai response me jo ki ye batata hai ki kitne products abhi available hain.
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/categories");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/brands");
    const data = await response.json();
    resolve({ data });
  });
}

// update the product
export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      `http://localhost:8080/products/${update.id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(update),
      }
    );

    const data = await response.json();
    console.log(data);
    resolve({ data });
  });
}
