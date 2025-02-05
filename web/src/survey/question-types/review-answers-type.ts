import Vue from "vue";
import ReviewAnswers from "@/components/survey/ReviewAnswers.vue";
import { WidgetValueName } from "./question-types";

export function initReviewAnswers(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.ReviewAnswers],
    title: "Review Answers",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "reviewanswers";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("reviewanswers", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("reviewanswers", [
        {
          name: "reviewQuestions:text",
          category: "general",
          visibleIndex: 3
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(ReviewAnswers);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    },
    willUnmount: function(question, el) {
      if (question.survey.platformName == "vue") return;
      for (let i = 0; i < el.children.length; i++) {
        if (el.children[i].__vue__) {
          el.children[i].__vue__.$destroy();
        }
      }
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}
