import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectBrands,
  selectCategories,
  selectTotalItems,
} from "../ProductSlice";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react"; // Dialog, Disclosure, aur Menu components, aapke UI mein modal dialogs, collapsible sections, aur dropdown menus banane mein madad karte hain. Ye components aksar accessibility guidelines ko bhi follow karte hain, jisse aapke UI ko users ke liye accessible banane mein help hoti hai. Jab aap kisi UI element ko show ya hide karte hain aur aap usme smooth transition chahte hain, tab aap Transition component ka istemal kar sakte hain. Iske through, aap element ke state changes ko handle kar sakte hain, jaise ki jab aap ek dropdown open ya close karte hain.
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";


const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  { name: "Price: Low to High", sort: "price", order: "asc", current: false },
  { name: "Price: High to Low", sort: "price", order: "desc", current: false },
];



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  // iss component to HomePage ke andar '/' route per call kiya ja ra hai ...
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [page, setPage] = useState(1);           // page ki starting value 1 se start hogi.

  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories
    },
  
    {
      id: "brand",
      name: "Brands",
      options: brands
    },
  ];

  const handleFilter = (event, section, option) => {
    // console.log(event.target.checked);     // ye filter karte time checked/unchecked karne ke liye hai ...
    let newFilter = { ...filter };
    // TODO : on server it will support multiple categories..
    if (event.target.checked) {                  // iske andar ka code tab execute hoga jab user checkbox per check karega...
      if (newFilter[section.id]) {               // ye condition check karti hai ki kon se section per use dwara click kiya gaya hai. agar user wo section per click karta hai jis per wo ek baar click kar chuka hai to if ke andar ka code execute hoga aur uske existing newFilter object me option ki value ko update karega... section ka matlab hai ki 'Category aur Brands'... aur Option wo object hai jiske andar Category aur Brands ki details hain. option upper filter array me already defined hain..
        newFilter[section.id].push(option.value); // Suppose aapne pehle "Category" mein "smartphones" ko select kiya, to newFilter aise dikhega: newFilter = { newFilter =  category: ["smartphones"]} .... Phir aapne "Brands" mein "Apple" aur "Samsung" ko select kiya, to newFilter update hoga: {category: ["smartphones"], brand: ["Apple", "Samsung"]}. Is tarah se, newFilter multiple checkboxes ke values ko track karega aur aapko saare selected filters ka ek snapshot provide karega.
      } else {                                       // agar user pehle brand per click karta hai aur fir category wale section per click karta hai to iska matlab hai ki newFiler jo ki existing section aur uski values ko object me store karta hai(section.id ke sath) uske andar 'section.id' nahi hai... agr aisa hai to else ke andar ka code execute hoga aur jisme wo newFilter object ke andar user dwara select ki gayi section ki id ko store karega aur uske saath uski value ko bhi array ke andar put karega...
        newFilter[section.id] = [option.value];
      }
    } else {                                         // check karne ke baad uncheck karne per ye code execute hoga...
      const index = newFilter[section.id].findIndex(
        (el) => el === option.value
      );                                             // ye index find karne ka kaam newFilter object ke andar hoga jisme ki section ki id metioned hain jaise ki category aur Brands... fir usme existing array me wo find karega ki uss existing array me aisa kon sa index hai jiski value option ki value se match hoti hai ... fir index milne use index naam ke variable me stre kar diya jayega aur fir iske neeche wali line execute ho jayegi jo ki uss array me existing index jiski value option ki value se match karti hogi usko delete kar diya jayega splice method se... isme existing element ko jo ki newFilter oject ke andar section.id ke array me available hai use option.value se isliye compare kiya gaya hai kuki wo checkbox jisper hum click aur unclick karenge wo aur label dono ek hi div me hain, aur uss div ki id option.value di gayi hai....
      newFilter[section.id].splice(index, 1);        // for delete the unchecked category(I've only 2 sections -> category and Brands)... i mean ki kisi category ko checked karne ke baad unchecked karne per use delete kar diya jayega...
    }

    console.log({ newFilter });
    setFilter(newFilter);
  };

  const handleSort = (event, option) => {                        // Selected sorting option ke basis pe sort object neeche banaya jaa raha hai
    const sort = { _sort: option.sort, _order: option.order }; // dummy.json file ka ye method hai ki usme sort karne ke liye '?_sort:value' di jati hai... isme sort object ke andar jab hum sort karte hain sort and order ke basis per to key ke aage underscore diya hua hai jo ki compulsary hai kyuki hum avi json-server se data leke aa re hain jo ki ye strictly mention karta hai ki key ke aage se underscore hona hi chiye sorting ke time.... agar hum underscore nahi lagate hain to data fetch nahi ho payega server se...
    console.log({ sort });
    setSort(sort);                                 // Sort state ko banaye gaye sort object ke saath set kiya ja raha hai
  };

  const handlePage = (page) => {                    // page = index + 1....
    // console.log(page);                             // isme uss page ka index number se 1 jyada number aa jayega kyuki index 0 se start hota hai aur page 1 se start hota hai jisper hum click kar rahe hain.. 
    setPage(page);                                 // jab 1...10 me se kisi bhi page per ya number per click kiya jayega to uss number ka index nikala jayega aur use uske index se 1 add kar diya jayega jo ki neeche pagination function or component me kiya gaya hai.... jiss number per click kiya jayega wo page setPage function set kar dega..
  };

  useEffect(() => {
    // console.log(products);
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };               // kyuki page koi object nahi hai to hum use direct dispatch nahi kr sakte hain, isliye humne use pagination object me dalkar set kiya hai jo json-server ka route handler use detect karega aur uske basis per hame page ke hisab se products ki list lakar de dega..
    dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }));  //Redux me useDispatch hook ka use Redux store ki state ko update karne ke liye hota hai. dispatch ka seedha sa mtlb hota hai action ko bhejna jo ki redux ki state ko update karta hai.. aur redux ki state ko access karne ke liye useSelector hook use kiya jata hai jo ki redux ki state ki information hame lake deta hai..
  }, [dispatch, filter, sort, page]);                            // Jab aap dispatch ko useEffect ke dependency array mein daalte hain, to iska matlab hai ki agar Redux store ki state mein koi bhi change hoti hai (jise dispatch ke zariye kiya ja sakta hai), tab useEffect chalega. Yeh ek powerful mechanism hai jo aapko Redux store ki state changes ko monitor karne aur uske mutabiq client-side behavior ko update karne mein madad karta hai. Dependency array mein dispatch ko include karke, aap useEffect ko specific events ke liye subscribe kar rahe hain. Isse aap apne component ko Redux store ke state ke sath sync mein rakh sakte hain, aur dynamic updates ke liye tayyar reh sakte hain jab bhi Redux store ki state badalti hai.

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);                 // yaha dependency array me sort isliye diya gaya hai kyuki user jab sorting karega to wo 1st page per chala jayega jo ki useEffect ke andar mentioned hai .... 

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());        // json-server se data leke redux ki ProductSlice ki state me available categories array ko updat krna..
  }, []);                                    // jab page pehli baar load ho to json-server se categories aur brands pehli hi baar me load ho jaye..

  
  return (
    <div>
      <div className="bg-white">
        <div>
          <MobileFilter
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            handleFilter={handleFilter}
            filters={filters}
          />

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                All Products
              </h1>

              <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      Sort
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            {({ active }) => (
                              <p
                                onClick={(ev) => handleSort(ev, option)}
                                className={classNames(
                                  option.current
                                    ? "font-medium text-gray-900"
                                    : "text-gray-500",
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                {option.name}
                              </p>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  type="button"
                  className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
                >
                  <span className="sr-only">View grid</span>
                  <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                <DesktopFilter handleFilter={handleFilter} filters={filters} />

                <div className="lg:col-span-3">
                  <ProductGrid products={products} />
                </div>
              </div>
            </section>

            <Pagination
              page={page}
              setPage={setPage}
              handlePage={handlePage}
              totalItems={totalItems}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(ev) =>
                                    handleFilter(ev, section, option)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters }) {
  return (
    <form className="hidden lg:block">
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        onChange={(ev) => handleFilter(ev, section, option)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}

function Pagination({ page, setPage, handlePage, totalItems }) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* This downside first div is for mobile layout */}
      <div className="flex flex-1 justify-between sm:hidden">
        <div
        onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </div>
        <div
          onClick={(e) => handlePage(page < totalPages  ? page + 1 : page)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </div>
      </div>
      {/* This downside div is for desktop or upper mobile sizes. */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(page - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {page * ITEMS_PER_PAGE > totalItems
                ? totalItems
                : page * ITEMS_PER_PAGE}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
             
            {/* This creates an array with a length equal to the number of pages needed to display all items based on the totalItems(which is comes from the json-server in ProductAPI file and creates the totalItems variable and send to the redux and then we are fetching the totalItems state from the fetchProductsByFiltersAsync function in the ProductSlice file) and ITEMS_PER_PAGE. Array create krke usper loop karne ka ek tareeka ye v haii --> [...Array(Math.ceil(totalItems / ITEMS_PER_PAGE)).keys()]...isme v array hi create kiya ja ra hai aur fir usme loop kiya ja ra hai */}
            {/* kyuki mujhe 1 se lekar 10 tak ke pages dikhane hain to array ki jarurat to padegi. Array.from() method ke pehle ek iterable object ya array-like object chahiye hota hai. Iske liye aapne { length: Math.ceil(totalItems / ITEMS_PER_PAGE) } diya hai. Yeh ek object hai jiska ek property length hai, aur uski value Math.ceil(totalItems / ITEMS_PER_PAGE) hai. Ismen object ki zarurat isliye padti hai kyun ki Array.from() method ek iterable object ya array-like object se seedha array create karta hai. Jab aap { length: Math.ceil(totalItems / ITEMS_PER_PAGE) } dete hain, toh Array.from() method is object ko dekhta hai, uske length property ko extract karta hai, aur phir uske basis pe ek array create karta hai. */}
            {Array.from({ length: totalPages }).map(                     
              (el, index) => (
                <div
                  onClick={() => handlePage(index + 1)}
                  aria-current="page"
                  className={`relative z-10 inline-flex items-center cursor-pointer ${
                    index + 1 === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400"
                  } px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >                                                            
                  {index + 1}                                                {/* humne yaha per iss array ki indexing use ki hai kyuki create kiya gaya array to empty hai. array empty isliye hai kyuki hum khali array jiski length 10 hai uss per loop chala rahe hain. aur uske index ki value undefined hai kyuki humne uss array me koi element push kiya hi nahi aur na hi humne existing array per loop chalaya hai, humne to ek naya 10 size ke array per loop chalaya hai. */}
                </div>                                               
              )
            )}

            <div
              onClick={(e) => handlePage(page < totalPages ? page + 1 : page)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <Link to={`/product-detail/${product.id}`}>
              <div
                key={product.id}
                className="group relative border-solid border-2 p-2 border-gray-200"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <div href={product.thumbnail}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </div>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      <StarIcon className="w-6 h-6 inline" />
                      <span className="align-bottom">{product.rating}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      $
                      {Math.round(
                        product.price * (1 - product.discountPercentage / 100)
                      )}
                    </p>
                    <p className="text-sm font-medium text-gray-400 line-through">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2:54:00
// json-server --watch data.json --port 8080
 

