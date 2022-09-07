namespace ArchitectBook

open System
open ArchitectBook.Types
open SimplexNoise

module WorldChunk =
    let get (x, y) =
        Noise.Seed <- 123456789

        Array.init 16 (fun x ->
            Array.init 384 (fun y ->
                Array.init 16 (fun z ->
                    let h =
                        Convert.ToInt32(
                            Noise.CalcPixel2D(x, z, float32 0.00025) * float32 0.75
                            + (Noise.CalcPixel2D(x, z, float32 0.1) - float32 150.0) * float32 0.005
                            + (Noise.CalcPixel2D(x, z, float32 0.4) - float32 150.0) * float32 0.001
                        )

                    if y > h then
                        Block(0, 0, "minecraft:air")
                    else
                        let v =
                            Noise.CalcPixel3D(x, y, z, float32 0.075)

                        if v > float32 ((420 - y) / 4) then
                            let d =
                                Noise.CalcPixel3D(y, z, x, float32 0.08)

                            if y = h then
                                Block(2, 0, "minecraft:grass")
                            elif d >= float32 175.0 || y > h - 4 then
                                Block(1, 0, "minecraft:dirt")
                            else
                                Block(3, 0, "minecraft:stone")
                        else
                            Block(0, 0, "minecraft:air"))))
