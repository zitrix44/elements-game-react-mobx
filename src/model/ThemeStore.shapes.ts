type TShapeDef = {
    id: string,
    clipId: string,
    borderId: string,
    name: string,
};

type TShapeDefs = Record<string, TShapeDef>;

export const shapesList: TShapeDefs = {
    basic: {
        id: "basic",
        clipId: "card-shape-basic-clip",
        borderId: "card-shape-basic-border",
        name: "Basic shape"
    },
    ruined: {
        id: "ruined",
        clipId: "card-shape-ruined-clip",
        borderId: "card-shape-ruined-border",
        name: "Ruined shape"
    },
    pentagon: {
        id: "pentagon",
        clipId: "card-shape-pentagon-clip",
        borderId: "card-shape-pentagon-border",
        name: "Pentagon shape"
    },
    comix: {
        id: "comix",
        clipId: "card-shape-comix-clip",
        borderId: "card-shape-comix-border",
        name: "Comix shape"
    },
};

export const defaultShape = "basic";
