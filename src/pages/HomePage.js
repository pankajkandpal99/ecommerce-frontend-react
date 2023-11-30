import Navbar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";

function HomePage() {
  return (
    <div>
      <Navbar>
        <ProductList></ProductList>
      </Navbar>
    </div>
  );
}

export default HomePage;
