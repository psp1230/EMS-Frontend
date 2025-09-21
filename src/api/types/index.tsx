// 查詢參數類型
export type QueryParams = {
  QueryEmail?: string
  ProjectName?: string | null
  DateFrom?: string | null
  DateTo?: string | null
}

// KPI數據類型
export type KPIData = {
  ProjectId: string
  KpiName: string
  MinDays: number
  MaxDays: number
  Score: number
}

export interface UpdateKPIParams extends KPIData {
  Id: number
}

// 專案類型 - 根據實際API回傳結構
export type Project = {
  original: any
  id: number
  projectId: string
  projectName: string
  startDate: string
  finishDate: string
  memberCount: number
  updateTime: string
  ownerTitle: string
}

// KPI類型
export type KPI = {
  id: number
  kpiName: string
  updateTime: string
  minDays: number
  maxDays: number
  score: number
}


export type ProjectQuery = {
  projectName?: string
  startDate?: string
  endDate?: string
  ownerTitle?: string
}

export type ProjectData = {
  id: number
  projectId: string
  taskId: string
  kind: string
  title: string
  email: string
}

export type SaveProjectData = {
  assignments: []
}

export type Role = {
  id: number
  roleCode: string
  isActive: boolean
}

export type APIMember = {
  id: number
  lastName: string
  firstName: string
  displayName: string
  email: string
  isActive: boolean
  sortOrder: number
  departmentName: string
  isManager: boolean
  roles: Role[]
}

export type TransformedMember = {
  id: string
  name: string
  displayName: string
  email: string
  departmentName: string
  isManager: boolean
  isActive: boolean
  groupId: string | null
  roles: Role[]
}

export type MemberPost = {
  lastName: string
  firstName: string
  displayName: string
  email: string
  isActive: boolean
  sortOrder: number
  roles: Role[]
}

export interface MemberUpdate extends MemberPost {
  id: number
}

export type DepartmentTreeNode = {
  id: number
  name: string
  parentDepartmentName: string
  sortOrder: number
  childDepartments: DepartmentTreeNode[]
}

export type DepartmentTreeResponse = {
  data: {
    data: {
      root: DepartmentTreeNode
    }
  }
}

export type DepartmentPost = {
  departmentName: string
  managerEmail: string | null
  parentDepartmentName?: string
  sortOrder: number
}

export interface DepartmentUpdate extends DepartmentPost {
  id: number
}