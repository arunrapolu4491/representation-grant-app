<template>
  <div>
    <div
      class="card-body"
      style="margin: 0.5rem 1rem; color: rgb(80, 80, 170); font-size: 16px; font-weight: bold;"
    >

      <b-table
        hover
        head-variant="dark"
        :items="state.results"
        :fields="fields"
        style="white-space: pre-line;"
      >
        <template v-slot:cell(question)="value">
          <v-runtime-template :template="`<div>${value.item.question}</div>`"></v-runtime-template>
        </template>

        <template v-slot:cell(answer)="value">
          <v-runtime-template :template="`<div>${value.item.answer}</div>`"></v-runtime-template>
        </template>

        <template v-slot:cell(actions)="value">
          <span><b-btn v-on:click="navigateToQuestion(value.item.question)">Edit</b-btn></span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import VRuntimeTemplate from "v-runtime-template";
import { convertTicksToToolTip, formatMonthDayYear } from "@/utils/utils";
import { SurveyQuestionNames } from "@/types/survey-primary";
import { getLocations } from "@/state/application-state";
export default defineComponent({
  components: {
    VRuntimeTemplate
  },
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1,
      results: []
    });
    const fields = ["question", "answer", "actions"];

    onMounted(() => {
      const q = props.question;

      const signatureHandler = answer => {
        if (answer) {
          return "Signed";
        }
        return "";
      };

      const separator = str => {
        if (str.includes("?")) {
          return " ";
        } else {
          return ": ";
        }
      };

      const getReviewQuestions = reviewQuestions => {
        const selected = new Set();
        if (!reviewQuestions) {
          return selected;
        } else {
          const questions = reviewQuestions.split(",");
          for (const idx in questions) {
            selected.add(questions[idx]);
          }
          return selected;
        }
      };

      const formatKey = str => {
        const firstChar = str.charAt(0).toUpperCase();
        let capitalized = "";

        if (str.length > 1) {
          capitalized = firstChar + str.slice(1);
        } else if (str.length === 1) {
          capitalized = firstChar;
        }

        return convertTicksToToolTip(capitalized);
      };

      const formatObject = item => {
        // Base case for recursion
        if (item !== Object(item)) {
          return item + "\n";
        } else if (item === Object(item)) {
          let ret = "";
          for (const key in item) {
            ret += formatKey(key) + separator(key) + formatObject(item[key]);
          }
          return ret;
        }
      };

      const formatArray = arr => {
        let ret = "";
        arr.forEach(element => {
          ret += formatObject(element);
        });
        return ret;
      };

      const yesNoHandler = answer => {
        if (answer === "y") {
          return "Yes";
        } else {
          return "No";
        }
      };

      const fileAnswerHandler = answer => {
        let ret = "";
        let suffix = "\n";

        if (answer.length <= 1) {
          suffix = "";
        }
        for (let i = 0; i < answer.length; i++) {
          ret += answer[i].name + suffix;
        }
        return ret;
      };

      const customLabelHandler = (answer, labels) => {
        let ret = "";
        let idx = 0;

        for (const key in answer) {
          const title = labels[idx] || formatKey(key);
          ret += convertTicksToToolTip(title) + separator(title) + answer[key] + "\n";
          idx++;
        }
        return ret;
      };

      const checkboxHandler = question => {
        return question.choices.find(c => c.value == question.value)?.text;
      };

      const dateFormatter = dateString => {
        return formatMonthDayYear(new Date(dateString.replace(/-/g, "/")));
      };

      const getCourthouse = answer => {
        return getLocations?.value?.find(l => l.id == answer)?.name || answer;
      }

      const addressHandler = (question, answer) => {
        let filtered = {};
        for (let key of Object.keys(answer)) {
          if (question[key]) {
            filtered[key] = answer[key];
          }
        }

        return formatObject(filtered);
      }

      const formatSwitchboard = (question, answer, questionType) => {
        if (!answer) {
          return "";
        } else if (questionType === "checkbox" || questionType === "radiogroup") {
          return checkboxHandler(question);
        } else if (questionType === "file") {
          return fileAnswerHandler(answer);
        } else if (questionType === "signaturepad") {
          return signatureHandler(answer);
        } else if (questionType === "yesno") {
          return yesNoHandler(answer);
        } else if (questionType === "address") {
          return addressHandler(question, answer);
        } else if (questionType === "personname") {
          return customLabelHandler(answer, [
            question?.labelFirstName,
            question?.labelMiddleName,
            question?.labelLastName
          ]);
        } else if (questionType === "contactinfo") {
          return customLabelHandler(answer, [
            question?.labelPhone,
            question?.labelEmail,
            question?.labelFax
          ]);
        } else if (questionType === "customdate") {
          return dateFormatter(answer);
        } else if (question?.name === SurveyQuestionNames.applicantCourthouse) {
          return getCourthouse(answer);
        } else if (Array.isArray(answer)) {
          return formatArray(answer);
        } else if (answer === Object(answer)) {
          return formatObject(answer);
        } else {
          return answer;
        }
      };

      const dynamicPanelHandler = question => {
        // This does not handle nested panels, assumes you stop at one.
        // eslint-disable-next-line prefer-const
        let answers = question.value;
        if (!answers) {
          return "";
        }

        const panels = question?.panels;
        let panelCell = "";

        answers.forEach((answer, i) => {
          const panel = panels[i];

          const displayables = panel.questions.filter(q => q.isVisible && !(q.getType() === "infotext" || q.getType() === "helptext"));
          displayables.forEach((displayable, j) => {

            const formattedAnswer = formatSwitchboard(
              displayable,
              answer[displayable.name],
              displayable.getType()
            );

            const title = displayable.localizableStrings.title.renderedHtml;
            const suffix = j < displayables.length - 1 ? "\n" : "";
            panelCell += convertTicksToToolTip(title) + separator(title) + formattedAnswer + suffix;
          });

          if (i < answers.length - 1) panelCell += "\n";
        });

        return panelCell;
      };

      const formatAnswers = question => {
        const answer = question.value;
        const questionType = question.getType();

        // special check we need to do for nested items
        if (questionType === "paneldynamic") {
          return dynamicPanelHandler(question);
        } else {
          return formatSwitchboard(question, answer, questionType);
        }
      };

      const buildQuestionAnswerTable = () => {
        const questions = q.survey.getAllQuestions();
        const selected = getReviewQuestions(q.reviewQuestions);

        for (const select of selected) {
          for (let j = 0; j < questions.length - 1; j++) {
            if (select === questions[j].name && questions[j].isVisible) {
              state.results.push({
                question: convertTicksToToolTip(questions[j].localizableStrings.title.renderedHtml),
                answer: formatAnswers(questions[j])
              });
            }
          }
        }
      };

      buildQuestionAnswerTable();

      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });
      }
    });

    return {
      state,
      fields
    };
  },
  methods: {
    navigateToQuestion: function(question) {
      const survey = this.question.survey;
      const questions = survey.getAllQuestions();
      const pages = survey.pages.filter(p => p.isVisible);

      const target = questions.find(q => convertTicksToToolTip(q.localizableStrings.title.renderedHtml) === question);
      
      const pageNum = pages.findIndex(
        (element) => element == pages.find(
          p => p.questions.find(
            q => q === target
          )
        )
      );

      survey.currentPageNo = pageNum;
      if (target?.panels) {
        target.panels[0].focusFirstQuestion();
      } else {
        target.focus();
      }
    }
  }
});
</script>
