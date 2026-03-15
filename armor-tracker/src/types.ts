export type ArmorType = 'Heavy' | 'Medium' | 'Light'

export interface SetPiece {
  slot: string
  item: string
}

export interface ArmorItem {
  id: string
  name: string
  type?: ArmorType
  manufacturer: string
  where: string
  how?: string
  val: string
  setPieces?: SetPiece[]
  variants: string[]
  variantNote?: string
  image: string | null
  rare?: boolean
}

export type CheckedState = Record<string, boolean>
