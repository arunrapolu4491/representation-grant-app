<template>
  <div v-if="dataIsReady">
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
        FORM P2 (RULE 25-3 (2) )
      </div>

      <div class="mt-0 m-0 p-0 row">
        <div style="margin:0 0 0 25.25rem;">
          <div class="mt-2">
            <underline-form textwidth="13.2rem" beforetext="" hint="" :text="applicantCourtHouse" />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              Registry
            </div>
          </div>
          <div class="mt-2">
            <underline-form textwidth="14.9rem" beforetext="No." hint="" text="" />
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:1rem 0 1rem 0;font-weight:bold;font-size:14pt;">
        <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
      </div>
      <div style="text-align:center;font-size:12pt;">
        <i>In the Matter of the Estate of {{ deceased.fullName }}, deceased</i>
      </div>
      <div style="text-align:center;margin:1.25rem 0 3rem 0;font-weight:bold;font-size:10pt;">
        SUBMISSION FOR ESTATE GRANT
      </div>

      <div>
        <div style="display:inline-block; font-weight:bold; margin-right:0.5rem;">
          This submission for estate grant is submitted by:
        </div>

        <div
          style="display:inline-block; margin:0.5rem 0;"
          v-for="(name, i) in applicantList"
          :key="i + 50"
        >
          <underline-form
            v-if="i == 0"
            textwidth="21.25rem"
            beforetext=""
            hint=""
            :text="name.fullName"
          />
          <underline-form v-else textwidth="42rem" beforetext="" hint="" :text="name.fullName" />
        </div>
      </div>

      <div style="margin:0.5rem 0 0rem 0rem;">
        <span v-if="applicantList.length > 1"> We are </span>
        <span v-else> I am </span>
        <span
          >applying for the following in relation to the estate of the deceased described in Part 1
          of this submission for estate grant (the "deceased"):</span
        >
      </div>

      <ul>
        <li>Grant of administration without will annexed</li>
        <li>
          <span v-if="applicantList.length > 1"> We are </span>
          <span v-else> I am </span>
          <span
            >submitting with this submission for estate grant an affidavit of assets and liabilities
            in Form P10 for estate grant and therefore do not require an authorization to obtain
            estate grant information.
          </span>
        </li>
      </ul>

      <div style="margin:0.5rem 0 1rem 0rem;">
        <span v-if="applicantList.length > 1"> We </span>
        <span v-else> I </span>
        <underline-form
          textwidth="5rem"
          beforetext="request"
          hint=""
          :text="printCertifiedCopies"
        />
        <span> certified copy(ies) of the estate grant.</span>
      </div>

      <div style="margin:0.5rem 0 0.5rem 0rem;">
        <span>This submission for estate grant has 4 Parts:</span>
      </div>

      <ol style="margin:0rem 0 2rem 0;">
        <div class="mb-2" style="text-indent: 10px;">
          Part 1: Information about the Deceased
        </div>
        <div class="mb-2" style="text-indent: 10px;">
          Part 2: Contact Information about the Applicant(s)
        </div>
        <div class="mb-2" style="text-indent: 10px;">
          Part 3: Documents filed with the submission for estate grant
        </div>
        <div class="mb-2" style="text-indent: 10px;">Part 4: Schedule</div>
      </ol>

      <div class="mt-5">
        <underline-form textwidth="10rem" beforetext="Date" hint="" text="" />
        <underline-form
          style="margin-left:2rem;"
          textwidth="27rem"
          beforetext=""
          :hint="'Signiture of ' + applicantList[0].fullName"
          text=""
        />
      </div>

      <div class="new-page" />

      <!-- <Part 1> -->
      <div style="text-align:left;margin:0rem 0 0.5rem 0;font-weight:bold;font-size:12pt;">
        PART 1 - INFORMATION ABOUT THE DECEASED
      </div>

      <div class="ml-4">
        <div>
          <underline-form
            textwidth="29.2rem"
            beforetext="Full legal name of deceased:"
            hint=""
            :text="deceased.fullName"
          />
        </div>

        <div style="margin:1rem 0">
          <span
            >Other names in which the deceased held or may have held an interest in property:</span
          >
          <ol>
            <li v-if="deceasedAliases.length == 0" style="text-indent: 10px;">
              none
            </li>
            <li
              v-else
              class="mb-2"
              style="text-indent: 10px;"
              v-for="(name, i) in deceasedAliases"
              :key="i"
            >
              {{ name }}
            </li>
          </ol>
        </div>

        <div style="margin:1rem 0">
          <span>Last residential address of the deceased:</span>
          <ol>
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Street number and street name: "
              hint=""
              :text="deceased.address.street"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="City/Town: "
              hint=""
              :text="deceased.address.city"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Province: "
              hint=""
              :text="deceased.address.state"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Country: "
              hint=""
              :text="deceased.address.country"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Postal Code: "
              hint=""
              :text="deceased.address.postcode"
            />
          </ol>
        </div>

        <div style="margin-top:8rem !important;">
          <underline-form
            textwidth="12rem"
            beforetext="Deceased's date of death: "
            hint=""
            :text="deceased.DOD"
          />
        </div>

        <div style="margin:0.5rem 0 1rem 0rem;">
          <div v-if="!deceasedFirstNations" class="mb-2">
            The deceased was neither a Nisga'a citizen nor a member of a treaty first nation.
          </div>
          <div v-else-if="deceasedFirstNations && deceasedNisaga" class="mb-2">
            The deceased was a Nisga'a citizen.
          </div>
          <div v-else-if="deceasedFirstNations && !deceasedNisaga" class="mb-2">
            <underline-form
              textwidth="20rem"
              beforetext="The deceased was a member of the "
              hint=""
              :text="deceasedFirstNationsName"
            />
            treaty first nation.
          </div>
        </div>
      </div>

      <!-- <Part 2> -->
      <div style="text-align:left;margin:0rem 0 0.5rem 0;font-weight:bold;font-size:12pt;">
        PART 2 - CONTACT INFORMATION FOR THE APPLICANT(S)
      </div>

      <ol style="margin:0rem 0 0 -1rem;">
        <underline-form
          textwidth="30rem"
          beforetext="Street address for service: "
          hint=""
          :text="serviceContact.address"
        />
        <underline-form
          textwidth="32.35rem"
          beforetext="Telephone Number: "
          hint=""
          :text="serviceContact.phone"
        />
        <underline-form
          textwidth="29.9rem"
          beforetext="E-mail address for service: "
          hint=""
          :text="serviceContact.email"
        />
      </ol>

      <!-- <Part 3> -->
      <div style="text-align:left;margin:1rem 0 0.5rem 0;font-weight:bold;font-size:12pt;">
        PART 3 - DOCUMENTS FILED WITH THIS SUBMISSION FOR ESTATE GRANT
      </div>

      <ol>
        <li class="mb-2">
          <underline-form
            textwidth="5rem"
            beforetext="There is one applicant to this submission for estate grant and a "
            hint=""
            text="P5"
          />
          affidavit is filed with this submission for estate grant.
        </li>
        <li class="mb-2">
          No affidavit of delivery is attached. In accordance with Rule 25-2, no one, other than the
          applicant(s), is entitled to notice.
        </li>
        <li class="mb-2">
          Filed with this submission for estate grant are 2 copies of the certificate of the chief
          executive officer under the Vital Statistics Act indicating the results of a search for a
          wills notice filed by or on behalf of the deceased.
        </li>
        <li class="mb-2">
          This application is for a grant of administration without will annexed.
        </li>
        <li class="mb-2">
          This application is for a grant of administration without will annexed and therefore there
          can be no orders affecting the validity or content of a will.
        </li>

        <li class="mb-2">
          This application is for a grant of administration without will annexed and therefore there
          is no will to refer to additional documents.
        </li>

        <li class="mb-2">
          No documents other than those described elsewhere in this submission for estate grant are
          filed with this submission for estate grant.
        </li>

        <li>
          All documents filed with this submission for estate grant are written in the English
          language.
        </li>
      </ol>

      <!-- <Part 4> -->
      <div style="text-align:left;margin:0.5rem 0 0.5rem 0;font-weight:bold;font-size:12pt;">
        PART 4 - SCHEDULE
      </div>

      <ol>
        <li class="mb-2" style="text-indent: 5px;">
          Attached to this submission for estate grant is a Schedule for Grant of Administration
          without Will Annexed.
        </li>
      </ol>

      <!-- <NEW PAGE> -->
      <div class="new-page"></div>

      <div style="text-align:left;margin:0.5rem 0 0.5rem 0;font-weight:bold;font-size:12pt;">
        SCHEDULE FOR GRANT OF ADMINISTRATION WITHOUT WILL ANNEXED
      </div>

      <ol>
        <li class="mb-2" style="text-indent: 5px;">
          Listed in each of the following paragraphs is every person who falls within the class of
          persons identified by that paragraph:

          <ol class="reset-counter" style="margin:0rem 0 0 0;">
            <li class="bracket-alpha">
              spouse, if any, of the deceased:
              <div class="mt-1" style="text-indent: 5px;">{{ spouseName }}</div>
            </li>
            <li class="bracket-alpha">
              child(ren), if any, of the deceased:
              <div class="mt-1" v-if="childrenList.length == 0" style="text-indent: 5px;">
                none
              </div>
              <div class="mt-1" v-if="childrenList.length != 0" style="text-indent: 5px;">
                <span v-for="(name, i) in childrenList" :key="i"
                  >{{ name }}<br v-if="i != childrenList.length - 1"
                /></span>
              </div>
            </li>
            <li class="bracket-alpha">
              each person, if any, not named in paragraph (a) or (b), who is entitled to receive all
              or part of the estate of a person who dies without a will:
              <div class="mt-1" style="text-indent: 5px;">none</div>
            </li>
            <li class="bracket-alpha">
              each creditor of the deceased, if any, not named in paragraph (a), (b) or (c) whose
              claim exceeds $10,000:
              <div class="mt-1" v-if="creditorList.length == 0" style="text-indent: 5px;">
                none
              </div>
              <div class="mt-1" v-if="creditorList.length != 0" style="text-indent: 5px;">
                <span v-for="(name, i) in creditorList" :key="i"
                  >{{ name }}<br v-if="i != creditorList.length - 1"
                /></span>
              </div>
            </li>
            <li class="bracket-alpha">
              each citor, if any, not named in paragraph (a), (b), (c) or (d):
              <div class="mt-1" v-if="citorList.length == 0" style="text-indent: 5px;">
                none
              </div>
              <div class="mt-1" v-if="citorList.length != 0" style="text-indent: 5px;">
                <span v-for="(name, i) in citorList" :key="i"
                  >{{ name }}<br v-if="i != citorList.length - 1"
                /></span>
              </div>
            </li>
          </ol>
        </li>
      </ol>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";

@Component({
  components: {
    UnderlineForm
  }
})
export default class FormP2 extends Vue {
  dataIsReady = false;
  multipleApplicant = false;
  applicantList = [];
  deceasedFirstNations = false;
  deceasedNisaga = false;
  deceasedFirstNationsName = "";
  applicantCourtHouse = "";
  deceased;
  serviceContact;
  printCertifiedCopies = 0;
  spouseName = "";
  childrenList = [];
  otherRelatedPeopleList = [];
  citorList = [];
  creditorList = [];
  deceasedName = "";

  mounted() {
    this.dataIsReady = false;
    this.getRepGrantResultData();
    this.getApplicantsInfo();
    this.getDeceasedInfo();
    this.getRelatedPeopleInfo();
    this.getCreditorInfo();
    this.getOverviewInfo();
    this.dataIsReady = true;
  }

  public getDeceasedInfo() {}

  public getRelatedPeopleInfo() {
    this.childrenList = [];
    this.otherRelatedPeopleList = [];
  }

  public getApplicantsInfo() {
    if (this.multipleApplicant) {
      this.changeApplicantList();
    } else {
      this.applicantList = [];
      this.citorList = [];
    }
  }

  public getCreditorInfo() {}

  public getOverviewInfo() {}

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
      this.getApplicantsInfo();
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

  public async onPrint() {
    const data = {};
    const formName = "FormP2";
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

.new-page {
  margin-top: 9rem;
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

ol li.bracket-alpha {
  text-indent: -20px;
  margin: 0.75rem 0;
  counter-increment: alpha;
}

ol li.bracket-alpha:before {
  content: "(" counter(alpha, lower-alpha) ") ";
}

ol.reset-list {
  list-style: none;
  counter-reset: list-counter;
}
ol li.list-number {
  text-indent: -25px;
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
