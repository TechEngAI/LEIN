export default function ForecastTable({ data }) {
  return (
    <div className="chart-card">
      <h3>AI Forecast — Next 6 Hours</h3>
      <div className="table-responsive">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Medical</th>
              <th>Fire</th>
              <th>Security</th>
              <th>Accident</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.hour}</td>
                <td className={row.medical >= 4 ? 'high-value' : ''}>{row.medical}</td>
                <td className={row.fire >= 4 ? 'high-value' : ''}>{row.fire}</td>
                <td className={row.security >= 4 ? 'high-value' : ''}>{row.security}</td>
                <td className={row.accident >= 4 ? 'high-value' : ''}>{row.accident}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
