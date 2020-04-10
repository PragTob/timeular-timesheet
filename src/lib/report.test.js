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
          acivity: {
            name: "Test"
          },
          duration: {
            startedAt: "2020-03-10T10:07:30.000",
            stoppedAt: "2020-03-10T12:03:03.192"
          }
        }
      ]

      const result = report(timeEntries).totalDuration;

      expect(result.milliseconds).toEqual(6933192);
      expect(result.hourFormat).toEqual("1:55:33h");
      expect(result.floatFormat).toEqual("1.93h");

    })
  });
});
