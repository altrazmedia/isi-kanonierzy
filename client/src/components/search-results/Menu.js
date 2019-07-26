import React from "react";

const Menu = props => {

  const { view, setView } = props;

  const handleButtonClick = clickedView => () => {
    if (clickedView !== view) {
      setView(clickedView);
    }
  }

  return (
    <div className="menu">
      <button className={`menu__item ${view === "items" ? "active" : ""}`} onClick={handleButtonClick("items")}>Wyniki wyszukiwania</button> 
      <button className={`menu__item ${view === "stats" ? "active" : ""}`} onClick={handleButtonClick("stats")}>Statystyki</button> 
    </div>
  )
  
}

export default Menu;