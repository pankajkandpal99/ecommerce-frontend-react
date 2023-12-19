import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser, signOutAsync } from "../authSlice";
import { Navigate } from "react-router-dom";

const Logout = ({ userId }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    dispatch(signOutAsync(userId));
  }, [dispatch]);

  // but useEffect runs after render, so we have to delay navigate part...
  return (
    <>
        {/* jab user null ho tab hame login page per redirect hona hai. */}
        {!user && <Navigate to="/login" replace={true} />};      
    </>
  );
};

export default Logout;
