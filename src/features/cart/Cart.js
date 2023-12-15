import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from "./CartSlice";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function Cart() {
  const [open, setOpen] = useState(true);
  const items = useSelector(selectItems);
  const dispatch = useDispatch();

  console.log({ items });

  const totalAmount = items.reduce(
    (amount, item) => amount + item.price * item.quantity,
    0
  ); // accumulator: Accumulator variable jo ki yaha per amount hai, ye har iteration mein update hota hai... currentValue: Current element of the array jo ki yaha per item hai.

  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuatity = (event, item) => {
    event.preventDefault();
    dispatch(updateCartAsync({ ...item, quantity: +event.target.value }));
  };

  const handleRemove = (e, itemId) => {
    e.preventDefault();
    dispatch(deleteItemFromCartAsync(itemId));
  };

  return (
    <>
      {!items.length && <Navigate to="/" replace={true} />}
      <div>
        <div className="mx-auto bg-white mt-12 max-w-7xl px-4  sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h2 className="text-4xl my-6 font-bold tracking-tight text-gray-900">
              Cart
            </h2>

            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={item.href}>{item.title}</a>
                          </h3>
                          <p className="ml-4">${item.price * item.quantity}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.brand}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mb-2">
                        <div className="text-gray-500">
                          <label
                            htmlFor="quantity"
                            className="inline mr-5 text-sm font-medium loading-6 text-gray-900"
                          >
                            Qty
                          </label>
                          <select
                            value={item.quantity}
                            onChange={(e) => handleQuatity(e, item)}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={(e) => handleRemove(e, item.id)} // item.id se usi item ki id jayegi jis item per ye Remove button hoga...
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>$ {totalAmount}</p>
            </div>

            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
              <p>Total Items in cart: </p>
              <p>{totalItems} items</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or {"  "}
                <Link to="/">
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
