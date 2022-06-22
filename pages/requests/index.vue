<template>
  <section>
    <div class="d-flex align-items-center justify-content-between">
      <h1 class="title">Solicitudes de permisos</h1>
      <nuxt-link to="/requests/save" class="btn btn-sm btn-primary">
        Crear
      </nuxt-link>
    </div>
    <div class="row">
      <data-table ref="dataTable" :options="dataTableOptions" class="col-12" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable from '@/components/DataTable.vue'
import { IDataTableOptions, IDataTableComponent } from '~/models/datatable'
import { PermissionDto } from '~/models/permissions'

@Component({
  name: 'PermissionIndexPage',
  components: {
    DataTable,
  },
})
export default class Index extends Vue {
  public $refs!: Vue['$refs'] & {
    dataTable: IDataTableComponent
  }

  dataTableOptions: IDataTableOptions = {
    lengthMenu: [10, 20, 50, 100],
    ajaxUrl: '/Requests/paginated',
    columns: [
      {
        data: 'name',
        label: 'Nombre',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'lastName',
        label: 'Apellido',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'date',
        label: 'Fecha de solicitud de permiso',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        label: 'Acciones',
        defaultContent: '',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
    ],
    actions: [
      {
        title: 'Editar',
        className: 'btn btn-sm btn-primary me-1',
        innerHTML: '<i class="fas fa-edit"></i>',
        click: (item: PermissionDto) => {
          this.$router.push(`/Requests/save/${item.id}`)
        },
      },
      {
        title: 'Eliminar',
        className: 'btn btn-sm btn-danger',
        innerHTML: '<i class="fas fa-trash"></i>',
        click: async (item: PermissionDto) => {
          await this.$axios.delete(`/Requests/${item.id}`)
          this.$refs.dataTable?.refresh()
        },
      },
    ],
  }
}
</script>
