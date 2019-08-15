<template>
  <div :class="`lettering ${isSelected ? `selected` : ``}`">
    <div class="container">
      <div class="lettering-header">
        <h3 style="flex: 1;">{{ title }}</h3>

        <div class="btn-group">
          <ui-icon-button
            tooltip="Swap all words"
            @click="pickWords"
            :loading="loading || state.filterLoading"
            icon="refresh"
            :type="isSelected ? `primary` : `secondary`"
          ></ui-icon-button>

          <ui-icon-button
            tooltip="Copy to clipboard"
            @click="copy"
            :type="isSelected ? `primary` : `secondary`"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </svg>
          </ui-icon-button>

          <ui-icon-button
            tooltip="Discard"
            @click="remove"
            icon="delete"
            :type="isSelected ? `primary` : `secondary`"
          ></ui-icon-button>
        </div>
      </div>

      <div ref="words">
        <ui-button
          v-for="(entry, i) in formattedDrawnWords"
          :key="i"
          :class="`lettering-word ${focusedOption && !filterSatisfaction[i] ? `incomplete-match` : ``}`"
          :type="isSelected && (!focusedOption || filterSatisfaction[i]) ? `primary` : `secondary`"
          :color="`${!focusedOption || filterSatisfaction[i] ? `default` : `orange`}`"
          @mousedown.native="swapWordStart(entry.letter, $event)"
          @mouseup.native="swapWordEnd(entry.letter, $event)"
        >{{ entry.word }}</ui-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
@import "./Lettering";
</style>
<style lang='scss'>
@import "./Lettering.global";
</style>

<script src='./Lettering'>
</script>