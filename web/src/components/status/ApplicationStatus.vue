<template>
  <b-card id="status" border-variant="white">
    <b-container class="container home-content">
      <div class="alert alert-danger mt-4" v-if="error">{{ error }}</div>
      <b-row>
        <b-col>
          <h1>My Applications</h1>
          <hr class="bg-light" style="height: 2px;" />

          <b-card
            no-body
            border-variant="white"
            bg-variant="white"
            v-if="!previousApplications.length"
          >
            <span class="text-muted ml-4 mb-5">Your saved applications will appear here.</span>
          </b-card>

          <b-card v-else no-body border-variant="white" bg-variant="white">
            <b-table
              :items="previousApplications"
              :fields="previousApplicationFields"
              class="mx-4"
              sort-by="lastUpdated"
              :sort-desc="true"
              borderless
              striped
              small
              responsive="sm"
            >
              <template v-slot:cell(edit)="row">
                <b-button
                  size="sm"
                  variant="primary"
                  class="my-0 py-0 ml-2 mr-2"
                  @click="resumeApplication(row.item.id)"
                >
                  Resume Application
                </b-button>
                <b-button
                  size="sm"
                  variant="danger"
                  class="my-0 py-0"
                  @click="onDeleteApplication(row.item, row.index, deleteItems)"
                >
                  Delete Application
                </b-button>
              </template>
              <template v-slot:cell(deceased_name)="row">
                <span>{{ row.item.deceased_name }}</span>
              </template>
              <template v-slot:cell(lastUpdated)="row">
                <span>{{ row.item.lastUpdatedDate }}</span>
              </template>
            </b-table>
          </b-card>

          <b-card border-variant="white">
            <b-row>
              <b-col cols="5">
                <b-button
                  variant="success"
                  class="btn-lg register-button"
                  @click="beginNewApplication()"
                  >Start New Application</b-button
                >
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      v-model="deleteItems.confirmDelete"
      id="bv-modal-confirm-delete"
      header-class="bg-warning text-light"
    >
      <b-row v-if="deleteItems.deleteError" id="DeleteError" class="h4 mx-2">
        <b-badge
          class="mx-1 mt-2"
          style="width: 20rem;"
          v-b-tooltip.hover
          :title="deleteItems.deleteErrorMsgDesc"
          variant="danger"
        >
          {{ deleteItems.deleteErrorMsg }}
          <b-icon class="ml-3" icon="x-square-fill" @click="deleteItems.deleteError = false" />
        </b-badge>
      </b-row>
      <template v-slot:modal-title>
        <h2 class="mb-0 text-light">Confirm Delete Application</h2>
      </template>
      <h4>
        Are you sure you want to delete your
        <b>"{{ deleteItems.deleteError.deceased_name }}"</b> application?
      </h4>
      <template v-slot:modal-footer>
        <b-button variant="danger" @click="deleteApplication(previousApplications, deleteItems)"
          >Confirm</b-button
        >
        <b-button variant="primary" @click="$bvModal.hide('bv-modal-confirm-delete')"
          >Cancel</b-button
        >
      </template>
      <template v-slot:modal-header-close>
        <b-button
          variant="outline-warning"
          class="text-light closeButton"
          @click="$bvModal.hide('bv-modal-confirm-delete')"
          >&times;</b-button
        >
      </template>
    </b-modal>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/survey/survey-init";
import { SurveyDataService } from "@/services/survey-data-service";
import { setApplicationId, setError } from "@/state/application-state";
import { format } from "date-fns-tz";
import { differenceInMinutes } from "date-fns";

@Component
export default class ApplicationStatus extends Vue {
  error = "";
  previousApplications = [];
  previousApplicationFields = [
    { key: "deceased_name", label: "Deceased Name", sortable: true, tdClass: "border-top" },
    { key: "lastUpdated", label: "Last Updated", sortable: true, tdClass: "border-top" },
    { key: "edit", thClass: "d-none", sortable: false, tdClass: "border-top" }
  ];
  currentApplication: any = {};
  applicationId = "";
  deleteItems = {
    deleteErrorMsg: "",
    deleteErrorMsgDesc: "",
    deleteError: false,
    applicationToDelete: {},
    indexToDelete: -1,
    confirmDelete: false
  };
  dataManager = SurveyDataService;

  async mounted() {
    try {
      const response = await SurveyDataService.getApplicationList();
      for (const appJson of response.data) {
        const app = {
          lastUpdated: 0,
          lastUpdatedDate: "",
          id: 0,
          deceased_name: ""
        };
        const date = new Date(appJson.last_updated);
        app.lastUpdated = appJson.last_updated
          ? differenceInMinutes(date, new Date("2000/01/01"))
          : 0;
        app.lastUpdatedDate = appJson.last_updated
          ? format(date, "MMMM d, yyyy H:mm z", { timeZone: "America/Vancouver" })
          : "";
        app.id = appJson.id;
        app.deceased_name = `${appJson?.deceased_name?.first} ${appJson?.deceased_name?.middle} ${appJson?.deceased_name?.last}`;
        this.previousApplications.push(app);
      }
    } catch (error) {
      this.error = error;
    }
  }

  public async resumeApplication(applicationId) {
    setApplicationId(applicationId);
    this.$router.push({ name: "surveys" });
  }

  public openTerms() {
    this.$router.push({ name: "terms" });
  }

  public async beginNewApplication() {
    try {
      const response = await SurveyDataService.createApplication();
      setApplicationId(response.data.app_id);
      this.$router.push({ name: "surveys" });
    } catch (err) {
      console.log(err);
    }
  }

  public onDeleteApplication(application, index, deleteItems) {
    deleteItems.deleteErrorMsg = "";
    deleteItems.deleteErrorMsgDesc = "";
    deleteItems.deleteError = false;
    deleteItems.applicationToDelete = application;
    deleteItems.indexToDelete = index;
    deleteItems.confirmDelete = true;
  }

  public async deleteApplication(applications, deleteItems) {
    try {
      const applicationId = deleteItems.applicationToDelete.id;
      const response = await SurveyDataService.deleteApplication(applicationId);
      let indexToDelete = applications.findIndex(app => {
        return app.id == deleteItems.applicationToDelete["id"];
      });
      if (indexToDelete >= 0) applications.splice(indexToDelete, 1);
    } catch (error) {
      const errMsg = error.response.data.error;
      this.error = errMsg;
      deleteItems.deleteErrorMsg = errMsg.slice(0, 60) + (errMsg.length > 60 ? " ..." : "");
      deleteItems.deleteErrorMsgDesc = errMsg;
      deleteItems.deleteError = true;
    }
    deleteItems.confirmDelete = false;
  }

  public navigateToEFilingHub(packageNumber) {
    //TODO: replace input value with the eFilingHub link
    //location.replace(packageNumber)
  }

  beforeCreate() {
    const Survey = SurveyVue;
    surveyEnv.loadQuestionTypesVueAndSetCss(Survey);
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_common";
.home-content {
  padding-bottom: 20px;
  padding-top: 2rem;
  max-width: 950px;
  color: black;
}
hr.section {
  border: 0.5px solid $gov-mid-blue;
  margin-bottom: 1.5rem;
}
.section-heading {
  color: $gov-mid-blue;
  font-weight: 500;
  padding: 0rem 2rem 0rem 2rem;
}
.intro {
  font-size: 24px;
  line-height: 1.6;
  margin: 0.5rem auto 0.5rem;
  p {
    margin-bottom: 0.5rem;
  }
}
.loginInfo-section {
  margin-top: 2.5rem;
}
.register-button {
  color: $gov-white !important;
  border: 2px solid rgba($gov-mid-blue, 0.3);
  margin-top: 2.5rem;
  width: 100%;
  &:active {
    border: 2px solid rgba($gov-white, 0.8);
  }
}
.wrapper {
  position: relative;
  padding-left: 8rem;
  width: 30px;
  height: 200px;
  margin: 10px;
}

.application-button {
  margin-right: 2rem;
}

.terms {
  color: $gov-mid-blue;
}
</style>
