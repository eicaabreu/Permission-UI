<template>
  <div class="table-responsive">
    <table
      ref="dataTableElement"
      class="table table-striped table-bordered caption-top"
      style="width: 100%"
    >
      <caption>
        <div class="input-group">
          <select v-if="hasLengthMenu" v-model="length" class="form-select">
            <option
              v-for="(item, index) in options.lengthMenu"
              :key="index"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <input
            v-model="filter"
            type="search"
            class="form-control"
            placeholder="Filtrar"
          />
          <button
            ref="refreshButtonElement"
            class="btn btn-outline-dark"
            data-loading-text="<i class='fas fa-spinner fa-spin'></i>"
            @click="refresh"
          >
            Refrescar
          </button>
        </div>
      </caption>
      <thead>
        <tr>
          <th
            v-for="(column, index) in options.columns"
            :key="index"
            :class="column.classList"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</template>

<script lang="ts">
// eslint-disable @typescript-eslint/no-explicit-any
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  IDataTableAction,
  IDataTableColumn,
  IDataTableOptions,
} from '@/models/datatable'

@Component
export default class DataTable extends Vue {
  // Props
  @Prop({
    required: true,
  })
  readonly options!: IDataTableOptions

  // Data properties
  dataTable: any | undefined
  length: number = 10
  filter: string = ''
  filterElapsed: number | undefined

  // Watches
  @Watch('filter')
  onFilterChanged(): void {
    window.clearTimeout(this.filterElapsed)
    this.filterElapsed = window.setTimeout(this.refresh, 700)
  }

  @Watch('length')
  onLengthChanged(): void {
    this.dataTable?.page.len(this.length).draw()
  }

  @Watch('options.ajaxData')
  onAjaxDataChanged(): void {
    this.refresh()
  }

  // Methods
  initDataTable(): void {
    if (this.options.length) {
      this.length = this.options.length
    }

    const settings: any = {
      dom: 'Bfrtip',
      autoWidth: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json',
      },
      destroy: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      responsive: true,
      select: false,
      paging: true,
      pageLength: this.length,
      ajax: {
        // TODO: Usar la url del API desde un archivo de configuración
        url: `${this.$config.API_URL}${this.options.ajaxUrl}`,
        type: this.options.ajaxMethod ?? 'POST',
        dataSrc: (json: any) => {
          const src = this.options.ajaxSrc ?? 'items'
          const total = json.recordsTotal
          const filtered = json.recordsFiltered

          json.recordsTotal = filtered
          json.recordsFiltered = total

          return json[src]
        },
        headers: {
          // TODO: Agregar token en el header Authorization
          'Content-Type': 'application/json',
        },
        data: (obj: any) => {
          obj.search = this.filter ?? ''
          let ajaxData = this.options.ajaxData
          if (typeof ajaxData === 'function') ajaxData = ajaxData()

          const data = $.extend({}, obj, ajaxData)
          return this.options.formatAjaxData
            ? this.options.formatAjaxData(data)
            : JSON.stringify(data)
        },
        complete: () => {
          // TODO: colocar el botón de refrescar en loading
          this.options.onAjaxComple?.()
        },
      },
      buttons: [],
      columnDefs: [] as any[],
      columns: [] as IDataTableColumn[],
    }

    if (this.options.preventLoadOnInit) {
      settings.deferLoading = 0
    }

    let columns = this.options.columns
    if (typeof columns === 'function') columns = columns()

    columns.forEach((column, index) => {
      settings.columns.push(column)

      if (column.data && column.rowClass) {
        settings.columnDefs.push({
          targets: index,
          createdCell: (td: HTMLTableCellElement) => {
            const div = document.createElement('div')
            div.className = column.rowClass ?? ''
            div.innerHTML = td.innerHTML

            td.style.height = '1px'
            td.innerHTML = div.outerHTML
          },
        })
      }
    })

    let actions: IDataTableAction[] = []
    if (this.options.actions) {
      if (typeof this.options.actions === 'function') {
        actions = this.options.actions()
      } else {
        actions = this.options.actions
      }

      settings.columnDefs.push({
        targets: -1,
        createdCell: (td: HTMLTableCellElement, _: any, rowData: never) => {
          const div = document.createElement('div')
          div.className = 'cell-centered'
          div.innerHTML = td.innerHTML

          actions.forEach((action) => {
            let btn: HTMLButtonElement | HTMLAnchorElement | undefined

            if (action.href) {
              const href =
                typeof action.href === 'function'
                  ? action.href(rowData)
                  : action.href

              btn = document.createElement('a')
              btn.href = href
            } else {
              btn = document.createElement('button')
              btn.addEventListener('click', (event) => {
                action.click?.(rowData, event)
              })
            }

            btn.title = action.title ?? ''
            btn.className = action.className ?? ''
            btn.style.cssText = action.style ?? ''
            btn.innerHTML = action.innerHTML ?? ''

            if (action.customDataset) {
              for (const key in action.customDataset) {
                btn.dataset[key] = action.customDataset[key]
              }
            }

            div.appendChild(btn)
          })

          td.style.height = '1px'
          td.appendChild(div)
        },
      })
    }

    if (this.options.columnDefs) {
      this.options.columnDefs.forEach((columnDef) => {
        settings.columnDefs.push(columnDef)
      })
    }

    if (this.dataTable) {
      this.dataTable.destroy()
    }

    this.dataTable = $(this.$refs.dataTableElement as HTMLElement).DataTable(
      settings
    )
    this.dataTable.on('processing.dt', (_: any, __: any, processing: any) => {
      this.$emit('loading', processing)
    })
  }

  refresh(): void {
    // TODO: colocar el botón de refrescar en loading
    this.dataTable?.ajax.reload(null, false)
  }

  getRow(tr: any): any {
    return this.dataTable?.row(tr).data()
  }

  // Computed properties
  get hasLengthMenu(): boolean {
    return !!(this.options.lengthMenu && this.options.lengthMenu.length)
  }

  // Hooks
  protected mounted(): void {
    this.initDataTable()
  }
}
// eslint-enable @typescript-eslint/no-explicit-any
</script>

<style scoped>
input[type='search'] {
  flex: 10 auto;
}
</style>
