import Chart from "chart.js/auto";
import { useEffect } from "react";
import "chartjs-plugin-datalabels";

function ChartComponentAdmin({ arrData, name }) {

  // biểu đồ
  const groupedDay = arrData?.reduce((result, order) => {
    const day = order?.day;
    const totalData = order?.total;
    result[day] = (result[day] || 0) + totalData;
    return result;
  }, {});
  const sumData = Object.keys(groupedDay).map((day) => ({
    day: day,
    totalData: groupedDay[day],
  }));

  useEffect(() => {
    if (sumData) {
      new Chart(document.getElementById("acquisitions"), {
        type: "bar",
        data: {
          labels: sumData?.map((row) => row?.day),
          datasets: [
            {
              label: name,
              data: sumData?.map((row) => row?.totalData),
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              color: "white",
              font: {
                weight: "bold",
              },
            },
          },
        },
      });
    } else {
      alert("Error");
    }
  }, [arrData]);
  return (
    <>
      <h1>Biểu đồ thống kê {name}</h1>
      <div style={{ width: "800px" }}>
        <canvas id="acquisitions"></canvas>
      </div>
    </>
  );
}

export default ChartComponentAdmin;
