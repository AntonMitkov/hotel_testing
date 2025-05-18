import protobuf from "protobufjs";

export async function loadProtobuf() {
    const root = await protobuf.load("./assets/file.proto");
    return [
        (root.lookupType("IdentifyRequest")),
        (root.lookupType("SetState")),
        (root.lookupEnum("States").values)
    ];
}