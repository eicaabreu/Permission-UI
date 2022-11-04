<template>
  <section>
    <div class="d-flex align-items-center justify-content-between">
      <h1 class="title">Puntos de ventas</h1>
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
              <div class="col-6">
                <label for="name" class="col-form-label required">Nombre</label>
                <input
                  id="name"
                  v-model="savePOFRequest.name"
                  type="text"
                  class="form-control"
                  required
                  maxlength="100"
                />
              </div>
              <div class="col-6">
                <label for="reference" class="col-form-label required">Referencia</label>
                <input
                  id="reference"
                  v-model="savePOFRequest.reference"
                  type="text"
                  class="form-control"
                  required
                  maxlength="100"
                />
              </div>
              </div>
              <div class="row">
              <div class="col-6">
                <label for="zoneId" class="col-form-label required">
                  Zona
                </label>
                <select
                  id="zoneId"
                  v-model="savePOFRequest.zoneId"
                  class="form-select"
                  required
                >
                  <option
                    v-for="(zone, index) in zones"
                    :key="index"
                    :value="zone.id"
                  >
                    {{ zone.description }}
                  </option>
                </select>
              </div>
              <div class="col-6">
                <label for="dailySaleLimit" class="col-form-label required">Limite venta diaria</label>
                <input
                  id="dailySaleLimit"
                  v-model="savePOFRequest.dailySaleLimit"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
              </div>
              <div class="row">
              <div class="col-6">
                <label for="minutesToCancelTickets" class="col-form-label required">Minutos para cancelar tickets</label>
                <input
                  id="minutesToCancelTickets"
                  v-model="savePOFRequest.minutesToCancelTickets"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-6">
                <label for="ticketsAllowedToCancelPerDay" class="col-form-label required">Tickets permitidos a cancelar por día</label>
                <input
                  id="ticketsAllowedToCancelPerDay"
                  v-model="savePOFRequest.ticketsAllowedToCancelPerDay"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label for="maximumAmountOfTickets" class="col-form-label required">Monto máximo de tickets</label>
                <input
                  id="maximumAmountOfTickets"
                  v-model="savePOFRequest.maximumAmountOfTickets"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-6">
              <label for="printMode" class="col-form-label required"
                >Modo de impresión</label
              >
              <select
                id="printMode"
                v-model="savePOFRequest.printMode"
                class="form-control"
              >
                <option value="1">Driver</option>
                <option value="2">Generico</option>
                
              </select>
            </div>
            </div>
            <div class="mb-3">
                <label for="footer" class="col-form-label required">Pie de página</label>
                <textarea
                  id="footer"
                  v-model="savePOFRequest.footer"
                  type="text"
                  class="form-control"
                  required
                ></textarea>
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
import { POFDto, SavePOFRequest } from '~/models/point_of_sale'
import { CatalogDto } from '~/models/common'
import Swal from 'sweetalert2'

@Component({
  name: 'PointOfSaleIndexPage',
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
  zones: CatalogDto[] = []
  savePOFRequest: SavePOFRequest = {
    code: '',
    name: '',
    reference: '',
    contact: '',
    zoneId: 0,
    status: true,
    dailySaleLimit: 0,
    minutesToCancelTickets: 0,
    ticketsAllowedToCancelPerDay: 0,
    maximumAmountOfTickets: 0,
    printMode: 0,
    footer: ''
  }

  dataTableOptions: IDataTableOptions = {
    lengthMenu: [10, 20, 50, 100],
    ajaxUrl: '/PointOfSale/paginated',
    columns: [
      {
        data: 'code',
        label: 'Codigo',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'name',
        label: 'Nombre',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'reference',
        label: 'Referencia',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'zone.description',
        label: 'Zona',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'status',
        label: 'Estado',
        rowClass: 'cell-centered',
        render: (status: boolean | undefined | null) => {
          return `
            <div class="text-center">${status ? 'Activo' : 'Inactivo'}</div>
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
        className: 'btn btn-sm btn-primary me-1',
        innerHTML: '<i class="fas fa-edit"></i>',
        click: (item: POFDto) => {
          this.toggleSaveModal(item)
        },
      },
      {
        title: 'Cambiar estado',
        className: 'btn btn-sm btn-warning me-1',
        innerHTML: '<i class="fas fa-dice"></i>',
        click: async (item: POFDto) => {
          await this.$axios.put(`/PointOfSale/${item.id}/status`)
          this.$refs.dataTable?.refresh()
        },
      },
      {
        title: 'Eliminar',
        className: 'btn btn-sm btn-danger',
        innerHTML: '<i class="fas fa-trash"></i>',
        click: async (item: POFDto) => {
           Swal.fire({
            title: 'Estas seguro de eliminar este punto de venta?',
            text: "No podra volver a recuperar esta informacion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
          }).then(async (result) => {
            if (result.isConfirmed) {
               await this.$axios.delete(`/PointOfSale/${item.id}`)
               this.$refs.dataTable?.refresh()
              } 
          })
         
        },
      },
    ],
  }

  get saveTitle(): string {
    const prefix = !this.savePOFRequest.code ? 'Crear' : 'Editar'
    return `${prefix} punto de venta`
  }

  toggleSaveModal(item: POFDto | undefined = undefined): void {
    this.savePOFRequest.id = item?.id
    this.savePOFRequest.code = item?.code ?? ''
    this.savePOFRequest.name = item?.name ?? ''
    this.savePOFRequest.reference = item?.reference ?? ''
    this.savePOFRequest.contact = item?.contact ?? ''
    this.savePOFRequest.zoneId = item?.zoneId ?? 0
    this.savePOFRequest.dailySaleLimit = item?.dailySaleLimit ?? 0
    this.savePOFRequest.minutesToCancelTickets = item?.minutesToCancelTickets ?? 0
    this.savePOFRequest.ticketsAllowedToCancelPerDay = item?.ticketsAllowedToCancelPerDay ?? 0
    this.savePOFRequest.maximumAmountOfTickets = item?.maximumAmountOfTickets ?? 0
    this.savePOFRequest.printMode = item?.printMode ?? 0
    this.savePOFRequest.footer = item?.footer ?? ''
    this.saveModal?.toggle()
  }

  async loadZones(): Promise<void> {
    const response = await this.$axios.get<CatalogDto[]>('/Zones')
    this.zones = response.data
  }

  async onSaveHandler(): Promise<void> {
    this.isSaving = true
    try {
      if (this.savePOFRequest.id) {
        await this.$axios.put(
          `/PointOfSale/${this.savePOFRequest.id}`,
          this.savePOFRequest
        )
      } else {
        await this.$axios.post('/PointOfSale', this.savePOFRequest)
      }

      this.$refs.dataTable?.refresh()
      this.toggleSaveModal()
    } finally {
      this.isSaving = false
    }
  }

  protected created(): void {
   this.loadZones()
  }

  protected mounted(): void {
    this.saveModal = new Modal(document.getElementById('save-modal') as Element)
  }
}
</script>
