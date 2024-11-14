// src/services/invitadoService.ts

import { fetchWithAuth } from '../Utils/FetchWithToken'
import { ApiResponse, Invitado } from '../Utils/Interfaces/MeetingRecords'

const API_INVITADOS_URL = `${import.meta.env.VITE_API_URL}/invitados`

// Obtener todos los invitados
export const getInvitados = async (): Promise<ApiResponse<Invitado[]>> => {
  try {
    const response = await fetchWithAuth(API_INVITADOS_URL, { method: 'GET' })
    if (!response.ok) throw new Error('Error al obtener los invitados')
    return { status: 'success', data: await response.json() } as ApiResponse<Invitado[]>
  } catch (error) {
    console.error('Error al obtener los invitados:', error)
    throw error
  }
}

// Obtener un invitado por ID
export const getInvitadoById = async (id: number): Promise<ApiResponse<Invitado>> => {
  try {
    const response = await fetchWithAuth(`${API_INVITADOS_URL}/${id}`, { method: 'GET' })
    if (!response.ok) throw new Error(`Error al obtener el invitado con ID: ${id}`)
    return (await response.json()) as ApiResponse<Invitado>
  } catch (error) {
    console.error(`Error al obtener el invitado con ID ${id}:`, error)
    throw error
  }
}

// Crear un nuevo invitado
export const createInvitado = async (invitado: Partial<Invitado>): Promise<ApiResponse<Invitado>> => {
  try {
    const response = await fetchWithAuth(API_INVITADOS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invitado),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al crear el invitado'
      throw new Error(backendMessage)
    }

    return (await response.json()) as ApiResponse<Invitado>
  } catch (error) {
    console.error('Error al crear el invitado:', error)
    throw error
  }
}

// Actualizar un invitado existente
export const updateInvitado = async (id: number, invitado: Partial<Invitado>): Promise<ApiResponse<Invitado>> => {
  try {
    const response = await fetchWithAuth(`${API_INVITADOS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invitado),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al actualizar el invitado'
      throw new Error(backendMessage)
    }

    return (await response.json()) as ApiResponse<Invitado>
  } catch (error) {
    console.error('Error al actualizar el invitado:', error)
    throw error
  }
}

// Eliminar un invitado
export const deleteInvitado = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetchWithAuth(`${API_INVITADOS_URL}/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      const errorData = await response.json()
      const backendMessage = errorData.message || 'Error al eliminar el invitado'
      throw new Error(backendMessage)
    }
    return { status: 'success', data: true } as ApiResponse<boolean>
  } catch (error) {
    console.error('Error al eliminar el invitado:', error)
    throw error
  }
}
