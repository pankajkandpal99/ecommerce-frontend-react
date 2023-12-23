export function createOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/orders", {
      method: "POST",
      body: JSON.stringify(order),
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    resolve({ data });
  });
}

export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8080/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify(order),
      headers: { "content-type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    resolve({ data });
  });
}

// ye api server json-server se sara orders fetch karke layegi. isme sort aur pagination bhi add kiya gaya hai jisse database se hame milne wala data page aur sorted form me mile.
export function fetchAllOrders(sort, pagination) {
  // filter = {"category" : ["smartphone", "laptop"]}        // aane wala data kuchh iss tarah ka hoga..
  // sort = { _sort: "price", _order="desc"}
  // pagination = {_page: 1, _limit=10}
  // TODO: on server we will support multi values

  let queryString = "";
  for (let key in pagination) {        // isme pagination ek objetc ke form me isliye aa ra hai kyuki json-server se hame agar pagination ke liye data chiye to hame usme key-value ke form me usse data mangna padega jisme ki page ke liye key hogi - '_page' aur limit ki key hogi - '_limit'.. hum ise array ke base per nahi de sakte kyuki array me indexing based data iterate hota hai jisme ki key hamesa index hoti hai. jabki json-server ko key ke roop me _page and _limit chiye na ki index.
    queryString += `${key}=${pagination[key]}&`;     // // jaise hi /admin/orders/ page render hoga to useeffetc chalega aur jab useEffect chalega to wo ek action dispatch karega jo ki ye function hoga fetchAllOrdersAsync({ sort, pagination }) --> iss function ko handle karne ka kaam orderSlice karega jo ki fetchAllOrders() function ko call karea jo ki iss page me defined hai, yahi wo function hai jo json-server se data fetch karke layega all orders ka pagination ke hisab se aur sorting ke base pe. admin page ke render hone baad se sorting apply kar sakta hai, page jab render hoga to usme sorting apply nahi hogi, sorting baad me apply hogi jab admin table ke uss heading per click karega jisme sorting ka logic likha hua hai. first me ye function pagination ke hisab se data fetch karke layega. jab admin sort karke data ko acess karne chahega tab dobara se useEffect chalega aur fir jo data aayega wo sorting ke base per aayega. kyuki uss time queryString change ho jayegi..
    console.log(queryString);   // _page=1&_limit=10&  -> ye pagination ka data layega ki ek page me kitne data load hone chiye.
  }

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;    // isme key wo hogi jo sort object me available hogi... jab koi cheej sort karte hain to usme useEffect se pagination ka data bhi aayega.. ki kon se page me sort karna hai...
    console.log(queryString);   // _sort=&_order='asc'
  }

  return new Promise(async (resolve) => {
    // TODO: we will not hard-code server url here...
    const response = await fetch("http://localhost:8080/orders?" + queryString);

    const data = await response.json();
    // console.log(data);
    const totalOrders = await response.headers.get("X-Total-Count");
    resolve({ data: { orders: data, totalOrders: +totalOrders } });
  });
}
