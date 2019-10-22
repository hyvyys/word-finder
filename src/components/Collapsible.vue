<template>
  <div class='collapsible' :class="{ 'is-collapsed': isCollapsed }">
    <div v-if="!toggleSelector" @click="toggle">
      <slot name="header"/>
    </div>
    <div v-show="!isCollapsed">
      <slot/>
    </div>
  </div>
</template>

<script>
import Collapsible from "@/mixins/Collapsible.js";
export default {
  mixins: [ Collapsible ]
}
</script>