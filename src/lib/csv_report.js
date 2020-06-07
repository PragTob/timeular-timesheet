import padNumber from "./formatting"

const HEADERS = "day,name,duration"

function csvReport(report) {
  let csv = HEADERS;
  report.days.forEach(({ date, duration }) => {
    const dateFormat = `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`
    const row = `\n${dateFormat},Tobias Pfeiffer,${duration.floatFormat}`
    csv += row;
  })

  return csv;
}

export default csvReport;
