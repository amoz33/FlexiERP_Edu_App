'use client'

export function useChildData() {
  const children = [
    { id: 'child-1', name: 'Chidinma Okafor', class: 'SS2A', level: 'Senior Secondary', avatar: 'CO', attendance: 92, feesDue: 35000, position: 4 },
    { id: 'child-2', name: 'Emeka Okafor', class: 'JSS1B', level: 'Junior Secondary', avatar: 'EO', attendance: 87, feesDue: 28000, position: 8 },
    { id: 'child-3', name: 'Blessing Okafor', class: 'PRI4', level: 'Primary School', avatar: 'BO', attendance: 95, feesDue: 25000, position: 2 },
  ]

  return {
    children,
    getChildById: (id: string) => children.find(child => child.id === id) ?? children[0],
  }
}
