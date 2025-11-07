export interface Company {
  name: string
  andress?: string
  phone?: string
}
// Reutilizamos um tipo simples de endereço para ClientAddress e OriginAddress
export interface Address {
  cep: string
  city: string
  number: string
  state: string
  street: string
}

// AddressDetail com campos extras retornados pelo backend
export interface AddressDetail {
  id: number
  street: string
  number: string
  city: string
  state: string
  zipCode: string
  country?: string
  complement?: string
  createdAt?: string
  updatedAt?: string
}

export type ClientAddress = AddressDetail
export type OriginAddress = AddressDetail

export interface ApiOrder {
  Company: Company
  ClientAddress?: ClientAddress | ClientAddress[]
  OriginAddress?: OriginAddress | OriginAddress[]

  code: string
  completedAt: string | null
  email: string
  height: number
  information: string
  isFragile: boolean
  length: number
  price: string
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | string
  telefone?: string
  vehicleType: string
  weight: number
  width: number
  phone?: string
  andress?: string
}

// Tipagem para a resposta paginada mostrada no exemplo do usuário
export interface PaginatedOrdersResponse {
  currentPage: number
  data: ApiOrder[]
  total: number
  totalPage: number
}
