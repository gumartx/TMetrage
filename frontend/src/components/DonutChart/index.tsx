import Chart from 'react-apexcharts';
import './style.css';

const DonutChart = () => {
  const mockData = {
    series: [2, 8, 7, 1, 3],
    labels: [
      'Terror',
      'Comédia',
      'Ação e Aventura',
      'Suspense',
      'Documentário',
    ],
    type: 'pie',
  };

  const options = {
    legend: {
      show: true,
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
  };

  return (
    <div className="chart">
      <Chart
        options={{ ...options, labels: mockData.labels }}
        series={mockData.series}
        type="pie"
        height="240"
      />
    </div>
  );
};

export default DonutChart;
