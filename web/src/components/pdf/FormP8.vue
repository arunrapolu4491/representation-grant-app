<template>
  <div>
    <b-form-group>
      <label style="display:inline-block; margin: 0 1rem 0 0;">Example of filled Form for:</label>
      <b-form-radio-group
        style="display:inline-block"
        v-model="multipleApplicant"
        :options="[
          { value: false, text: 'Single Applicant' },
          { value: true, text: '10 (Multiple) Applicants' }
        ]"
        @change="changeApplicantList()"
      ></b-form-radio-group>
    </b-form-group>
    <b-button style="transform:translate(340px,0px)" variant="success" @click="onPrint()">
      Save
    </b-button>

    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;"
      bg-variant="white"
      class="mt-4 mb-3 container"
      no-body
    >
      <div style="text-align:center;margin:0 0 1rem 0;font-size:14pt;">
        FORM P8 (RULE 25-3 (2) )
      </div>

      <div class="mt-3 m-0 p-0 row">
        <div style="margin: 0 0 0 25.25rem;">
          <div>
            <underline-form textwidth="8.6rem" beforetext="This is the" hint="" text="1st" />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              affidavit
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="10.8rem"
              beforetext="of"
              hint=""
              :text="getAllApplicants(25)"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              in this case
            </div>
          </div>
          <div class="mt-2">
            <underline-form textwidth="9.5rem" beforetext="and was made on" hint="" text="" />
          </div>
          <div class="mt-2">
            <underline-form textwidth="13.2rem" beforetext="" hint="" text="Victoria" />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              Registry
            </div>
          </div>
          <div class="mt-2">
            <underline-form textwidth="14.9rem" beforetext="No." hint="" text="" />
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:1rem 0 0.25rem 0;font-weight:bold;font-size:14pt;">
        <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
      </div>
      <div style="text-align:center;font-size:12pt;">
        <i>In the Matter of the Estate of {{ deceased.fullName }}, deceased</i>
      </div>
      <div style="text-align:center;margin:0.5rem 0 2rem 0;font-weight: bold;font-size:10pt;">
        AFFIDAVIT IN SUPPORT OF APPLICATION FOR ESTATE GRANT
      </div>

      <div>
        <div
          v-if="applicantList.length > 1"
          style="display:inline-block; text-indent: 5px;margin-right:0.5rem;"
        >
          We,
        </div>
        <div v-else style="display:inline-block; text-indent: 5px;margin-right:0.5rem;">
          I,
        </div>
        <div
          style="display:inline-block; margin:0.5rem 0 0 0;"
          v-for="(name, i) in applicantList"
          :key="i + 50"
        >
          <div v-if="i > 0" style="display:inline-block; width:1.9rem;"></div>
          <underline-form textwidth="17rem" beforetext="" hint="" :text="name.fullName" />
          <underline-form textwidth="11rem" beforetext=", of" hint="" :text="name.address" />
          <underline-form textwidth="9.55rem" beforetext=", " hint="" :text="name.occupation" />
          <div style="display:inline-block;">,</div>
        </div>
      </div>

      <div v-if="applicantList.length > 1" style="margin:0 0 1rem 0rem;">
        SWEAR (OR AFFIRM) JOINTLY THAT:
      </div>
      <div v-else style="margin:0 0 1rem 0rem;">SWEAR (OR AFFIRM) THAT:</div>

      <ol style="margin:0rem 0 0 -1.5rem;">
        <!-- <1> -->
        <li>
          <div v-if="applicantList.length > 1" style="display:inline;">
            We are the applicants/some of the applicants referred to in the submission for estate
            grant in relation to the estate of
          </div>
          <div v-else style="display:inline;">
            I am one of the applicants referred to in the submission for estate grant in relation to
            the estate of
          </div>

          <underline-form
            style="margin:0.25rem 0 0 0 ;display:inline-block; text-indent: 5px;"
            textwidth="29rem"
            beforetext=""
            hint=""
            :text="deceased.fullName"
          />
          <div style="margin:0.25rem  0 0 0 ; display:inline; text-indent: 5px;">
            (the "deceased").
          </div>
        </li>

        <!-- <2> -->
        <li class="mt-3">
          <underline-form
            v-if="applicantList.length > 1"
            style=""
            textwidth="26.25rem"
            beforetext="We have read the affidavit in Form "
            hint=""
            text="P5"
          />
          <underline-form
            v-else
            style=""
            textwidth="27.25rem"
            beforetext="I have read the affidavit in Form "
            hint=""
            text="P5"
          />

          <underline-form
            style="margin:0.25rem 0 ;display:inline-block; "
            textwidth="12.5rem"
            beforetext="sworn"
            hint=""
            :text="form5Info.date"
          />
          <underline-form
            style="margin:0.25rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="22.75rem"
            beforetext="by"
            hint=""
            :text="form5Info.applicantFullName"
          />

          <div v-if="applicantList.length > 1" style="margin:0 0 0 0; display:inline-block;">
            and there is nothing in that affidavit that we know to be inaccurate.
          </div>
          <div v-else style="margin:0 0 0 0; display:inline-block;">
            and there is nothing in that affidavit that I know to be inaccurate.
          </div>
        </li>
        <!-- <3> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            We have read the submission for estate grant and the other documents referred to in that
            document and we believe that the information contained in that submission for estate
            grant and those documents is correct and complete.
          </div>

          <div v-else style="display:inline;">
            I have read the submission for estate grant and the other documents referred to in that
            document and I believe that the information contained in that submission for estate
            grant and those documents is correct and complete.
          </div>
        </li>
        <!-- <4> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            We will administer according to law the deceased's estate to which the submission for
            estate grant relates and we acknowledge that, in doing this, we will be subject to the
            legal responsibility of a personal representative.
          </div>
          <div v-else style="display:inline;">
            I will administer according to law the deceased's estate to which the submission for
            estate grant relates and I acknowledge that, in doing this, I will be subject to the
            legal responsibility of a personal representative.
          </div>
        </li>
      </ol>

      <div class="mt-2 row">
        <div class="col-7">
          <div style="margin:0.5rem 0 0.5rem 0rem;">
            SWORN (OR AFFIRMED) BEFORE ME
          </div>
          <underline-form textwidth="12.5rem" beforetext="at" hint="Commissioner City" text="" />
          <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
            , British Columbia
          </div>

          <underline-form
            style="margin:0.75rem 0 ;"
            textwidth="19rem"
            beforetext="on"
            hint="Swear/Affirm Date"
            text=""
          />
          <underline-form
            style="margin:0.5rem 0 ;"
            textwidth="20.5rem"
            beforetext=""
            hint="A commissioner for taking affidavits for British Columbia"
            text=""
          />
          <!-- <div style="margin:0.5rem 0; font-size:14px;"></div> -->
          <underline-form
            style="margin:.5rem 0 ;"
            textwidth="20.5rem"
            beforetext=""
            hint="[print name or affix stamp of commissioner]"
            text=""
          />
        </div>
        <div class="col-5" style="border-left:1px solid #313132">
          <div v-for="(name, i) in applicantList" :key="i + 250">
            <underline-form
              :style="{ marginTop: getSignatureMargin() }"
              textwidth="19rem"
              beforetext=""
              :italicHint="false"
              hintFontSize="10pt"
              :hint="'Signature of ' + name.fullName"
              text=""
            />
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";
import CheckBox from "@/components/pdf/components/CheckBox.vue";

@Component({
  components: {
    UnderlineForm,
    CheckBox
  }
})
export default class FormP8 extends Vue {
  check = ""; //"&#10003"
  check2 = "&#10003";

  applicantList = [];
  deceased = {
    fullName: "Rest In Peace",
    first: "Rest",
    middle: "In",
    last: "Peace",
    address: "0-123 st, Victoria, BC, Canada V0i 8i8"
  };
  serviceContact = {
    address: "0-123 st, Victoria, BC, Canada V0i 8i8",
    phone: "+1 123 456 7890",
    fax: "+1 123 456 7890",
    email: "ABC@yahoo.ca"
  };
  form5Info = {
    applicantFullName: "Its first daughter",
    first: "Its",
    middle: "first",
    last: "Daughter",
    date: "March 20, 2020"
  };

  mounted() {
    this.getRepGrantResultData();
    this.changeApplicantList();
  }
  multipleApplicant = false;
  public changeApplicantList() {
    this.applicantList = [];
    if (this.multipleApplicant) {
      this.applicantList.push(
        {
          fullName: "Its first Son",
          first: "Its",
          middle: "first",
          last: "Son",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA",
          occupation: "worker",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(b)"
        },
        {
          fullName: "Its first Daughter",
          first: "Its",
          middle: "first",
          last: "Daughter",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "work",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(a)"
        },
        {
          fullName: "Its second Son",
          first: "Its",
          middle: "second",
          last: "Son",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          lawyer: "Its good lawyer",
          occupation: "working",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(c)"
        },
        {
          fullName: "Its second Daughter",
          first: "Its",
          middle: "second",
          last: "Daughter",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "worker",
          city: "Vancouver",
          state: "BC",
          country: "Canada",
          section130: "(d)"
        },
        {
          fullName: "Its third Son",
          first: "Its",
          middle: "third",
          last: "Son",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA",
          occupation: "work",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(d)"
        },
        {
          fullName: "Its third Daughter",
          first: "Its",
          middle: "third",
          last: "Daughter",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "worker",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(e)"
        },
        {
          fullName: "Its fourth Son",
          first: "Its",
          middle: "fourth",
          last: "Son",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          lawyer: "Its good lawyer",
          occupation: "work",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(f)"
        },
        {
          fullName: "Its fourth Daughter",
          first: "Its",
          middle: "fourth",
          last: "Daughter",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "working",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(f)"
        },
        {
          fullName: "Its fifth Son",
          first: "Its",
          middle: "fifth",
          last: "Son",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA",
          occupation: "worker",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(f)"
        },
        {
          fullName: "Its fifth Daughter",
          first: "Its",
          middle: "fifth",
          last: "Daughter",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "work",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(a)"
        }
      );
    } else {
      this.applicantList.push({
        fullName: "Its first Son",
        first: "Its",
        middle: "first",
        last: "Son",
        address: "Victoria, BC, Canada",
        notIndividual: "",
        individual: "yes",
        sameMail: "",
        differentMail: "yes",
        differentAddress: "New York, USA",
        occupation: "work",
        city: "Victoria",
        state: "BC",
        country: "Canada",
        section130: "(a)"
      });
    }
  }

  public getSignatureMargin() {
    let margin = Number(10 / this.applicantList.length);
    if (margin < 1.0) margin = 1;
    return margin + "rem";
  }

  public getAllApplicants(len: number) {
    let result = "";
    for (const name of this.applicantList) result += name.fullName + ", ";
    result = result.slice(0, -2);
    if (result.length > len) result = result.slice(0, len) + "...";
    return result;
  }

  public async getPdf() {
    const data = {};
    const formName = "FormP8";
    //const response = await SurveyDataService.getPdf(formName, data, {});
    //convertBlobAndDownload(response, formName);
  }

  public getRepGrantResultData() {}
}
</script>
<style scoped>
.table >>> th.border-dark {
  border: 1px solid #000;
}
.table >>> td.border-dark {
  border: 1px solid #000;
}

section {
  counter-increment: question-counter;
  float: left;
  text-indent: -20px;
  text-align: justify;
  text-justify: inter-word;
  margin: 1rem 0.5rem 0.5rem 0rem;
}

section:before {
  font-weight: bolder;
  content: counter(question-counter) ".";
}

dsection:after {
  float: none;
  white-space: pre;
}

section.reset-question {
  counter-reset: question-counter;
}

ol.reset-counter {
  list-style: none;
  counter-reset: bracket-counter;
}
ol li.bracket-number {
  text-indent: -25px;
  text-align: justify;
  text-justify: inter-word;
  margin: 1rem 0;
  counter-increment: bracket-counter;
}
ol li.bracket-number:before {
  content: "(" counter(bracket-counter) ") ";
  font-weight: bold;
}

ol.reset-list {
  list-style: none;
  counter-reset: list-counter;
}
ol li.list-number {
  text-indent: -25px;
  text-align: justify;
  text-justify: inter-word;
  margin: 1rem 0;
  counter-increment: list-counter;
}
ol li.list-number:before {
  content: counter(list-counter) ". ";
  font-weight: bold;
}

.container {
  padding: 40px !important;
  margin-right: auto !important;
  margin-left: auto !important;
  width: 100% !important;
  max-width: 760px !important;
  min-width: 760px !important;
  font-size: 10pt !important;
  font-family: BCSans;
  color: #313132 !important;
}
</style>
