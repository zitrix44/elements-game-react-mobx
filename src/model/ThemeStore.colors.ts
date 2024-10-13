export type TColorScheme = {
    id: string;
    cardTextColor: string;
    cardIconColor: string;
    cardBgColor: string;
    cardStrokeColor: string;
    additionalCSS?: string;
};

export const colorSchemes: TColorScheme[] = [
    {
        id: "Unicorn",
        cardTextColor: "#d4d4d4",
        cardIconColor: "#14357ccc",
        cardBgColor: "#2e322e",
        cardStrokeColor: "#585858",
        additionalCSS: `
.ecard-bg {
    transition: background-color 0.2s linear;
}
.ecard-clip-stroke {
    transition: background-color 1s linear;
}
.ecard-content-clicpped {
    transition: color 0.5s linear;
}
.ecard-content, .ecard-icon {
    transition: color 0.2s linear;
}
.ecard-content-clicpped .ecard-title {
    text-shadow: 1px 0px 0px white, -1px 0px 0px black;
}
        `
    },
    {
        id: "Default",
        cardTextColor: "rgb(94, 55, 0)",
        cardIconColor: "var(--ecard-title-color)",
        cardBgColor: "rgba(208, 174, 108, 0.7)",
        cardStrokeColor: "hwb(14.63deg 19.6% 0%)",
    },
    {
        id: "Contrast",
        cardTextColor: "black",
        cardIconColor: "#666",
        cardBgColor: "white",
        cardStrokeColor: "#ccc",
    },
    {
        id: "Blue",
        cardTextColor: "#2f0060ba",
        // cardIconColor: "#1e667fb0",
        cardIconColor: "rgb(94, 55, 0)",
        cardBgColor: "#2dbebe",
        cardStrokeColor: "#2c68b7",
    },
    {
        id: "Cowberry",
        cardTextColor: "#ac275a",
        cardIconColor: "#81030d",
        cardBgColor: "#ffa2a2",
        cardStrokeColor: "#fffadf",
    },
    {
        id: "Dark",
        cardTextColor: "#d4d4d4",
        cardIconColor: "#14357ccc",
        cardBgColor: "#2e322e",
        cardStrokeColor: "#585858",
        additionalCSS: `
& {
    --ecard-unclipped-icon-color: #000000cc;
    --ecard-clipped-icon-color: red;
}
.ecard-content-clicpped .ecard-title {
    text-shadow: 1px 0px 0px black;
}
        `
    },
];

export const makeColorScheme = ({id, cardTextColor, cardIconColor, cardBgColor, cardStrokeColor, additionalCSS}: TColorScheme) => {
    return `
.color-scheme-${id} {
    --ecard-title-color: ${cardTextColor};
    --ecard-icon-color: ${cardIconColor};
    --ecard-unclipped-icon-color: ${cardIconColor};
    --ecard-clipped-icon-color: ${cardIconColor};
    --ecard-background: ${cardBgColor};
    --ecard-stroke: ${cardStrokeColor};
    ${additionalCSS || ''}
}
    `;
};

export const makeColorSchemes = (array: TColorScheme[]) => {
    return array.map(makeColorScheme).join('\n');
};

export const defaultColorScheme = "Default";
