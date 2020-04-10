import report from "./report";

describe("Report", () => {
  describe(".totalDuration", () => {
    test("0 with no activities", () => {
      const result = report([]).totalDuration;

      expect(result.milliseconds).toEqual(0);
      expect(result.hourFormat).toEqual("0:00:00h");
      expect(result.floatFormat).toEqual("0.00h");
    });

    test("time of the activity with one activity", () => {
      const timeEntries = [
        {
          activity: {
            name: "Test"
          },
          duration: {
            startedAt: "2020-03-10T10:07:30.000",
            stoppedAt: "2020-03-10T12:03:03.192"
          }
        }
      ];

      const result = report(timeEntries).totalDuration;

      expect(result.milliseconds).toEqual(6933192);
      expect(result.hourFormat).toEqual("1:55:33h");
      expect(result.floatFormat).toEqual("1.93h");

    });

    test("time of two activities", () => {
      const timeEntries = [
        {
          activity: {
            name: "Test"
          },
          duration: {
            startedAt: "2020-03-10T10:07:30.000",
            stoppedAt: "2020-03-10T12:03:03.192"
          }
        },
        {
          activity: {
            name: "Test2"
          },
          duration: {
            startedAt: "2020-02-21T23:07:30.000",
            stoppedAt: "2020-02-21T23:10:30.000"
          }
        }
      ]

      const result = report(timeEntries).totalDuration;

      expect(result.milliseconds).toEqual(7113192);
      expect(result.hourFormat).toEqual("1:58:33h");
      expect(result.floatFormat).toEqual("1.98h");

    });
  });

  describe(".days", () => {
    test("no entries no days", () => {
      const days = report([]).days;

      expect(days).toEqual([]);
    });

    test("one entry one day", () => {
      const from = "2020-03-10T10:07:30.000";
      const until = "2020-03-10T12:03:03.192";

      const timeEntries = [
        {
          activity: {
            name: "Test"
          },
          duration: {
            startedAt: from,
            stoppedAt: until
          }
        }
      ];

      const days = report(timeEntries).days;

      expect(days).toEqual([
        {
          // months are zero based
          date: new Date(2020, 2, 10),
          entries: [
            {
              name: "Test",
              from: new Date(from),
              until: new Date(until)
            }
          ]
        }
      ]);
    });
  });
});
