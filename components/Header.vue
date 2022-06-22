<template>
  <nav class="navbar navbar-expand navbar-light navbar-bg">
    <a ref="sidebarToggle" class="sidebar-toggle js-sidebar-toggle">
      <i class="hamburger align-self-center"></i>
    </a>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'HeaderComponent',
})
export default class Header extends Vue {
  initializeSidebarCollapse(): void {
    const sidebarElement = document.getElementsByClassName('js-sidebar')[0]
    const sidebarToggleElement = this.$refs.sidebarToggle as HTMLAnchorElement

    if (sidebarElement && sidebarToggleElement) {
      sidebarToggleElement.addEventListener('click', () => {
        sidebarElement.classList.toggle('collapsed')

        sidebarElement.addEventListener('transitionend', () => {
          window.dispatchEvent(new Event('resize'))
        })
      })
    }
  }

  protected mounted(): void {
    this.initializeSidebarCollapse()
  }
}
</script>
