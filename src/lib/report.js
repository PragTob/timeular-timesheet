function report(timeEntries) {
  return {
    totalDuration: totalDuration(timeEntries)
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
      return parseTime(stoppedAt) - parseTime(startedAt);
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
  console.log(minutes);
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

function parseTime(time) {
  return Date.parse(time);
}

export default report;
