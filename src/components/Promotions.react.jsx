import { useState, useEffect } from "react";
import "./css/Promotions.scss";
import Loader from "./Loader.react";

const imagePerRow = 5;

const Promotions = (props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://www.mocky.io/v2/5bc3b9cc30000012007586b7`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const onlyNewCustomersData = data
    ? data?.filter((item) => {
        return item.onlyNewCustomers === true;
      })
    : [];

  const [activeTab, setActiveTab] = useState("AllPromotions");

  const handleAllPromotionButton = () => {
    try {
      setLoading(true);
      setActiveTab("AllPromotions");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlyPromotionButton = () => {
    try {
      setLoading(true);
      setActiveTab("OnlyCustomer");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateData =
    activeTab === "OnlyCustomer" ? onlyNewCustomersData : data;

  let activeButtonStyle = {
    backgroundColor: "#8090A5",
    color: "#fff",
  };
  let promotionStyle = {
    backgroundColor:
      activeTab === "AllPromotions"
        ? activeButtonStyle.backgroundColor
        : "#fff",
    color: activeTab === "AllPromotions" ? activeButtonStyle.color : "#000",
  };
  let customerStyle = {
    backgroundColor:
      activeTab === "OnlyCustomer" ? activeButtonStyle.backgroundColor : "#fff",
    color: activeTab === "OnlyCustomer" ? activeButtonStyle.color : "#000",
  };

  const [next, setNext] = useState(imagePerRow);
  const handleMoreImage = () => {
    setNext(next + imagePerRow);
  };

  return (
    <div className="promotions-container">
      <div className="promotion-buttons">
        <button onClick={handleAllPromotionButton} style={promotionStyle}>
          All Promitions
        </button>
        <button onClick={handleOnlyPromotionButton} style={customerStyle}>
          New Customers
        </button>
      </div>
      {loading && <Loader />}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <div className="promotion-card-container">
        {updateData &&
          loading !== true &&
          updateData.slice(0, next)?.map((promotion, index) => {
            return (
              <div className="promotion-card" key={index}>
                <img src={promotion.heroImageUrl} height="120px" alt="header" />
                <span className="card-header">{promotion.name}</span>
                <p className="card-description">{promotion.description}</p>
                <div className="card-button-container">
                  <div className="terms-and-conditions">
                    {promotion.termsAndConditionsButtonText}
                  </div>
                  <div className="join-now">{promotion.joinNowButtonText}</div>
                </div>
              </div>
            );
          })}
      </div>
      {next < updateData?.length && (
        <button onClick={handleMoreImage}>Load more</button>
      )}
    </div>
  );
};

export default Promotions;
