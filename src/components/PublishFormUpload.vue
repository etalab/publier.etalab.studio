<template>
  <div>
    <b-form>
      <p class="text-muted">
        {{ publicationIntro }}
      </p>
      <!---
      <div class="radio-boxes">

        <div class="radio-box">
          <p style="">Je souhaite publier au nom de mon organisation<span class="text-danger">*</span></p>
          
        </div>
        <div class="radio-box" @click="radioclick('org')">
          <input type="radio" id="two" value="org" v-model="whoPicked">
          <label for="two">&nbsp;au nom de mon organisation
          &nbsp;&nbsp;&nbsp;
          <img src="../static/images/group.png" width="50" height="50"/></label>
        </div>
        <div class="radio-box" @click="radioclick('me')">
          <input type="radio" id="one" value="me" v-model="whoPicked">
          <label for="one">&nbsp;en mon nom
          &nbsp;&nbsp;&nbsp;
          <img src="../static/images/man.png" width="50" height="50"/></label>
        </div>
      </div>
        -->

      <!-- Organisation -->
      <b-form-group
        v-if="orgaShow"
        id="input-group-org"
        label-for="input-org"
        description="Choisissez l'organisation dans laquelle sera créé le jeu de données"
      >
        <template v-slot:label>
          Organisation productrice des données<span class="text-danger">*</span>
        </template>
        <div v-if="organizations.length > 0">
          <br />
          <b-form-select
              id="input-org"
              v-model="form.org"
              :options="organizations"
              v-on:change="onChange"
              class="fr-select"
              required
          ></b-form-select>
          <div style="font-size: 12px">
            <i>Je ne trouve <span style="cursor: pointer; text-decoration: underline" @click="orgaNotFound = true">pas mon organisation.</span></i>
          </div>
        </div>
        <div v-if="organizations.length == 0 || orgaNotFound">
          <br />
          <div class="fr-callout fr-mb-3w">
            <span  v-if="organizations.length == 0">Vous n'êtes pas rattaché à une organisation sur data.gouv.fr. </span>
            <span  v-else>Vous ne trouvez pas votre organisation.</span>
            <br />Pour publier vos données depuis votre organisation, suivez la procédure suivante :
            <ul>
              <li>Sauvegarder vos données sur votre ordinateur.</li>
              <li><a target="_blank" href="https://www.data.gouv.fr/fr/">Connectez-vous à votre compte data.gouv.fr</a></li>
              <li>Rendez-vous sur la <a target="_blank" href="https://www.data.gouv.fr/fr/admin/organization/new/">page de création d’une organisation</a>, en cliquant sur le lien <b>Créez ou trouvez votre organisation</b> dans le bandeau <b>Participez</b> en bas de page.</li>
            </ul>
            Une fois ces étapes réalisées, cette page devrait se rafraîchir automatiquement et vous devriez être capable de sélectionner votre organisation.
            <br /><br />
            <div style="font-size: 12px">PS : Vous pouvez publier vos données <span style="cursor: pointer; text-decoration: underline" @click="radioclick('me')">en votre nom propre</span> mais ce mode de publication est <b>fortement déconseillé.</b></div>
          </div>
        </div>
      </b-form-group>


      <div v-if="jddShow && !orgaShow" class="fr-callout fr-fi-information-line fr-callout--scheme-soft-blue-soft fr-mb-3w">
        <span>Attention, il est conseillé de publier vos données depuis une organisation plutôt qu'avec son compte personnel.</span>
        <br />
        <br />
        <div>Publier vos données <span style="cursor: pointer; text-decoration: underline" @click="radioclick('org')">via votre organisation</span></b></div>
      </div>

      <div v-if="jddShow" class="radio-boxes">
        <div class="radio-box">
          <p style="line-height: 50px;">Jeu de données :</p>
        </div>
        <div class="radio-box" @click="radioclickJDD('existing')">
          <input type="radio" id="three" value="existing" v-model="typePicked">
          <label for="three">&nbsp;déjà existant
          &nbsp;&nbsp;&nbsp;
          <img src="../static/images/edit.png" width="50" height="50"/></label>
        </div>
        <div class="radio-box" @click="radioclickJDD('new')">
          <input type="radio" id="four" value="new" v-model="typePicked">
          <label for="four">&nbsp;à créer
          &nbsp;&nbsp;&nbsp;
          <img src="../static/images/new.png" width="50" height="50"/></label>
        </div><span class="text-danger">*</span>
      </div>

      <!-- existing Dataset -->
      <b-form-group
        v-if="jddShow && editJDDShow && selectMe"
        id="input-group-editjdd-me"
        label-for="input-editjdd-me"
        description="Choisissez le jeu de données dans lequel sera chargé votre fichier"
      >
        <template v-slot:label>
          Sélectionner votre jeu de données : <span class="text-danger">*</span>
        </template>
        <b-form-select
          id="input-editjdd-me"
          v-model="form.existingDataset"
          v-on:change="onChangeJDDMe"
          class="fr-select"
        >
          <option class="fr-select" v-for="ds in datasetsMe" v-bind:key="ds.id" :value="ds.id" >
            {{ ds.title }}
          </option>
        </b-form-select>
      </b-form-group>

      <!-- existing Dataset -->
      <b-form-group
        v-if="jddShow && editJDDShow && selectOrg"
        id="input-group-editjdd-org"
        label-for="input-editjdd-org"
        description="Choisissez le jeu de données dans lequel sera chargé votre fichier"
      >
        <template v-slot:label>
          Sélectionner votre jeu de données : <span class="text-danger">*</span>
        </template>
        <b-form-select
          id="input-editjdd-org"
          v-model="form.existingDataset"
          v-on:change="onChangeJDDOrg"
        >
          <option v-for="ds in datasetsOrg"  v-bind:key="ds.id" :value="ds.id">
            {{ ds.title }}
          </option>
        </b-form-select>
      </b-form-group>

      <!-- Dataset title -->
      <b-form-group
        v-if="jddShow && newJDDShow"
        id="input-group-dataset-title"
        label-for="input-dataset-title"
      >
        <template v-slot:label>
          Nom du jeu de données <span class="text-danger">*</span>
        </template>
        <b-form-input
          id="input-dataset-title"
          v-model="form.dataset.title"
          v-on:input="onChange"
          :trim="true"
          class="fr-input"
        ></b-form-input>
      </b-form-group>

      <!-- Dataset description -->
      <b-form-group
        v-if="jddShow && (newJDDShow || editJDDShow)"
        id="input-group-dataset-description"
        label-for="input-dataset-description"
      >
        <template v-slot:label>
          Description du jeu de données <span class="text-danger">*</span>
        </template>
        <b-form-textarea
          id="input-dataset-description"
          v-model="form.dataset.description"
          rows="4"
          v-on:input="onChange"
          :trim="true"
          class="fr-input"
        ></b-form-textarea>
      </b-form-group>

      <div v-if="jddShow && editJDDShow && this.form.existingDataset != ''" class="radio-boxes">
        <div class="radio-box">
          <p style="line-height: 50px;">Ressource :</p>
        </div>
        <div class="radio-box" @click="radioclickRes('existing')">
          <input type="radio" id="five" value="existing" v-model="typeResPicked">
          <label for="five">&nbsp;déjà existante (à écraser)
          &nbsp;&nbsp;&nbsp;
          <img src="../static/images/edit.png" width="50" height="50"/></label>
        </div>
        <div class="radio-box" @click="radioclickRes('new')">
          <input type="radio" id="six" value="new" v-model="typeResPicked">
          <label for="six">&nbsp;à créer
          &nbsp;&nbsp;&nbsp;
          <img src="../static/images/new.png" width="50" height="50"/></label>
        </div><span class="text-danger">*</span>
      </div>

      <!-- existing resource -->
      <b-form-group
        v-if="jddShow && editJDDShow && editResShow"
        id="input-group-editres"
        label-for="input-editres"
        description="Choisissez la ressource que vous souhaitez écraser"
      >
        <template v-slot:label>
          Sélectionner votre ressource : <span class="text-danger">*</span>
        </template>
        <b-form-select
          id="input-editres"
          v-model="form.existingResource"
          class="fr-select"
        >
          <option class="fr-select" v-for="res in resources"  v-bind:key="res.id" :value="res.id" >
            {{ res.title }}
          </option>
        </b-form-select>
      </b-form-group>

      <!-- Resource title -->
      <b-form-group
        v-if="jddShow && (newJDDShow || (editJDDShow && typeResPicked != ''))"
        id="input-group-resource-title"
        label-for="input-resource-title"
      >
        <template v-slot:label>
          Nom du fichier <span class="text-danger">*</span>
        </template>
        <b-form-input
          id="input-resource-title"
          v-model="form.resource.title"
          v-on:input="onChange"
          :trim="true"
          class="fr-input"
        ></b-form-input>
      </b-form-group>
      <p class="text-muted">
        Les champs suivis d'une astérisque (<span class="text-danger">*</span>)
        sont obligatoires
      </p>
    </b-form>
  </div>
</template>
<script>
import $api from "../services/Api";

export default {
  props: {
    schemaName: String,
    schemaMeta: Object,
    organizations: Array,
    publicationIntro: String,
    filename: String,
    value: {
      type: undefined,
      required: true,
    },
  },
  data() {
    return {
      form: {
        org: "",
        dataset: {
          title: "",
          description: "",
        },
        resource: {
          title: "",
        },
        existingDataset: "",
        existingResource: "",
      },
      whoPicked: "",
      typePicked: "",
      typeResPicked: "",
      orgaShow: true,
      jddShow: false,
      descShow: false,
      filenameShow: false,
      newJDDShow: false,
      editJDDShow: false,
      datasetsMe: [],
      selectMe: false,
      selectOrg: true,
      datasetsOrg: [],
      resources: [],
      editResShow: false,
      orgaNotFound: false,
    };
  },
  mounted() {
    this.$emit("form-state-change", this.okState);
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    okState() {
      return (
        this.form.org !== "" &&
        (this.form.dataset.title !== "" || this.form.existingDataset !== "") &&
        this.form.dataset.description !== "" &&
        this.form.resource.title !== ""
      );
    },
    payload() {
      return {
        organizationId: this.form.org,
        dataset: {
          title: this.form.dataset.title,
          description: this.form.dataset.description,
        },
        resource: {
          title: this.form.resource.title,
          schemaName: this.schemaName,
        },
        existingDataset: this.form.existingDataset,
        existingResource: this.form.existingResource,
      };
    },
  },
  methods: {
    onChange() {
      if (this.form.resource.title == "")
        this.form.resource.title = this.filename;
      // eslint-disable-next-line prefer-destructuring
      const okState = this.okState;
      if (this.form.org !== "") {
        this.jddShow = true;
      }
      this.$emit("form-state-change", okState);
      if (okState) {
        this.$emit("input", this.payload);
      }
    },
    onChangeJDDMe() {
      this.datasetsMe.forEach((ds) => {
        if (ds.id === this.form.existingDataset) {
          this.form.dataset.title = ds.title;
          this.form.dataset.description = ds.description;
          this.resources = ds.resources;
          this.typeResPicked = "";
          this.form.resource.title = this.filename;
          this.form.existingResource = "";
          this.editResShow = false;
        }
      });
    },
    onChangeJDDOrg() {
      this.datasetsOrg.forEach((ds) => {
        if (ds.id === this.form.existingDataset) {
          this.form.dataset.title = ds.title;
          this.form.dataset.description = ds.description;
          this.resources = ds.resources;
          this.typeResPicked = "";
          this.form.resource.title = this.filename;
          this.form.existingResource = "";
          this.editResShow = false;
        }
      });
    },
    generateDatasetTitle() {
      var org = null;
      this.organizations.forEach((o) => {
        if (this.form.org == o.value) {
          org = o.text;
        }
      });
      if (org) {
        org = " (organisation " + org + ")";
      } else {
        org = "";
      }
      return this.schemaMeta.title + org;
    },
    generateDatasetDescription() {
      var desc = "";
      if (this.schemaMeta.schema_url.includes("schema.data.gouv.fr")) {
        desc =
          'Ce jeu de données répond aux spécifications du schéma "' +
          this.schemaMeta.title +
          '" disponible sur le site [schema.data.gouv.fr](https://schema.data.gouv.fr/' +
          this.schemaName +
          ")";
      } else {
        desc =
          'Ce jeu de données répond aux spécifications du schéma "' +
          this.schemaMeta.title +
          '" (spécification disponible [ici](' +
          this.schemaMeta.schema_url +
          "))";
      }
      return desc;
    },
    radioclick(who) {
      this.form.org = "";
      this.form.dataset.title = "";
      this.form.dataset.description = "";
      this.form.resource.title = this.filename;
      this.form.existingDataset = "";
      this.editJDDShow = false;
      this.newJDDShow = false;
      this.typePicked = "";
      this.onChange();

      if (who === "me") {
        this.orgaShow = false;
        this.jddShow = true;
        this.form.org = "me";
        this.selectMe = true;
        this.selectOrg = false;
      }
      if (who === "org") {
        this.orgaShow = true;
        this.jddShow = false;
        this.selectMe = false;
        this.selectOrg = true;
      }
    },
    radioclickJDD(type) {
      this.form.dataset.title = this.generateDatasetTitle();
      this.form.resource.title = this.filename;
      this.form.existingDataset = "";
      this.form.resource.title = this.filename;
      this.typeResPicked = "";
      this.form.existingResource = "";
      this.editResShow = false;
      if (type === "existing") {
        this.newJDDShow = false;
        this.editJDDShow = true;
        this.form.dataset.description = "";
        if (this.orgaShow) {
          this.getMyDatasetsOrg();
        } else {
          this.getMyDatasetsMe();
        }
      } else {
        this.form.dataset.description = this.generateDatasetDescription();
        this.newJDDShow = true;
        this.editJDDShow = false;
        this.datasetsMe = [];
      }
      this.onChange();
    },
    radioclickRes(type) {
      this.form.resource.title = this.filename;
      this.typeResPicked = "";
      this.form.existingResource = "";
      if (type === "existing") {
        this.editResShow = true;
      } else {
        this.editResShow = false;
      }
      this.onChange();
    },
    getMyDatasetsMe() {
      $api
        .get("me/datasets", {}, (err) => {
          // eslint-disable-next-line no-alert
          alert(`Erreur lors de la publication du jeu de données : ${err}`);
        })
        .then((response) => {
          this.datasetsMe = response.data;
        });
    },
    getMyDatasetsOrg() {
      $api
        .get(`organizations/${this.form.org}/datasets`, {}, (err) => {
          // eslint-disable-next-line no-alert
          alert(`Erreur lors de la publication du jeu de données : ${err}`);
        })
        .then((response) => {
          this.datasetsOrg = response.data.data;
        });
    },
  },
};
</script>

<style scoped>
.fr-callout {
  background-color: #d5dbef;
}
</style>
