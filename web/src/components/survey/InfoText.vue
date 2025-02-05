<template>
  <div
    class="panel panel-default"
    :class="{
      error: question.messageStyle === 'error' || question.messageStyle === 'redinfo',
      'survey-infotext': question.messageStyle !== 'inline',
      'survey-inlinetext': question.messageStyle === 'inline'
    }"
    :key="state.key"
  >
    <div class="panel-heading">
      <label class="panel-title" :key="handleTitleTemplate()">
        <span
          class="heading-icon fa"
          v-if="question.messageStyle === 'error' || question.messageStyle === 'info'"
          :class="{
            'fa-ban': question.messageStyle === 'error',
            'fa-info-circle': question.messageStyle === 'info'
          }"
        ></span>
        <!-- question.fullTitle seemed to be causing an infinite loop when in the survey editor. -->
        <span class="title-text">
          <v-runtime-template :template="handleTitleTemplate()"></v-runtime-template>
        </span>
      </label>
    </div>
    <div class="panel-body" v-if="question.body" :key="handleBodyTemplate()">
      <v-runtime-template :template="handleBodyTemplate()"></v-runtime-template>
    </div>
    <div class="row accept-row" v-if="question.isRequired && !question.value">
      <div class="col-sm-12">
        <button class="btn btn-primary" type="button" @click="toggle">
          <span>Continue</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, defineComponent, reactive } from "@vue/composition-api";
import { convertTicksToToolTip } from "@/utils/utils";
import VRuntimeTemplate from "v-runtime-template";

export default defineComponent({
  name: "infotext",
  components: {
    VRuntimeTemplate
  },
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1
    });

    //Need to bind to this to be reactive.
    const body = props.question.createLocalizableString("body", this);
    props.question.setLocalizableStringText("body", props.question.body);

    //Need this to assign our new body.
    body.onGetTextCallback = text => {
      const textProcessor = props.question?.parent?.getType().includes("panel")
        ? props.question.parent.textProcessorValue
        : props.question.survey.getTextProcessor();
      text = textProcessor.processText(props.question.body, true);
      text = convertTicksToToolTip(text);
      return text;
    };

    const handleBodyTemplate = () => {
      return `<div>${props.question.localizableStrings.body.renderedHtml}</div>`;
    };

    const handleTitleTemplate = () => {
      return `<div>${
        props.isSurveyEditor
          ? props.question.locTitle.htmlValues.default || props.question.locTitle.renderedText
          : props.question.locTitle.renderedHtml
      }</div>`;
    };
    //Used to re-render panel when panel count changes.
    //May need to revisit for performance issues.
    const onDynamicPanelAdded = (sender, options) => {
      state.key++;
    };

    onBeforeUnmount(() => {
      props.question.survey.onDynamicPanelAdded.remove(onDynamicPanelAdded);
      props.question.survey.onDynamicPanelRemoved.remove(onDynamicPanelAdded);
    });

    onMounted(() => {
      //We need these, so it re-renders the panel counts.
      if (props.question.survey.onDynamicPanelAdded)
        props.question.survey.onDynamicPanelAdded.add(onDynamicPanelAdded);

      if (props.question.survey.onDynamicPanelRemoved)
        props.question.survey.onDynamicPanelRemoved.add(onDynamicPanelAdded);

      const q = props.question;

      if (!props.question.requiredErrorText) props.question.requiredErrorText = "Please press Continue";

      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("value", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
          state.key++;
        });
      }
    });

    return {
      state,
      handleBodyTemplate,
      handleTitleTemplate
    };
  },
  methods: {
    setValue(val) {
      this.question.value = val;
    },
    toggle() {
      this.question.value = !this.question.value;
    }
  }
});
</script>
