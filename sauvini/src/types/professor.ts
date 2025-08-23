export interface ProfessorUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthdate: string
  gender: "male" | "female"
  wilaya: string
  avatar: string
  academicTitle: string
  permissions: string[]
  assignedModules: Array<{
    id: string
    name: string
  }>
  createdAt: string
}
