import padNumber from "./formatting"

function report(timeEntries, selectedActivites = []) {
  console.log(selectedActivites)
  const relevantEntries = selectedActivites.length > 0 ? filterByActivities(timeEntries, selectedActivites) : timeEntries

  const days = calculateDays(relevantEntries);

  return {
    totalDuration: totalDuration(days),
    days: days
  };
}

function filterByActivities(entries, activites) {
  return entries.filter(entry => {
    return activites.includes(entry.activity.id)
  })
}

function totalDuration(days) {
  const duration = days.reduce((sum, { duration: { milliseconds } }) => sum + milliseconds, 0)

  return {
    milliseconds: duration,
    hourFormat: hourFormat(duration),
    floatFormat: floatFormat(duration)
  };
}

const MILLISECONDS_TO_HOURS = 1000 * 60 * 60;
function floatFormat(duration) {
  return `${(duration / MILLISECONDS_TO_HOURS).toFixed(2)}`;
}

function hourFormat(duration) {
  const seconds = duration / 1000;
  const minutes = div(seconds, 60);
  const hours = div(minutes, 60);

  const leftoverMinutes = minutes % 60;
  const leftoverSeconds = Math.trunc(seconds % 60);

  return `${hours}:${padNumber(leftoverMinutes)}:${padNumber(leftoverSeconds)}`;
}

function div(a, b) {
  // https://stackoverflow.com/a/22307150
  return Math.trunc(a / b);
}



function parseTimeToDate(timeString) {
  return new Date(timeString);
}

function dayDuration(entries) {
  const myDuration = entries.reduce((sum, { duration }) => sum + duration, 0)

  return durationFormat(myDuration);
}

function durationFormat(duration) {
  return {
    milliseconds: duration,
    hourFormat: hourFormat(duration),
    floatFormat: floatFormat(duration)
  };
}

function calculateDays(timeEntries) {
  const sortedTimeEntries =
    timeEntries
      .map(normalizeAPITimeEntry)
      .sort((entryA, entryB) => entryA.from.getTime() - entryB.from.getTime());

  const byDate = groupBy(sortedTimeEntries, ({ from }) => {
    return new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  });

  return Array.from(byDate.entries(), ([dateMsecs, entries]) => {
    return {
      date: new Date(dateMsecs),
      duration: dayDuration(entries),
      entries: entries
    }
  });

}

function normalizeAPITimeEntry({ activity: { name }, duration: { startedAt, stoppedAt } }) {
  const from = parseTimeToDate(startedAt);
  const until = parseTimeToDate(stoppedAt);

  return {
    name: name,
    from: from,
    until: until,
    duration: until.getTime() - from.getTime()
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
