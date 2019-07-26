import React from "react";

const monthDict = [ "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

const getHighlight = (item, field) => {
  if (item.highlight && item.highlight[field]) {
    return item.highlight[field].join("... ")
  }
  const str = item._source[field];
  return str.length <= 400 ? str : str.slice(0, 397) + "..."
}


const getDateStr = item => {
  const { day, month, year } = item._source;
  const _day = day > 9 ? day : `0${day}`;
  const _month = monthDict[month - 1];
  return `${_day} ${_month} ${year}`;
}

const Items = props => {

  const { items } = props;
  
  return (
    <div className="items">
      {
        items && items.map(item => (
          <div className="item" key={item._id}>
            <a href={item._source.url} target="_blank">
              <h3 dangerouslySetInnerHTML={{ __html: getHighlight(item, "title") }} className="item__title"/>
            </a>
            <p className="item__info"><b>{item._source.author}</b> dnia <b>{getDateStr(item)}</b></p>
            
            <p dangerouslySetInnerHTML={{ __html: getHighlight(item, "content") }} className="item__content"/>
            <p className="item__info">Liczba komentarzy: {item._source.comments || "0"}</p>
          </div>
        ))
      }
    </div>
  )

}

export default Items;