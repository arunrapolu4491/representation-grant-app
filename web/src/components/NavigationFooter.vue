<template>
  <footer>
    <nav class="navbar navbar-expand-lg navbar-dark">
      <!-- Navbar content -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="terms" target="_blank">Terms of Use</a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="https://www2.gov.bc.ca/gov/content/home/disclaimer"
            target="_blank"
            >Disclaimer</a
          >
        </li>

        <li class="nav-item">
          <a
            class="nav-link"
            href="https://www2.gov.bc.ca/gov/content/home/privacy"
            target="_blank"
            >Privacy</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="https://www2.gov.bc.ca/gov/content/home/accessibility"
            target="_blank"
            >Accessibility</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="https://www2.gov.bc.ca/gov/content/home/copyright"
            target="_blank"
            >Copyright</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            href="feedback"
            target="_blank"
            >Contact Us</a
          >
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

@Component
export default class NavigationFooter extends Vue {

}
</script>

<style scoped lang="scss">
@import "@/styles/_common";

.navbar {
  position: fixed;
  bottom: 0;
  width: 100%;
}

</style>
