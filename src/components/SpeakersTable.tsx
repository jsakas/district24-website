import { MAX_AGE_DAYS, MONDAY_WOMENS_BIG_BOOK_URL } from '../data';
import { MONTH_NAMES, daysAgo, isValidDate } from '../utils/dates';
import { useSheetRows } from '../utils/useSheetRows';
import { ExtLink } from './ExtLink';

interface Speaker {
  date: Date;
  description: string;
  link: string;
  label: string;
}

// Women's Big Book "Upcoming Speakers" table. Rows with ExactDate=TRUE show the
// day; otherwise only the month is shown.
export function SpeakersTable() {
  const speakers = useSheetRows<Speaker>(MONDAY_WOMENS_BIG_BOOK_URL, rows =>
    rows
      .map(r => {
        const date = new Date(r.Date);
        const exact = /^true$/i.test(r.ExactDate ?? '');
        return {
          date,
          description: r.Description,
          link: r.Link,
          label: exact ? `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}` : MONTH_NAMES[date.getMonth()],
        };
      })
      .filter(r => isValidDate(r.date) && daysAgo(r.date) <= MAX_AGE_DAYS)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  );

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Date</th><th>Description</th></tr></thead>
        <tbody>
          {speakers.map((s, i) => (
            <tr key={i} className={i % 2 === 0 ? 'stripe' : 'white'}>
              <td><strong>{s.label}</strong></td>
              <td>{s.link ? <ExtLink href={s.link}>{s.description}</ExtLink> : s.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
