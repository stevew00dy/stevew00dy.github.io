export type ArmorType = 'Heavy' | 'Medium' | 'Light'

export interface SetPiece {
  slot: string
  item: string
}

export interface ArmorVariant {
  id: string
  name: string
  pieces: SetPiece[]
  note?: string
}

export interface ArmorItem {
  id: string
  name: string
  type?: ArmorType
  manufacturer: string
  where: string
  how?: string
  val: string
  variants: ArmorVariant[]
  variantNote?: string
  image: string | null
  rare?: boolean
}

export type CheckedState = Record<string, boolean>
