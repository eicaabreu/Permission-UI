<template>
  <section>
    <form @submit="onSaveRequestHandler">
      <div class="d-flex align-items-center justify-content-between">
        <h1 class="title">{{ title }}</h1>
        <div>
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-danger" @click="goHome">
            Cancelar
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <label for="permissionType" class="form-label required">Tipo de permiso</label>
          <select
            id="permissionType"
            v-model="savePermissionRequest.permissionTypeId"
            class="form-select"
            required
          >
            <option
              v-for="(permissionType, index) in permissionTypes"
              :key="index"
              :value="permissionType.id"
            >
              {{ permissionType.description }}
            </option>
          </select>
        </div>
        <div class="col-3">
          <label for="name" class="form-label required">Nombre</label>
          <input
            id="name"
            v-model="savePermissionRequest.name"
            type="text"
            class="form-control"
            placeholder="Nombre"
            aria-label="Nombre"
            required
            maxlength="400"
          />
        </div>
        <div class="col-3">
          <label for="lastName" class="form-label required">Apellido</label>
          <input
            id="lastName"
            v-model="savePermissionRequest.lastName"
            type="text"
            class="form-control"
            placeholder="Apellido"
            aria-label="Apellido"
            required
            maxlength="400"
          />
        </div>
        <div class="col-3">
          <label for="date" class="form-label required">Fecha de solicitud</label>
          <input
            id="date"
            v-model="savePermissionRequest.date"
            type="date"
            class="form-control"
            required
          />
        </div>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PermissionDto, SavePermissionRequest} from '@/models/permissions'
import { PermissionTypeDto} from '@/models/permissionTypes'



@Component({
  name: 'PermissionsSavePage',
})
export default class Save extends Vue {
  permissionTypes: PermissionTypeDto[] = []
  isSaving = false
  public $refs!: Vue['$refs'] & {
  }
  savePermissionRequest: SavePermissionRequest = {
    id: 0,
    name: '',
    lastName: '',
    permissionTypeId: 0,
    date: ''
    
  }

  get isEditing(): boolean {
    return !!this.$route.params.id
  }

  get title(): string {
    const prefix = this.isEditing ? 'Editar' : 'Crear'
    return `${prefix} Solicitudes`
  }

  async onSaveRequestHandler(event : Event): Promise<void> {
    event.preventDefault()
    if (this.isSaving) return

    try {
      this.isSaving = true
      if (this.isEditing) {
        console.log("editing")
        await this.$axios.put(
          `/requests/${this.savePermissionRequest.id}`,this.savePermissionRequest)
      } else {
        console.log("saving")
        await this.$axios.post('/requests', this.savePermissionRequest)
      }
      this.goHome()
    } finally {
      this.isSaving = true
    }
  }

  async getPermissions(): Promise<void> {
    const response = await this.$axios.get<PermissionDto>(
      `/requests/${this.$route.params.id}`
    )
    this.savePermissionRequest.id = response.data.id
    this.savePermissionRequest.name = response.data.name
    this.savePermissionRequest.lastName = response.data.lastName
    this.savePermissionRequest.permissionTypeId = response.data.permissionTypeId
    this.savePermissionRequest.date = response.data.date

  }

  async loadPermissionTpes(): Promise<void> {
    const response = await this.$axios.get<PermissionTypeDto[]>('/requests')
    this.permissionTypes = response.data

    if (this.permissionTypes.length === 1) {
      this.savePermissionRequest.permissionTypeId = this.permissionTypes[0].id
    }
  }

  goHome() {
    this.$router.push('/requests')
  }
 

  protected async mounted(): Promise<void> {
    await Promise.all([
    this.loadPermissionTpes(),
    ])
   if (this.isEditing) {
      this.getPermissions()
    }
  }
}
</script>
