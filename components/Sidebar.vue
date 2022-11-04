<template>
  <nav id="sidebar" class="sidebar js-sidebar">
    <div ref="sidebar" class="sidebar-content js-simplebar">
      <nuxt-link class="sidebar-brand" to="/">
        <span class="align-middle">LOTERIA</span>
      </nuxt-link>

      <ul class="sidebar-nav">
        <template v-for="(menu, menuIndex) in menus">
          <template v-if="menu.children">
            <li :key="menuIndex" class="sidebar-header h6">
              {{ menu.label }}
            </li>
            <li
              v-for="(child, childIndex) in menu.children"
              :key="`_${menuIndex}_${childIndex}`"
              class="sidebar-item"
            >
              <nuxt-link class="sidebar-link" :to="child.url">
                <i class="align-middle" :class="child.icon"></i>
                <span class="align-middle">{{ child.label }}</span>
              </nuxt-link>
            </li>
          </template>
          <li v-else :key="menuIndex" class="sidebar-item">
            <nuxt-link class="sidebar-link" :to="menu.url">
              <i class="align-middle" :class="child.icon"></i>
              <span class="align-middle">{{ menu.label }}</span>
            </nuxt-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Simplebar from 'simplebar'

interface Menu {
  url?: string
  icon?: { [key: string]: boolean }
  label: string
  children?: Menu[]
}

@Component({
  name: 'SidebarComponent',
})
export default class Sidebar extends Vue {
  menus: Menu[] = [
    {
      label: 'Dashboard',
      children: [
        {
          url: '',
          label: 'Ventas del día',
        },
        {
          url: '',
          label: 'Ventas por lotería',
        },
      ],
      
    },
    {
      label: 'Tickets',
      children: [
        {
          url: '',
          label: 'Registrar',
        },
        {
          url: '',
          label: 'Monitor de tickets',
        },
      ],
      
    },
    {
      label: 'Reportes',
      children: [
        {
          url: '',
          label: 'Ventas del día',
        },
        {
          url: '',
          label: 'Ventas detalladas periodo',
        },
        {
          url: '',
          label: 'Ventas resumen periodo',
        },
        {
          url: '',
          label: 'Números ganadores res',
        },
        {
          url: '',
          label: 'Números ganadores det',
        },
      ],
      
    },
    {
      label: 'Configuración',
      children: [
        {
          url: '/point_of_sale',
          label: 'Puntos de ventas',
        },
        {
          url: '',
          label: 'Usuarios',
        },
        {
          url: '',
          label: 'Roles',
        },
        {
          url: '',
          label: 'Zonas',
        },
        {
          url: '',
          label: 'Loterias',
        },
        {
          url: '',
          label: 'Bloqueo de números',
        },
      ],
      
    },
    {
      label: 'Transacciones',
      children: [
        {
          url: '',
          label: 'Cobros',
        },
        {
          url: '',
          label: 'Pagos',
        },
        {
          url: '',
          label: 'Gastos',
        },
      ],
      
    },
   
  ]
child: any

  initializeSimplebar(): void {
    const sidebar = this.$refs.sidebar as HTMLElement
    if (!sidebar) return

    const simplebarInstance = new Simplebar(sidebar)
    const sidebarDropdowns = document.querySelectorAll(
      '.js-sidebar [data-bs-parent]'
    )

    sidebarDropdowns.forEach((link) => {
      link.addEventListener('shown.bs.collapse', () => {
        simplebarInstance.recalculate()
      })
      link.addEventListener('hidden.bs.collapse', () => {
        simplebarInstance.recalculate()
      })
    })
  }

  protected mounted(): void {
    this.initializeSimplebar()
  }
}
</script>
