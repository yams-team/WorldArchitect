open System.IO
open System.Text.Json
open ArchitectBook

File.WriteAllText("chunkA.json", WorldChunk.get (0, 0) |> JsonSerializer.Serialize)
