<template>
  <section>
    <div class="d-flex align-items-center justify-content-between">
      <h1 class="title">Jugadas</h1>
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
                <label for="pointOfSaleId" class="col-form-label required">
                  Punto de venta
                </label>
                <select
                  id="pointOfSaleId"
                  v-model="saveGameRequest.pointOfSaleId"
                  class="form-select"
                  required
                >
                  <option
                    v-for="(point, index) in pointOfSale"
                    :key="index"
                    :value="point.id"
                  >
                    {{ point.name }}
                  </option>
                </select>
              </div>
              </div>
              <div class="row">
              <div class="col-12">
                <label for="lotteryTypeId" class="col-form-label required">
                  Loteria
                </label>
                <select
                  id="lotteryTypeId"
                  v-model="saveGameDetail.lotteryTypeId"
                  class="form-select"
                  multiple
                  required
                >
                  <option
                    v-for="(lot, index) in lotteryType"
                    :key="index"
                    :value="lot.id"
                  >
                    {{ lot.name }}
                  </option>
                </select>
              </div>
             
            
              </div>
              <div class="row">
                <div class="col-4">
                <label for="number" class="col-form-label required">Numero</label>
                <input
                  id="number"
                  v-model="saveGameDetail.number"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-4">
                <label for="amount" class="col-form-label required">Monto</label>
                <input
                  id="amount"
                  v-model="saveGameDetail.amount"
                  type="number"
                  class="form-control"
                  maxlength="6"
                  minlength="2"
                  required
                />
              </div>
              <!-- <div class="col-3">
                <label for="gameTypeId" class="col-form-label required">
                  Tipo de jugada
                </label>
                <select
                  id="gameTypeId"
                  v-model="saveGameDetail.gameTypeId"
                  class="form-select"
                  required
                  disabled
                >
                  <option
                    v-for="(item, index) in gameType"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div> -->
           
                
              <div class="col-4">
                <label for="amountPerGame" class="col-form-label">Monto maximo</label>
                <input
                  id="amountPerGame"
                  v-model="saveGameDetail.amount"
                  type="number"
                  class="form-control"
                  disabled
                />
              </div>
              </div>
              <br/>
              <div class="d-flex justify-content-end">
              <button
              type="button"
              class="btn btn-sm btn-success"
              @click="onAddNewGameDetail"
              >
              Agregar
              </button>
              </div>
              <div class="row">
                <caption>

                </caption>
              <div class="table-responsive col-12 mb-2">
                <table class="table table-bordered table-sm caption-top">
                  <thead>
                    <tr>
                      <th scope="col">Loteria</th>
                      <th scope="col">Tipo de jugada</th>
                      <th scope="col">Numero</th>
                      <th scope="col">Monto</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in saveGameRequest.GameDetailDto"
                      :key="index"
                    >
                      <td scope="row">
                        <input
                          v-model="item.lotteryName"
                          type="texy"
                          class="form-control"
                          required
                          disabled
                        />
                      </td>
                      <td scope="row">
                        <input
                          v-model="item.gameTypeName"
                          type="text"
                          class="form-control"
                          required
                          disabled
                        />
                      </td>
                      <td scope="row">
                        <input
                          v-model="item.number"
                          type="text"
                          class="form-control"
                          required
                          disabled
                        />
                      </td>
                      <td scope="row">
                        <input
                          v-model="item.amount"
                          type="number"
                          class="form-control"
                          required
                          disabled
                        />
                      </td>
                      <td scope="row">
                        <button
                          type="button"
                          class="btn btn-sm btn-danger"
                          @click="onRemoveGameDetailsRange(index)"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
               Registrar Jugada
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
import { GameDto, SaveGameRequest,SaveGameDetail, GameDetailDto } from '~/models/game'
import { CatalogDto } from '~/models/common'
import { POFDto } from '~/models/point_of_sale'
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
  pointOfSale: POFDto[] = []
  lotteryType: CatalogDto[] = []
  gameType: CatalogDto[] = []
  saveGameRequest: SaveGameRequest = {
    pointOfSaleId: 0,
    status: true,
    quantity: 0,
    gameDate: '',
    GameDetailDto: []
  }

  saveGameDetail : SaveGameDetail = {
    lotteryTypeId: [],
    gameTypeId: 0,
    number: 0,
    amount: 0

  }

  dataTableOptions: IDataTableOptions = {
    lengthMenu: [10, 20, 50, 100],
    ajaxUrl: '/Games/paginated',
    columns: [
    {
        data: 'id',
        label: 'ID de jugada',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
    {
        data: 'pointOfSale.name',
        label: 'Punto de venta',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'quantity',
        label: 'Cantidad de jugadas',
        classList: {
          'text-center': true,
        },
        rowClass: 'cell-centered',
      },
      {
        data: 'gameDate',
        label: 'Fecha',
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
            <div class="text-center">${status ? 'Registrado' : 'Cancelado'}</div>
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
        title: 'Detalle',
        className: 'btn btn-sm btn-primary me-1',
        innerHTML: '<i class="fas fa-book"></i>',
        click: (item: GameDto) => {
          this.toggleSaveModal(item)
        },
      },
      {
        title: 'Cancelar ticket',
        className: 'btn btn-sm btn-warning me-1',
        innerHTML: '<i class="fas fa-ban"></i>',
        click: async (item: GameDto) => {
          await this.$axios.put(`/Games/${item.id}/status`)
          this.$refs.dataTable?.refresh()
        },
      },
    ],
  }

  get saveTitle(): string {
    const prefix = !this.saveGameRequest.id ? 'Crear' : 'Editar'
    return `${prefix} Jugada`
  }

  toggleSaveModal(item: GameDto | undefined = undefined): void {
    this.saveGameRequest.id = item?.id
    this.saveModal?.toggle()
  }
  async loadPointOfSale(): Promise<void> {
    const response = await this.$axios.get<POFDto[]>('/PointOfSale')
    this.pointOfSale = response.data
  }


  async loadLotteries(): Promise<void> {
    const response = await this.$axios.get<CatalogDto[]>('/Lottery/LotteryTypes')
    this.lotteryType = response.data
  }
  async loadGameType(): Promise<void> {
    const response = await this.$axios.get<CatalogDto[]>('/Games/GameType')
    this.gameType = response.data
  }

  onRemoveGameDetailsRange(index: number): void {
    this.saveGameRequest.GameDetailDto.splice(index, 1)
  }
  onAddNewGameDetail(): void {
   var istrue = false;
    var _gametype = 0;
      if(this.saveGameDetail.number.toString().length == 2){
        _gametype = 1
        istrue = true;
      }
      else if(this.saveGameDetail.number.toString().length == 4){
        _gametype = 2
        istrue = true;
      }
      else if(this.saveGameDetail.number.toString().length == 6){
        _gametype = 3
        istrue = true;
      }
      if(this.saveGameDetail.number.toString().length == 3){
       window.alert("No puede ingresar 3 numeros")   
      }
      if(this.saveGameDetail.number.toString().length == 5){
       window.alert("No puede ingresar 5 numeros")   
      }

    if(istrue){
    this.saveGameDetail.lotteryTypeId.forEach(item => {
    this.saveGameRequest.GameDetailDto.push({
    lotteryTypeId: item,
    lotteryName: this.lotteryType.find((x) => x.id == item)?.name ?? '',
    gameTypeId: _gametype,
    gameTypeName: this.gameType.find((x) => x.id == _gametype)?.name ?? '',
    number: this.saveGameDetail.number,
    amount: this.saveGameDetail.amount,
    })
    console.log(this.saveGameRequest.GameDetailDto)
    });
   }
    
    
  }

  async onSaveHandler(): Promise<void> {
    this.isSaving = true
    try {
      if (this.saveGameRequest.id) {
        await this.$axios.put(
          `/Games/${this.saveGameRequest.id}`,
          this.saveGameRequest
        )
      } else {
        console.log(this.saveGameRequest)
        await this.$axios.post('/Games', this.saveGameRequest)
      }

      this.$refs.dataTable?.refresh()
      this.toggleSaveModal()
    } finally {
      this.isSaving = false
    }
  }

  protected created(): void {
   this.loadLotteries()
   this.loadPointOfSale()
   this.loadGameType()
  }

  protected mounted(): void {
    this.saveModal = new Modal(document.getElementById('save-modal') as Element)
  }
}
</script>
