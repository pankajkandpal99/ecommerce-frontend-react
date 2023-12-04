// ye 2 functions hain jo products ko json-server se fetch kar rahe hain... fetchAllProducts() function sabhi products ko fetch karta hai aur dusra function fetchProductsByFilters(filter, sort) filters aur sort ke basis par products ko fetch karta hai 

export function fetchAllProducts() {
  // TODO: we will not hard-code server URL here...
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/products");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchProductsByFilters(filter, sort) {
  // filter = {"category" : ["smartphone", "laptop"]}        // aane wala data kuchh iss tarah ka hoga..
  // sort = { _sort: "price", _order="desc"}
  // TODO: on server we will support multi values 
  let queryString = '';
  for(let key in filter){            // ye loop filter object me iterate karne ke liye hai. jo ki ProductList.js file ke andar userEffect se dispatch ho rah hai... jisme ki 'filter' object ke har key(jisme array me values stored hain) ke liye loop chalaya ja ra hai. jaise ki hamare filter object me kewal 2 hi keys hain -> Category and Brands.. har ek key me array me uski values stored hain jisme ki ye loop chalaya ja ra hai.. sample filter object ye hai -> filter = {category: ["smartphones", "laptops", "skincare"],  brand: ["Apple", "Samsung", "Dell", "hp", "facewash", "cream"]}.....
    const categoryValues = filter[key];     // ye user per depend karta hai ki usne filter object me kon si key me click kiya hai. fir uske baad 'filter' object mein current key ke sath associated values ka array lein. kyuki humne filter[key] kiya hai to hame uss key ki sari values mil jayengi jo ki ek array hai... to hame wo poora array mil jayega..
    if(categoryValues.length){              // agar array khali nahi hai.
      const lastCategoryValue = categoryValues[categoryValues.length-1];       // to fir hame uss array ka last element return kar diya jayega..
      queryString += `${key}=${lastCategoryValue}&`;                     // ye url me set hoga like this... localhost:3000/products?category=laptops....  isme category=laptops queryStrings me add karne per aayega....aur last me amphersant(&) isliye diya gaya hai kyuki ek se jyada category or filters ko ye handle kar sake.... isme category="laptops" uss returned array ka wo last element hai jo humne upper select kiya tha.. isme kewal last selected element hi queryString me add hoga jo ki url pe set hoga aur json-server se backend se data fetch karke layega...
    // console.log(queryString);
    }
  }

  for(let key in sort) {         // ye loop iss example me chalaya jayega jo user ke dwara hit kiya gaya hai --> sort = {_sort: 'price', _order: 'asc'}
    queryString += `${key}=${sort[key]}&`;          // queryString kuchh aisi ho jayegi --> _sort=price&_order=desc&
    // console.log(queryString);
  }

  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/products?${queryString}`);
    const data = await response.json();
    resolve({ data });
  });
}
