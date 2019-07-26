import React from "react";

const Form = props => {

  const { handleSubmit, handleChange, query, toggleAdvanced, displayAdvanced, sort, from, to, commentsFrom, commentsTo } = props;

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="container">
        <div className="search-form__main-input">
          <input 
            value={query}
            name="query"
            autoFocus
            onChange={handleChange}
            placeholder="Wyszukaj..."
          />
          <button type="submit" className="search-form__button">
            <i className="fas fa-search" />
          </button>
        </div>
        <button
          className="search-form__advanced-button"
          onClick={toggleAdvanced}
          type="button"
        >
          {
            displayAdvanced ? 
              <span>Schowaj ustawienia zaawansowane <i className="fas fa-caret-up" /></span>
            : <span>Pokaż ustawienia zaawansowane <i className="fas fa-caret-down" /></span>
          }
        </button>
        {
          displayAdvanced &&
            <div className="search-form__advanced">
              <div className="search-form__advanced-item">
                <label>Sortuj wyniki</label>
                <div className="search-form__advanced-item-input">
                  <select onChange={handleChange} value={sort} name="sort">
                    <option value="score">Od najlepszych wyników</option>
                    <option value="date-desc">Od najnowszych</option>
                    <option value="date-asc">Od najstarszych</option>
                    <option value="comments-desc">Od najczęściej komentowanych</option>
                    <option value="comments-asc">Od najrzadziej komentowanych</option>
                  </select>
                </div>
              </div>
              <div className="search-form__advanced-item">
                <label>Filtruj według roku publikacji</label>
                <div className="search-form__advanced-item-input range">
                  <input type="number" placeholder="od" value={from} onChange={handleChange} name="from" min={2006} max={2019} />
                  -
                  <input type="number" placeholder="do" value={to} onChange={handleChange} name="to" min={from || 2006} max={2019}  />
                </div>
              
              </div>

              <div className="search-form__advanced-item">
                <label>Filtruj według liczby komentarzy</label>
                <div className="search-form__advanced-item-input range">
                  <input type="number" placeholder="od" value={commentsFrom} onChange={handleChange} name="commentsFrom" min={0}  />
                  -
                  <input type="number" placeholder="do" value={commentsTo} onChange={handleChange} name="commentsTo" min={commentsFrom || 0} />
                </div>
              
              </div>
            </div>
        }
      </div>
    </form>
  )

}

export default Form;