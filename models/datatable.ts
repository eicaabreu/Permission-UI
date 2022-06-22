import { Vue } from 'vue-property-decorator'

export type IDataTableColumn = {
  label: string
  data?: string
  defaultContent?: string
  classList?: { [key: string]: boolean }
  rowClass?: string
  render?: <TData extends never, TItem extends never>(
    data: TData,
    type: string,
    item: TItem,
    meta: object // eslint-disable-line @typescript-eslint/ban-types
  ) => string | Promise<string>
}

export type IDataTableAction = {
  title?: string
  className?: string
  style?: string
  innerHTML?: string
  customDataset?: DOMStringMap
  href?: string | (<T extends never>(item: T) => string)
  click?: <T extends never>(item: T, event: MouseEvent) => void | Promise<void>
}

type ColumnDefTargetType = number | string | '_all'

export type IDataTableColumnDefinition = {
  targets: ColumnDefTargetType | ColumnDefTargetType[]
  createdCell: <TData extends never, TRowData extends never>(
    cell: HTMLTableCellElement,
    cellData: TData,
    rowData: TRowData
  ) => void
}

export type IDataTableOptions = {
  ajaxUrl: string
  ajaxMethod?: string
  classList?: { [key: string]: string | undefined }
  ajaxSrc?: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  ajaxData?: object | (() => object)
  length?: number
  lengthMenu?: number[]
  columns: IDataTableColumn[] | (() => IDataTableColumn[])
  actions?: IDataTableAction[] | (() => IDataTableAction[])
  columnDefs?: IDataTableColumnDefinition[]
  preventLoadOnInit?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatAjaxData?: (data: any) => any
  onAjaxComple?: () => void | Promise<void>
}

export type IDataTableComponent = Vue & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRow: (tr: any) => any
  refresh: () => void
  table: HTMLElement
}
