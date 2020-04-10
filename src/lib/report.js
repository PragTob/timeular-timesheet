function report(timeEntries) {
  return {
    totalDuration: totalDuration(timeEntries),
    days: calculateDays(timeEntries)
  };
}

function totalDuration(timeEntries) {
  const duration = calculateDuration(timeEntries);

  return {
    milliseconds: duration,
    hourFormat: hourFormat(duration),
    floatFormat: floatFormat(duration)
  };
}

function calculateDuration(timeEntries) {
  return timeEntries
    .map(({ duration: { startedAt, stoppedAt } }) => {
      return parseTimeToMilliseconds(stoppedAt) - parseTimeToMilliseconds(startedAt);
    })
    .reduce((time, sum) => time + sum, 0);
}

const MILLISECONDS_TO_HOURS = 1000 * 60 * 60;
function floatFormat(duration) {
  return `${(duration / MILLISECONDS_TO_HOURS).toFixed(2)}h`;
}

function hourFormat(duration) {
  const seconds = duration / 1000;
  const minutes = div(seconds, 60);
  const hours = div(minutes, 60);

  const leftoverMinutes = minutes % 60;
  const leftoverSeconds = Math.trunc(seconds % 60);

  return `${hours}:${padNumber(leftoverMinutes)}:${padNumber(leftoverSeconds)}h`;
}

function div(a, b) {
  // https://stackoverflow.com/a/22307150
  return Math.trunc(a / b);
}
function padNumber(number) {
  return number.toString().padStart(2, '0')
}

function parseTimeToMilliseconds(timeString) {
  return Date.parse(timeString);
}

function parseTimeToDate(timeString) {
  return new Date(timeString);
}

function calculateDays(timeEntries) {
  const sortedTimeEntries =
    timeEntries
      .map(normalizeAPITimeEntry)
  // .sort(entryA, entryB => entryA.from.getTime() - entryB.from.getTime());

  const byDate = groupBy(sortedTimeEntries, ({ from }) => {
    return new Date(from.getFullYear(), from.getMonth(), from.getDate());
  });

  return Array.from(byDate.entries(), ([date, entries]) => {
    return {
      date: date,
      entries: entries
    }
  });

}

function normalizeAPITimeEntry({ activity: { name }, duration: { startedAt, stoppedAt } }) {
  return {
    name: name,
    from: parseTimeToDate(startedAt),
    until: parseTimeToDate(stoppedAt)
  };
}

// I miss lodash/underscore
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export default report;
