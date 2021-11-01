import { addDays, getDay } from "date-fns";
import { FunctionFactory, ItemValue } from "survey-vue";
import { DayOfWeek, HolidayHelper } from "../utils/holiday";

//Note function allows this. to
export const addCustomExpressions = (Survey: any) => {
  // Returns 'y' or 'n', or 'u' for undefined and 'e' for error
  const isChild = (params: any) => {
    if (!params && !params.length) return "u";
    const DOB = params[0];
    const MinorOrAdult = params[1];
    let dobReturn;
    let maReturn;
    const minYears = 19;

    if (DOB) {
      const now = new Date();
      const cmp = new Date(DOB);
      if (isNaN(cmp.getTime())) {
        dobReturn = "e";
      } else {
        dobReturn = "y";
        const yearDiff = now.getFullYear() - cmp.getFullYear();
        if (yearDiff > minYears) dobReturn = "n";
        else if (yearDiff === minYears) {
          if (cmp.getMonth() < now.getMonth()) dobReturn = "n";
          else if (cmp.getMonth() === now.getMonth() && cmp.getDate() < now.getDate())
            dobReturn = "n";
        }
      }
    }

    if (MinorOrAdult) {
      maReturn = MinorOrAdult === "Minor" ? "y" : "n";
    }

    if (!dobReturn && !maReturn) return "n";
    else if (dobReturn && !maReturn) return dobReturn;
    else if (!dobReturn && maReturn) return maReturn;
    else if (dobReturn === maReturn) return dobReturn;
    else return "e";
  };

  const listExcept = params => {
    if (!params && params.length < 2) return false;
    if (!params[0] || !params[1]) return [];
    return params[0].filter(value => !params[1].includes(value));
  };

  const listIntersect = params => {
    if (!params && params.length < 2) return false;
    if (!params[0] || !params[1]) return [];
    return params[0].filter(value => params[1].includes(value));
  };

  const listUnion = params => {
    if (!params && params.length < 2) return false;
    return (params[0] || []).concat(params[1] || []);
  };

  //targetDate:date, days:number, dayType = 'calendar' || 'business'
  const getDateFromQuestionAndAddDays = params => {
    if (!params && params.length < 3) return false;
    const targetDate = params[0];
    const days = params[1];
    const dayType = params[2];
    const startingDate = new Date(targetDate);
    if (dayType == "calendar") {
      return addDays(startingDate, days);
    } else {
      let movedBusinessDays = 0;
      const statsForYears = [];
      for (let i = -100; i < 100; i++)
        statsForYears.concat(HolidayHelper.bcStats(targetDate.getFullYear() + i));
      const direction = days > 0 ? 1 : -1;
      let newDay = new Date();
      while (Math.abs(days) > movedBusinessDays) {
        newDay = addDays(startingDate, direction);
        if (
          !statsForYears[newDay.toString()] &&
          getDay(newDay) != DayOfWeek.Saturday &&
          getDay(newDay) != DayOfWeek.Sunday
        ) {
          movedBusinessDays++;
        }
        newDay = addDays(startingDate, 1);
      }
    }
  };

  //Needs to be function, otherwise this context wont work.
  //Parameters: {spousePanel}, {childPanel}, <questionName for column choices>
  function getParticipants(params) {
    if (!params) return false;
    if (params.length < 3) return false;
    const spousePanel = (params[0] || [])
      .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "y")
      .map(s => s.spouseName);
    const childPanel = (params[1] || [])
      .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "y")
      .map(s => s.childName);
    const targetQuestion = params[2];
    const participants = [spousePanel, childPanel].flat();
    //Update the column choices.
    this.question.survey.getQuestionByName(targetQuestion).columns[0].choices = participants;
    return participants;
  }

  //Parameters: {spousePanel}, {childPanel}, <questionName for rows>
  function getNonParticipants(params) {
    if (!params) return false;
    if (params.length < 3) return false;
    const spousePanel = (params[0] || [])
      .filter(s => s.spouseIsAlive == "n" || s.spouseIsAdult == "n" || s.spouseIsCompetent == "n")
      .map(s => s.spouseName);
    const childPanel = (params[1] || [])
      .filter(s => s.childIsAlive == "n" || s.childIsAdult == "n" || s.childIsCompetent == "n")
      .map(s => s.childName);
    const targetQuestion = params[2];
    const nonParticipants = [spousePanel, childPanel].flat();
    //Update the rows of the table.
    this.question.survey.getQuestionByName(targetQuestion).rows = nonParticipants.map(
      s => new ItemValue(s)
    );
    return nonParticipants;
  }

  //Parameters: {questionName} for rows.
  const determineEarliestSubmissionDate = params => {
    if (!params) return false;
    if (!params[0]) return false;
    const rows = params[0];
    const calculatedDates = [];
    Object.entries(rows).forEach(([key, value]) => {
      if (!value["Date Served"] || !value["Method"]) return;
      const method = value["Method"];
      const dateServed = new Date(value["Date Served"]);
      let extraNoticeDays = 21;
      switch (method) {
        case "In-Person":
          break;
        case "Electronic":
          break;
        case "Mail":
          extraNoticeDays += 5;
          break;
      }
      dateServed.setDate(dateServed.getDate() + extraNoticeDays);
      calculatedDates.push(dateServed);
    });
    if (calculatedDates.length == 0) return false;
    const earliestSubmissionDate = new Date(Math.max.apply(null, calculatedDates));
    return earliestSubmissionDate;
  };

  //Add this so ExpressionRunner can access it.
  FunctionFactory.Instance.register("listIntersect", listIntersect);
  FunctionFactory.Instance.register("listExcept", listExcept);
  FunctionFactory.Instance.register("listUnion", listUnion);
  FunctionFactory.Instance.register("isChild", isChild);
  FunctionFactory.Instance.register("getDateFromQuestionAndAddDays", getDateFromQuestionAndAddDays);
  FunctionFactory.Instance.register(
    "determineEarliestSubmissionDate",
    determineEarliestSubmissionDate
  );
  FunctionFactory.Instance.register("getParticipants", getParticipants);
  FunctionFactory.Instance.register("getNonParticipants", getNonParticipants);

  Survey.FunctionFactory.Instance.register("listIntersect", listIntersect);
  Survey.FunctionFactory.Instance.register("listExcept", listExcept);
  Survey.FunctionFactory.Instance.register("listUnion", listUnion);
  Survey.FunctionFactory.Instance.register("isChild", isChild);
  Survey.FunctionFactory.Instance.register(
    "getDateFromQuestionAndAddDays",
    getDateFromQuestionAndAddDays
  );
  Survey.FunctionFactory.Instance.register(
    "determineEarliestSubmissionDate",
    determineEarliestSubmissionDate
  );
  Survey.FunctionFactory.Instance.register("getParticipants", getParticipants);
  Survey.FunctionFactory.Instance.register("getNonParticipants", getNonParticipants);
};
