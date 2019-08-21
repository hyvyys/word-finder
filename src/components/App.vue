<template>
  <div id="app">
    <header>
      <ui-toolbar
        type="colored"
        color="primary"
        :removeBrandDivider="true"
        :removeNavIcon="true"
        textColor="white"
        :loading="this.dataLoading"
      >
        <template v-slot:brand>
          <h1>Lettering Corpus</h1>
        </template>
      </ui-toolbar>
    </header>

    <div class="content">
      <div class="sidebar">
        <lettering-options
          :options="letteringOptions"
          :optionsValidation="optionsValidation"
          @input="applyOptions"
          @input:validation="validateOptions"
        ></lettering-options>

        <h3>Info</h3>
        <div>Click on any word to replace it.</div>

        <h4>Data source</h4>
        <p>Listings for individual languages come from Wiktionary and
          may include foreign or obsolete terms.
        <div class="link-wrapper" v-for="language in languages" :key="language">
          <ui-icon icon="exit_to_app"></ui-icon>
          <a
            class="link"
            :href="getLemmasUrl(language)"
            target="_blank"
          >{{ `${ language } lemmas — Wiktionary` }}</a>
        </div>
      </div>

      <main>
        <lettering
          v-for="lettering in letterings"
          :key="lettering.key"
          v-bind="lettering"
          :isSelected="selectedLettering == lettering"
          @remove="removeLettering(lettering.key)"
          @copy="createSnackbar(`Copied lettering to clipboard.`)"
          @click.native="selectLettering(lettering.key)"
          :loading="dataLoading"
        />

        <ui-icon-button icon="add" color="primary" v-on:click="addLettering"></ui-icon-button>
      </main>
    </div>

    <footer>
      <ui-toolbar
        type="colored"
        color="primary"
        :removeBrandDivider="true"
        :removeNavIcon="true"
        textColor="white"
      >
        <template v-slot:actions>
          <ui-icon-button icon="github" type="secondary"></ui-icon-button>
        </template>
      </ui-toolbar>
    </footer>

    <ui-snackbar-container id="snackbar-container" ref="snackbarContainer" position="right"></ui-snackbar-container>
  </div>
</template>

<style scoped lang='scss'>
@import "./App";
</style>

<script src='./App.js'>
</script>
