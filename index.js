import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Load data
const holidaysData = JSON.parse(
  fs.readFileSync(path.resolve('./holidays.json'), 'utf-8')
);

app.get('/api/holidays', (req, res) => {
  const { state, year, type, religion, name } = req.query;

  if (!state || !year) {
    return res.status(400).json({ error: "Please provide both 'state' and 'year'." });
  }

  // Validate state & year match
  const dataMatch =
    holidaysData.state.toLowerCase() === state.toLowerCase() &&
    holidaysData.year.toString() === year.toString();

  if (!dataMatch) {
    return res.status(404).json({ message: 'No data found for the given state and year.' });
  }

  // Start with all holidays
  let filtered = holidaysData.holidays;

  // Apply filters if present
  if (type) {
    filtered = filtered.filter(
      h => h.type.toLowerCase() === type.toLowerCase()
    );
  }

  if (religion) {
    filtered = filtered.filter(
      h => h.religion.toLowerCase() === religion.toLowerCase()
    );
  }

  if (name) {
    filtered = filtered.filter(
      h => h.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return res.json({
    state: holidaysData.state,
    year: holidaysData.year,
    filteredCount: filtered.length,
    holidays: filtered
  });
});

app.get('/', (req, res) => {
  res.send('🎉 Holiday API is live. Try /api/holidays?state=Jharkhand&year=2025');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
