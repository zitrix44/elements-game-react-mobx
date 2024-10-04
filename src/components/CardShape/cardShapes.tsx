type TShapeDef = {
    id: string,
    clipId: string,
    borderId: string,
    name: string,
};

type TShapeDefs = Record<string, TShapeDef>;

const shapesList: TShapeDefs = {
    basic: {
        id: "basic",
        clipId: "basic",
        borderId: "basic",
        name: "Basic shape"
    }
};

const defaultShape = "basic";

