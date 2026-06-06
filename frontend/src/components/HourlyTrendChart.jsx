import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HourlyTrendChart({ data }) {
  return (
    <div className="chart-card">
      <h3>Hourly Incident Trend</h3>
      <div style={{ height: '260px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="medical" stroke="var(--accent-blue)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="fire" stroke="var(--alert-red)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="security" stroke="#F39C12" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="accident" stroke="#F1C40F" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
