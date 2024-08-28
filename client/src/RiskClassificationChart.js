import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function RiskClassificationChart() {
  const { activeAssessment } = useSelector((state) => state.checkpoints);

  // Aggregate all risks from all checkpoints
  const allRisks = [];
  activeAssessment.answers.forEach(answer => {
    if (answer.form_data && answer.form_data.risks) {
      answer.form_data.risks.forEach(risk => {
        allRisks.push(risk);
      });
    }
  });

  // Classify risks
  const riskCounts = { high: 0, medium: 0, low: 0 };
  const classifyRisk = (likelihood, impact) => {
    const score = {
      High: 3,
      Medium: 2,
      Low: 1
    }[likelihood] + {
      High: 3,
      Medium: 2,
      Low: 1
    }[impact];

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  allRisks.forEach(risk => {
    const category = classifyRisk(risk.likelihood, risk.impact);
    riskCounts[category]++;
  });

  // Data for the chart
  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Risk Count',
        data: [riskCounts.high, riskCounts.medium, riskCounts.low],
        backgroundColor: ['#d73058', '#f8bb26', '#0dbb37'],
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'end',
        clamp: 'true',
        offset: -20,
        formatter: (value) => value,
        display: function(context) {
            return context.dataset.data[context.dataIndex] > 0;
        }

      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="view-report-cta view-risks-cta">
      <div className="cta-inner">
        <div className="cta-title">Risk Classification</div>
        <div className="cta-content">
          <div className="risk-classification-chart">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}