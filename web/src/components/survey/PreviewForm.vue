<template>
  <component :is="state.component" :survey="question.survey" style="max-width: 1100px;"></component>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import FormP1 from "@/components/pdf/FormP1.vue";
import FormP9 from "@/components/pdf/FormP9.vue";

export default defineComponent({
  components: {
    'FormP1': FormP1,
    'FormP9': FormP9
  },
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1,
      component: ""
    });

    onMounted(() => {
      const q = props.question;
      state.component = q.formSelect;

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
      state
    };
  }
});
</script>
