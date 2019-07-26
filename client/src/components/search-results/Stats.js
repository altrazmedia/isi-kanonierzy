import React from "react";
import { HorizontalBar } from "react-chartjs-2";

const COLORS = [ 
  "74,106,112", "209,143,67", "245,215,126", "179,183,141", "110,58,20",  
  "117,86,108", "31,125,113", "140,140,30", "225,167,136", "76,76,78", "184,216,186" ]

const Stats = props => {

  const { aggs } = props;

  const getChartData = (agg, label) => {
    const { buckets } = agg;
    const labels = [];
    const data   = [];

    buckets.forEach(bucket => {
      labels.push(bucket.key);
      data.push(bucket.doc_count)
    })

    return { 
      labels, 
      datasets: [{
        label,
        data,
        backgroundColor: COLORS.map(color => `rgba(${color}, .6)`),
        borderColor: COLORS.map(color => `rgb(${color})`),
        borderWidth: 2,
      }] 
    }
  }

  return (
    <div className="stats">
      
      {
        aggs.group_by_year.buckets.length && 
        <>
          <h3 className="stats__title">Liczba postów na przestrzeni lat</h3>
          <HorizontalBar 
            data={{
              ...getChartData(aggs.group_by_year, "Liczba postów na przestrzeni lat")
            }}
          />
        </>
      }
      
      {
        aggs.group_by_month.buckets.length && 
        <>
          <h3 className="stats__title">Liczba postów na przestrzeni miesięcy</h3>
          <HorizontalBar 
            data={{
              ...getChartData(aggs.group_by_month, "Liczba postów na przestrzeni miesięcy")
            }}
          />
        </>
      }

      {
        aggs.group_by_author.buckets.length && 
        <>
          <h3 className="stats__title">Autorzy postów</h3>
          <HorizontalBar 
            data={{
              ...getChartData(aggs.group_by_author, "Autorzy postów")
            }}
          />
        </>
      }

    </div>
  )

}

export default Stats;