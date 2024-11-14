// src/services/tareaService.ts

import { fetchWithAuth } from '../Utils/FetchWithToken'
import { ApiResponse, Tarea } from '../Utils/Interfaces/MeetingRecords'

const API_TAREAS_URL = `${import.meta.env.VITE_API_URL}/tareas`

// Obtener todas las tareas con responsables
export const getTareas = async (): Promise<ApiResponse<Tarea[]>> => {
  try {
    const response = await fetchWithAuth(API_TAREAS_URL, { method: 'GET' })
    if (!response.ok) throw new Error('Error al obtener las tareas')
    return (await response.json()) as ApiResponse<Tarea[]>
  } catch (error) {
    console.error('Error al obtener las tareas:', error)
    throw error
  }
}

export const getTareasAsignadas = async (
  tipoResponsable?: string,
  responsableId?: number,
): Promise<ApiResponse<Tarea[]>> => {
  try {
    let params = ''
    if (tipoResponsable != null && responsableId != null) {
      params = `?tipoResponsable=${tipoResponsable}&responsableId=${responsableId}`
    }
    const response = await fetchWithAuth(`${API_TAREAS_URL}/asignadas${params}`, { method: 'GET' })
    if (!response.ok) throw new Error('Error al obtener las tareas')

    const tareas = (await response.json()).map((t: any) => {
      const newT = {
        idTarea: t.idTareas,
        asistenciaInvitados: t.asistenciaInvitados,
        asistenciaMiembros: t.asistenciaMiembros,
        descripcion: t.descripcion,
        estado: t.estado,
        fechaEntrega: t.fechaEntrega,
        fechaVerificacion: t.fechaVerificacion,
        responsable: t.responsable,
        responsableId: t.responsableId,
        tipoResponsable: t.tipoResponsable,
      } as Tarea
      return newT
    })
    return { status: 'success', data: tareas } as ApiResponse<Tarea[]>
  } catch (error) {
    console.error('Error al obtener las tareas:', error)
    throw error
  }
}

// Obtener una tarea por ID
export const getTareaById = async (id: number): Promise<ApiResponse<Tarea>> => {
  try {
    const response = await fetchWithAuth(`${API_TAREAS_URL}/${id}`, { method: 'GET' })
    if (!response.ok) throw new Error(`Error al obtener la tarea con ID: ${id}`)
    return (await response.json()) as ApiResponse<Tarea>
  } catch (error) {
    console.error(`Error al obtener la tarea con ID ${id}:`, error)
    throw error
  }
}

// Crear una nueva tarea
export const createTarea = async (tarea: Partial<Tarea>): Promise<ApiResponse<Tarea>> => {
  try {
    const response = await fetchWithAuth(API_TAREAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarea),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al crear la tarea'
      throw new Error(backendMessage)
    }

    return (await response.json()) as ApiResponse<Tarea>
  } catch (error) {
    console.error('Error al crear la tarea:', error)
    throw error
  }
}

export const asignarTareaNueva = async (tarea: unknown): Promise<ApiResponse<Tarea>> => {
  const queryParamsString = new URLSearchParams(tarea as Record<string, string>).toString()
  console.log(queryParamsString)
  try {
    const response = await fetchWithAuth(`${API_TAREAS_URL}/asignar?${queryParamsString}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al crear la tarea'
      throw new Error(backendMessage)
    }
    const data = await response.json()
    return { status: 'success', message: '', data } as ApiResponse<Tarea>
  } catch (error) {
    console.error('Error al crear la tarea:', error)
    throw error
  }
}

export const asignarTareaExistente = async (tarea: Tarea): Promise<ApiResponse<Tarea>> => {
  const queryParamsString = `tareaId=${tarea.idTarea}&responsableId=${tarea.responsableId}&tipoResponsable=${tarea.tipoResponsable}`
  console.log(queryParamsString)
  try {
    const response = await fetchWithAuth(`${API_TAREAS_URL}/${tarea.idTarea}/asignar?${queryParamsString}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al crear la tarea'
      throw new Error(backendMessage)
    }
    const data = await response.json()
    console.log(data)
    return { status: 'success', message: '', data } as ApiResponse<Tarea>
  } catch (error) {
    console.error('Error al crear la tarea:', error)
    throw error
  }
}

// Actualizar una tarea existente
export const updateTarea = async (id: number, tarea: Partial<Tarea>): Promise<ApiResponse<Tarea>> => {
  try {
    const response = await fetchWithAuth(`${API_TAREAS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarea),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al actualizar la tarea'
      throw new Error(backendMessage)
    }

    return (await response.json()) as ApiResponse<Tarea>
  } catch (error) {
    console.error('Error al actualizar la tarea:', error)
    throw error
  }
}

// Actualizar el estado de una tarea
export const updateEstadoTarea = async (id: number, estado: string): Promise<ApiResponse<Tarea>> => {
  try {
    const response = await fetchWithAuth(`${API_TAREAS_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al actualizar el estado de la tarea'
      throw new Error(backendMessage)
    }

    return (await response.json()) as ApiResponse<Tarea>
  } catch (error) {
    console.error('Error al actualizar el estado de la tarea:', error)
    throw error
  }
}

// Eliminar una tarea
export const deleteTarea = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetchWithAuth(`${API_TAREAS_URL}/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Error al eliminar la tarea')
    return { status: 'success', data: true } as ApiResponse<boolean>
  } catch (error) {
    console.error('Error al eliminar la tarea:', error)
    throw error
  }
}
