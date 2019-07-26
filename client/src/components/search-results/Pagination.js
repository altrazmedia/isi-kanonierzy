import React from "react";

const Pagination = props => {

  const { page, totalPages, changePage } = props; 

  const handleClick = number => () => {
    if (number !== page) {
      changePage(number);
    }
  }

  const getButtonsPageNumbers = () => {
    const numbersSet = new Set();
    const delta = 2;
    numbersSet.add(1)
    for (let i = page - delta; i <= page + delta; i++) {
      if (i > 1 && i < totalPages) {
        numbersSet.add(i);
      }
    }
    numbersSet.add(totalPages);
    return numbersSet;
  }

  const getButtons = () => {
    const numbers = Array.from(getButtonsPageNumbers());
    const buttons = [];
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i - 1] && numbers[i] - numbers[i-1] !== 1) {
        buttons.push(
          <div className="pagination__item pagination__item--blank" key={`blank-${numbers[i]}`}>
            ...
          </div>
        )
      }
      const activeClass = numbers[i] === page ? "pagination__item--active" : "";
      buttons.push(
        <button 
          className={`pagination__item ${activeClass}`}
          onClick={handleClick(numbers[i])}
          key={numbers[i]}
        >
          {numbers[i]}
        </button>
      )
    }
    return buttons;
  }


  return (
    <div className="pagination">
      {
        getButtons()
      }
    </div>
  )

}

export default Pagination;