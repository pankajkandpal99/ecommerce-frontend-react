import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLoggedInUserOrdersAsync,
  selectUserInfo,
  selectUserOrders,
} from "../userSlice";
import { discountedPrice } from "../../../app/constants";

export default function UserOrders() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const orders = useSelector(selectUserOrders);
  console.log(orders); // isme hame orders array ke andar ek object milta hai jisme items naam ka array hota hai jo ye batata hai ki uss loggedIn user ne kitne items cart me add kiye hain means ki uske cart me kitne items me add hai. ye data mujhe data.json se mil ra hai usi format me jiss format me waha per store kiya gaya hai..

  useEffect(() => {
    dispatch(fetchLoggedInUserOrdersAsync(userInfo.id));
  }, [dispatch, userInfo]);

  return (
    <div>
      {orders?.map((order) => {
        console.log(order);
        return (
          <div  key={order.id}>
            <div>
              <div className="mx-auto bg-white mt-12 max-w-7xl px-4  sm:px-6 lg:px-8">
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <h1 className="text-4xl my-6 font-bold tracking-tight text-gray-900">
                    Order # {order.id}
                  </h1>
                  <h3 className="text-xl my-6 font-bold tracking-tight text-red-900">
                    Order Status : {order.status}
                  </h3>

                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {order?.items?.map((item) => {
                        console.log(item);
                        return (
                          <li key={item.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.product.thumbnail}
                                alt={item.product.title}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <a href={item.product.id}>
                                      {item.product.title}
                                    </a>
                                  </h3>
                                  <p className="ml-4">
                                    $ {discountedPrice(item.product)}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.product.brand}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm mb-2">
                                <div className="text-gray-500">
                                  <label
                                    htmlFor="quantity"
                                    className="inline mr-5 text-sm font-medium loading-6 text-gray-900"
                                  >
                                    Qty: {item.quantity}
                                  </label>
                                </div>
                                <div className="flex"></div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>$ {order.totalAmount}</p>
                  </div>

                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in cart: </p>
                    <p>{order.totalItems} items</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping Address:
                  </p>
                  <div className="flex justify-between gap-x-6 px-5 py-4 mt-2 border-solid border-2 border-gray-200">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {order.selectedAddress.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {order.selectedAddress.street}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {order.selectedAddress.pinCode}
                        </p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-500">
                        phone: {order.selectedAddress.phone}
                      </p>
                      <p className="text-sm leading-6 text-gray-500">
                        {order.selectedAddress.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}