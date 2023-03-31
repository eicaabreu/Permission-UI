<template>
  <section>
    <div class="d-flex align-items-center justify-content-between">
      <h3>Solcitudes de permisos</h3>
      <button
        type="button"
        class="btn btn-md btn-outline-primary"
        @click="toggleSaveModal"
      >
      <i class="fas fa-plus"></i>  Crear </button>
    </div>
    <div class="row">
      <data-table ref="dataTable" :options="dataTableOptions" class="col-12" />
    </div>
    <div id="save-modal" class="modal fade" tabindex="-1" aria-hidden="true">
      <form @submit.prevent="onSaveHandler">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ saveTitle }}</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12">
                <label for="text" class="col-form-label required">Nombre</label>
                <input
                  id="name"
                  v-model="savePermission.name"
                  type="text"
                  class="form-control"
                />
              </div>
              </div>
              <div class="row">
              <div class="col-12">
                <label for="text" class="col-form-label required">Apellido</label>
                <input
                  id="lastName"
                  v-model="savePermission.lastName"
                  type="text"
                  class="form-control"
                />
              </div>
              </div>
              <div class="row">
              <div class="col-12">
                <label for="text" class="col-form-label required">Tipo de permiso</label>
                <select
                  id="permissionTypeId"
                  v-model="savePermission.permissionTypeId"
                  class="form-select"
                  required
                >
                  <option
                    v-for="(permissionType, index) in permissionTypes"
                    :key="index"
                    :value="permissionType.id"
                  >
                    {{ permissionType.name }}
                  </option>
                </select>
              </div>
              </div>
           
            </div>
            <div class="modal-footer">
              <button
                id="save-button"
                type="submit"
                class="btn btn-md btn-outline-primary"
                data-loading-text="<i class='fas fa-spinner fa-spin'></i>"
                
              >
                 Guardar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<!-- <router lang="js">
{
  meta: {
    permissions: ['categories.view.index']
  }
}
</router> -->

<script lang="ts">
import { Modal } from 'bootstrap'
import { Component, Vue } from 'vue-property-decorator'
import DataTable from '@/components/DataTable.vue'
import { IDataTableOptions, IDataTableComponent } from '~/models/datatable'
import { PermissionDto, SavePermission } from '~/models/permission'
import { CatalogDto } from '~/models/common'
import Swal from 'sweetalert2'
import { json } from 'body-parser'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants'

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

  saveModal: Modal | undefined
  isSaving: boolean = false
  permissionTypes: CatalogDto[] = []
  savePermission: SavePermission = {
    id: 0,
    name: '',
    lastName: '',
    permissionTypeId: 0
  }

  dataTableOptions: IDataTableOptions = {
    lengthMenu: [10, 20, 50, 100],
    ajaxUrl: '/Permission/datatable',
    columns: [
    {
        data: 'id',
        label: 'ID de permiso',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
        render: (id: number | undefined | null) => {
          return `
            <div class="text-center">${id}</div>
          `
        },
      },
    {
        data: 'name',
        label: 'Nombre',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
        render: (name: string | undefined | null) => {
          return `
            <div class="text-center">${name}</div>
          `
        },
      },
      {
        data: 'lastName',
        label: 'Apellido',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
        render: (lastName: string | undefined | null) => {
          return `
            <div class="text-center">${lastName}</div>
          `
        },
      },
      {
        data: 'createdAt',
        label: 'Fecha de permiso',
        classList: {
          'text-center': true,
        },
        render: (createdAt: string | undefined | null) => {
          return `
            <div class="text-center">${createdAt}</div>
          `
        },
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
        className: 'btn btn-sm btn-outline-primary me-1',
        innerHTML: '<i class="fas fa-edit"></i>',
        click: (item: PermissionDto) => {
          this.toggleSaveModal(item)
        },
      },
      {
        title: 'Eliminar',
        className: 'btn btn-sm btn-outline-danger',
        innerHTML: '<i class="fas fa-trash"></i>',
        click: (item: PermissionDto) => {
          Swal.fire({
            title: 'Estas seguro de eliminar esta Solicitud?',
            text: 'No podra volver a recupar esta informacion',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
          }).then(async (result) => {
            if (result.isConfirmed) {
              await this.$axios.delete(`/Permission/${item.id}`)
              this.$refs.dataTable?.refresh()
              Swal.fire('Eliminado', 'la solicitud fue eliminada.', 'success')
            }
          })
        },
      },
    ],
  }

  get saveTitle(): string {
    const prefix = !this.savePermission.id ? 'Crear' : 'Editar'
    return `${prefix} Permiso`
  }

  toggleSaveModal(item: PermissionDto | undefined = undefined): void {
    this.savePermission.id = item?.id
    this.savePermission.name = item?.name ?? ''
    this.savePermission.lastName = item?.lastName ?? ''
    this.savePermission.permissionTypeId = item?.permissionTypeId ?? 0
    this.saveModal?.toggle()
  }

  async loadpermissionType(): Promise<void> {
    const response = await this.$axios.get<CatalogDto[]>('/permission/permissionTypes')
   this.permissionTypes = response.data
  }

  async onSaveHandler(): Promise<void> {
    this.isSaving = true
    try {
      if (this.savePermission.id) {
        await this.$axios.put('/permission', this.savePermission)
      } else {
        await this.$axios.post('/permission', this.savePermission)
      }

      this.$refs.dataTable?.refresh()
      this.toggleSaveModal()
    } finally {
      this.isSaving = false
    }
  }

  protected created(): void {
    this.loadpermissionType()
  }

  protected mounted(): void {
    this.saveModal = new Modal(document.getElementById('save-modal') as Element)
  }
}
</script>
