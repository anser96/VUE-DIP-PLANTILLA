<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">
      {{ isEditing ? "Editar Miembro" : "Crear Nuevo Miembro" }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Campo para el Nombre -->
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="nombre"
          v-model="newMember.nombre"
          class="input input-bordered w-full"
          placeholder="Ingrese el nombre"
          required
        />
        <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>
      </div>

      <!-- Campo para el Cargo -->
      <div>
        <label for="cargo" class="block text-sm font-medium text-gray-700">Cargo</label>
        <input
          type="text"
          id="cargo"
          v-model="newMember.cargo"
          class="input input-bordered w-full"
          placeholder="Ingrese el cargo"
          required
        />
        <p v-if="errors.cargo" class="text-red-500 text-sm mt-1">{{ errors.cargo }}</p>
      </div>

      <!-- Campo para el Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="newMember.email"
          class="input input-bordered w-full"
          placeholder="Ingrese el email"
          required
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <!-- Botón de Crear o Actualizar -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? "Actualizar Miembro" : "Crear Miembro" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Miembro, ApiResponse } from "../../Utils/Interfaces/MeetingRecords";
import { createMiembro, getMiembroById, updateMiembro } from "../../services/miembroService";

// Inicializar el nuevo miembro
const newMember = ref<Miembro>({
  nombre: "",
  cargo: "",
  email: "",
  idMiembro: 0,
  asistenciaMiembros: []
});

const errors = ref({
  nombre: '',
  cargo: '',
  email: ''
});

const router = useRouter();
const route = useRoute();
const isEditing = ref(false);
const memberId = ref<number | null>(null);

// Si es modo edición, cargar los datos del miembro existente
onMounted(async () => {
  memberId.value = route.params.id ? parseInt(route.params.id as string, 10) : null;
  isEditing.value = memberId.value !== null;

  if (isEditing.value && memberId.value !== null) {
    try {
      const response: ApiResponse<Miembro> = await getMiembroById(memberId.value);
      if (response.status === "success" && response.data) {
        newMember.value = response.data; // Cargar datos para la edición
      } else {
        throw new Error(response.message || "Error desconocido al cargar el miembro");
      }
    } catch (error) {
      console.error("Error al cargar el miembro:", error);
    }
  }
});

// Validar campos del formulario
const validateFields = () => {
  let isValid = true;
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = '';
  });

  if (!newMember.value.nombre) {
    errors.value.nombre = 'El nombre es obligatorio.';
    isValid = false;
  }

  if (!newMember.value.cargo) {
    errors.value.cargo = 'El cargo es obligatorio.';
    isValid = false;
  }

  if (!newMember.value.email) {
    errors.value.email = 'El email es obligatorio.';
    isValid = false;
  }

  return isValid;
};

// Manejar la creación y actualización del miembro
const submitForm = async () => {
  if (!validateFields()) {
    return;
  }

  try {
    let response: ApiResponse<Miembro>;

    if (isEditing.value && memberId.value !== null) {
      // Actualizar miembro existente
      response = await updateMiembro(memberId.value, newMember.value);
    } else {
      // Crear nuevo miembro
      response = await createMiembro(newMember.value);
      alert("El miembro se ha registrado exitosamente."); // Muestra la alerta
    }

    if (response.status === "success") {
      // Redirigir a la tabla de miembros después de la operación exitosa
      router.push("/members");
    } else {
      console.error("Error al guardar el miembro:", response.message);
    }
  } catch (error) {
    console.error("Error al guardar el miembro:", error);
  }
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
