<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">
      {{ isEditing ? 'Editar Invitado' : 'Crear Nuevo Invitado' }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para el Nombre -->
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="nombre"
          v-model="newGuest.nombre"
          class="input input-bordered w-full"
          placeholder="Ingrese el nombre"
          required
        />
        <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">
          {{ errors.nombre }}
        </p>
      </div>

      <!-- Campo para la Dependencia -->
      <div>
        <label for="dependencia" class="block text-sm font-medium text-gray-700">Dependencia</label>
        <input
          type="text"
          id="dependencia"
          v-model="newGuest.dependencia"
          class="input input-bordered w-full"
          placeholder="Ingrese la dependencia"
          required
        />
        <p v-if="errors.dependencia" class="text-red-500 text-sm mt-1">
          {{ errors.dependencia }}
        </p>
      </div>

      <!-- Campo para el Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="newGuest.email"
          class="input input-bordered w-full"
          placeholder="Ingrese el email"
          required
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Actualizar Invitado' : 'Crear Invitado' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiResponse, Invitado } from '../../Utils/Interfaces/MeetingRecords'
import { createInvitado, getInvitadoById, updateInvitado } from '../../services/invitadoServices'

// Datos del nuevo invitado
const newGuest = ref<Invitado>({
  nombre: '',
  dependencia: '',
  estadoAsistencia: '',
  email: '',
  idInvitado: 0,
  asistenciaInvitados: [],
})

const errors = ref({
  nombre: '',
  dependencia: '',
  email: '',
})

const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const guestId = ref<number | null>(null)

// Si es modo edición, cargar los datos del invitado existente
onMounted(async () => {
  guestId.value = route.params.id ? parseInt(route.params.id as string, 10) : null
  isEditing.value = guestId.value !== null

  if (isEditing.value && guestId.value !== null) {
    try {
      const response: ApiResponse<Invitado> = await getInvitadoById(guestId.value)

      if (response.status === 'success' && response.data) {
        newGuest.value = response.data // Cargar datos para la edición
      } else {
        throw new Error(response.message || 'Error desconocido al cargar el invitado')
      }
    } catch (error) {
      console.error('Error al cargar el invitado:', error)
    }
  }
})

// Validar campos del formulario
const validateFields = () => {
  let isValid = true
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  if (!newGuest.value.nombre) {
    errors.value.nombre = 'El nombre es obligatorio.'
    isValid = false
  }

  if (!newGuest.value.dependencia) {
    errors.value.dependencia = 'La dependencia es obligatorio.'
    isValid = false
  }

  if (!newGuest.value.email) {
    errors.value.email = 'El email es obligatorio.'
    isValid = false
  }

  return isValid
}

// Manejar la creación y actualización del invitado
const submitForm = async () => {
  if (!validateFields()) {
    return
  }

  try {
    let response: ApiResponse<Invitado>

    if (isEditing.value && guestId.value !== null) {
      // Actualizar invitado existente
      response = await updateInvitado(guestId.value, newGuest.value)
    } else {
      // Crear nuevo invitado
      response = await createInvitado(newGuest.value)
      alert('El invitado se ha registrado exitosamente.') // Muestra la alerta
    }

    if (response !== null && response !== undefined) {
      // Redirigir a la tabla de invitados después de la operación exitosa
      router.push('/guests')
    } else {
      console.error('Error al guardar el Invitado:', response)
    }
  } catch (error) {
    console.error('Error al guardar el Invitado:', error)
  }
}
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
