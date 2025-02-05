<template>
  <div
    class="panel panel-default survey-expander"
    :class="{
      'survey-helptext': question.messageStyle === 'box',
      'survey-inlinetext': question.messageStyle !== 'box',
      expanded: question.value
    }"
    :key="state.key"
  >
    <div class="panel-heading">
      <label
        class="panel-title"
        tabindex="0"
        @keydown.space.prevent="toggle"
        :key="handleTitleTemplate()"
      >
        <input type="checkbox" :checked="question.value" @click="setValue($event.target.checked)" />
        <span class="heading-icon fa fa-question-circle"></span>
        <span class="title-text">
          <v-runtime-template :template="handleTitleTemplate()"></v-runtime-template>
        </span>
        <span
          class="heading-expand fa"
          :class="question.value ? 'fa-chevron-up' : 'fa-chevron-down'"
        ></span>
      </label>
    </div>
    <div class="panel-body" v-if="question.body" :key="handleBodyTemplate()">
      <v-runtime-template :template="handleBodyTemplate()"></v-runtime-template>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import { convertTicksToToolTip } from "@/utils/utils";
import VRuntimeTemplate from "v-runtime-template";

export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  components: {
    VRuntimeTemplate
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

    onMounted(() => {
      const q = props.question;
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

<style type="css" scoped>
.panel-title {
  user-select: none;
}
.panel-title > input {
  visibility: hidden;
  width: 0px;
}
</style>
