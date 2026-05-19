import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { usePageAnimation } from './components/Util/usePageAnimation';
import '../styles/catalog.css'
import { Link } from "react-router"
import axios from "axios";
import { useEffect, useState } from "react";

export function Catalog() {
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mounted = usePageAnimation();

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' },
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items/');
        console.log('items response:', response.data);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setCollectionName((res.data.collectionName || '').toUpperCase());
setCollectionDesc(res.data.collectionDesc || '');
      } catch (error) {
        console.error('Error fetching collection info:', error);
      }
    }


    fetchItems();
    fetchSettings();
  }, []);

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => inStockOnly ? item.inStock : true)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <>
      <Header />
      <main className={`catalogMain pageEnter ${mounted ? 'pageVisible' : ''}`}>
        <div className="collection-name">
          <p className="collection-lable">{collectionName}</p>
          <p className="collection-desc">{collectionDesc}</p>
        </div>

        <div className="catalogControls">
          <input
            className="catalogSearch"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="catalogSortWrapper">
            <button className="catalogSortBtn" onClick={() => setSortOpen(!sortOpen)}>
              {sortOptions.find(o => o.value === sortBy)?.label} ▾
            </button>
            {sortOpen && (
              <div className="catalogSortDropdown">
                {sortOptions.map(option => (
                  <div
                    key={option.value}
                    className={`catalogSortOption ${sortBy === option.value ? 'active' : ''}`}
                    onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="catalogInStock">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In stock only
          </label>
        </div>
        <div className="items-container">

          {isLoading
            ? Array(8).fill(null).map((_, i) => (
              <div className="itemCard" key={i}>
                <div className="skeletonImage" />
                <div className="skeletonInfo">
                  <div className="skeletonLine" />
                  <div className="skeletonLineShort" />
                </div>
              </div>
            ))
            : filteredItems.map(item => (<div className="itemCard" key={item.id}>
              <Link to={"/item/" + item.id}>
                <div className="itemImageWrapper">
                  <img className="itemImage" src={item.frontImage} alt={item.name} />
                  {!item.inStock && <span className="soldOut">SOLD OUT</span>}
                </div>
                <div className="itemInfo">
                  <p className="itemName">{item.name}</p>
                  <div className="itemPrice">
                    {/* {discount
                ? <>
                  <span className="priceNew">€{discountedPrice}</span>
                  <span className="priceOld">€{price}</span>
                </>
                :  */}
                    <span>&euro;{item.price.toFixed(2)}</span>
                    {/* } */}
                  </div>
                </div>
              </Link>
            </div>))}

        </div>
      </main>
      <Footer />
    </>
  )
}

export default Catalog
