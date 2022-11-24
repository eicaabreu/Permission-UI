<template>
  <section>
    <div class="d-flex align-items-center justify-content-between">
      <h1 class="title">Zonas</h1>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        @click="toggleSaveModal"
      >
        Crear
      </button>
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
                <label for="description" class="col-form-label required">Nombre</label>
                <input
                  id="description"
                  v-model="saveZoneRequest.description"
                  type="text"
                  class="form-control"
                  required
                  maxlength="100"
                />
              </div>
             
              </div>
            </div>
            <div class="modal-footer">
              <button
                id="save-button"
                type="submit"
                class="btn btn-primary"
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
import { ZoneDto, SaveZoneRequest } from '~/models/zone'
import Swal from 'sweetalert2'

@Component({
  name: 'ZoneIndexPage',
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
  saveZoneRequest: SaveZoneRequest = {
    description: ''
  }

  dataTableOptions: IDataTableOptions = {
    lengthMenu: [10, 20, 50, 100],
    ajaxUrl: '/Zones/paginated',
    columns: [
  
      {
        data: 'description',
        label: 'Nombre',
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
        click: (item: ZoneDto) => {
          this.toggleSaveModal(item)
        },
      },
      {
        title: 'Eliminar',
        className: 'btn btn-sm btn-danger',
        innerHTML: '<i class="fas fa-trash"></i>',
        click: async (item: ZoneDto) => {
           Swal.fire({
            title: 'Estas seguro de eliminar esta zona?',
            text: "No podra volver a recuperar esta informacion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
          }).then(async (result) => {
            if (result.isConfirmed) {
               await this.$axios.delete(`/Zones/${item.id}`)
               this.$refs.dataTable?.refresh()
              } 
          })
         
        },
      },
    ],
  }

  get saveTitle(): string {
    const prefix = !this.saveZoneRequest.id ? 'Crear' : 'Editar'
    return `${prefix} zona`
  }

  toggleSaveModal(item: ZoneDto | undefined = undefined): void {
    this.saveZoneRequest.id = item?.id
    this.saveZoneRequest.description = item?.description ?? ''
    this.saveModal?.toggle()
  }


  async onSaveHandler(): Promise<void> {
    this.isSaving = true
    try {
      if (this.saveZoneRequest.id) {
        await this.$axios.put(
          `/Zones/${this.saveZoneRequest.id}`,
          this.saveZoneRequest
        )
      } else {
        await this.$axios.post('/Zones', this.saveZoneRequest)
      }

      this.$refs.dataTable?.refresh()
      this.toggleSaveModal()
    } finally {
      this.isSaving = false
    }
  }

  protected created(): void {
  }

  protected mounted(): void {
    this.saveModal = new Modal(document.getElementById('save-modal') as Element)
  }
}
</script>
