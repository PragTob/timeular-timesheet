import csvReport from "./csv_report";

describe("CSVReport", () => {

  test("simple CSV test", () => {
    const day1Duration = {
      "floatFormat": "1.93",
      "hourFormat": "1:55:33",
      "milliseconds": 6933192,
    }

    const day2Duration = {
      "floatFormat": "2.00",
      "hourFormat": "2:00:00",
      "milliseconds": 7200000,
    }

    const minimalReport =
    {
      days: [
        {
          date: new Date(2020, 2, 9),
          duration: day1Duration,
        },
        {
          date: new Date(2020, 2, 11),
          duration: day2Duration

        }
      ]
    }

    expect(csvReport(minimalReport)).toEqual(
      `day,name,duration
2020-03-09,Tobias Pfeiffer,1.93
2020-03-11,Tobias Pfeiffer,2.00`
    )
  })

});
