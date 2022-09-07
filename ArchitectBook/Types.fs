namespace ArchitectBook

module Types =
    type Block(id: int, variant: int, textId: string) =
        member this.id = id
        member this.variant = variant
        member this.textId = textId
