export interface Company {
  id: string
  code: string
  name: string
  shortName: string
  lastEditDate: string
  unifiedNumber: string
  responsible: string
  contact: string
  endDate: string
  address: string
  taxType: string
  phone: string
  companyPhone: string
  fax: string
  remarks: string
}

export interface Contact {
  id: string
  name: string
  phone: string
}

export interface CustomsBroker {
  id: string
  name: string
  phone: string
  fax: string
  contactPerson: string
}

export interface ContainerLocation {
  id: string
  location: string
  doorDirection: string
  address: string
  phone: string
  contactPerson: string
}

export interface Vendor {
  id: string
  name: string
  phone: string
  fax: string
  unifiedNumber: string
  email: string
  createdDate: Date
}

export interface VisitRecord {
  id: string
  visitDate: string
  phone: string
  fax: string
  email: string
  remarks: string
}
