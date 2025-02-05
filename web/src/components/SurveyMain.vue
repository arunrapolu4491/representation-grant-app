<template>
  <div v-if="survey" style="display: flex; flex:auto;">
    <survey-sidebar class="survey-sidebar" :survey="survey" :changed="updatedKey" />
    <div class="survey-content">
      <survey :survey="survey" class="pb-4 pl-4 pr-4" />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import _ from "lodash";
import { Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as SurveyInit from "@/survey/survey-init";
import SurveySidebar from "@/components/SurveySidebar.vue";
import { addCustomTemplating } from "@/survey/survey-templating";
import { onValueChanged } from "@/survey/survey-on-value-change";
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { getSurveyEnvironment, saveSurvey } from "@/utils/utils";
import surveyJson from "@/survey-primary.json";
import { getSurvey, setSurvey } from "@/state/survey-state";
import { SurveyDataService } from "@/services/survey-data-service";
import { LocationService } from "@/services/location-service";
import { SurveyQuestionNames } from "@/types/survey-primary";
import { getApplicationId, setLocations } from "@/state/application-state";

export default defineComponent({
  name: "SurveyMain",
  props: {
    sandboxName: String
  },
  components: {
    SurveySidebar
  },
  setup(props, context) {
    let timeoutHandle: NodeJS.Timeout;
    const sandboxName = props.sandboxName;
    const Survey = SurveyVue;
    const survey = getSurvey;
    let updatedKey = ref(0);
    SurveyInit.loadQuestionTypesVueAndSetCss(Survey);

    onMounted(() => {});

    const getApplication = async () => {
      try {
        const applicationId = getApplicationId.value;
        if (!applicationId) {
          const router = context.root.$router;
          router.push({ name: "applicant-status" });
          return;
        }
        const surveyData = await SurveyDataService.getApplication(applicationId);
        survey.value.data = surveyData?.data.steps;
      } catch (err) {
        console.log(err);
      }
    };

    const loadSurveyJson = async () => {
      let data = {};
      if (!sandboxName) {
        data = surveyJson;
      } else {
        try {
          const response = await axios.get(`/sandbox-survey/?sandbox_name=${sandboxName}`);
          data = JSON.parse(response.data.sandbox_data);
        } catch (error) {
          console.log("loadSurveyJson(): Loading JSON file failed\n", error);
        }
      }
      //@ts-ignore - It sucks to have to do this.
      setSurvey(new SurveyVue.Model(data));
      survey.value.commentPrefix = "Comment";
      survey.value.showQuestionNumbers = "off";
      addSurveyListener();
      if (!sandboxName) await getApplication();
      updatedKey.value++;
    };

    const saveTimer = () => {
      if (sandboxName) return;
      clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(() => {
        saveSurvey();
      }, 3500);
    };

    const addSurveyListener = () => {
      //We use this for visibleIf on a few of the components.
      survey.value
        .getAllQuestions()
        .filter(
          x =>
            x.getType() === "paneldynamic" &&
            (x.name == SurveyQuestionNames.spouseInfoPanel ||
              x.name == SurveyQuestionNames.childInfoPanel)
        )
        .forEach((element: SurveyVue.QuestionPanelDynamicModel) => {
          survey.value.setVariable(`${element.name}-count`, element.panelCount);
        });

      survey.value.onDynamicPanelAdded.add((sender, options) => {
        sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
      });

      survey.value.onDynamicPanelRemoved.add((sender, options) => {
        sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
      });

      addCustomTemplating(survey.value);

      survey.value.onValueChanged.add((sender, options) => {
        updatedKey.value++;
        onValueChanged(sender, options);
        saveTimer();
      });

      survey.value.onCurrentPageChanged.add((sender, options) => {
        updatedKey.value++;
        saveTimer();
        Vue.nextTick(() => {
          const el = document.getElementById("sidebar-title");
          if (el) el.scrollIntoView();
        });
      });

      survey.value.setVariable(`surveyEnvironment`, getSurveyEnvironment());
      survey.value.focusFirstQuestionAutomatic = false;
    };

    loadSurveyJson();

    const loadLocations = async () => {
      try {
        const response = await LocationService.getLocations();
        setLocations(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadLocations();

    return {
      survey,
      updatedKey
    };
  }
});
</script>

function useRouter() { throw new Error("Function not implemented."); }

<style scoped lang="scss">
.survey-content {
  width: 100%;
  margin-left: 22rem;
  margin-bottom: 50px;
}
</style>
