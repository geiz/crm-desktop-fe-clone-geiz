const colorPalette = [
    'var(--color-blue-300)', // #4371FE
    'var(--color-curious-blue-200)', // #039BE5
    'var(--color-lilac-200)', // #6200EA
    'var(--color-violet-200)', // #6A5ACD
    'var(--color-blackberry-200)', // #581845
    'var(--color-pink-200)', // #D5006D
    'var(--color-red-400)', // #DC2626
    'var(--color-orange-200)', // #D65D00
    'var(--color-ohre-200)', // #C77B30
    'var(--color-golden-300)', // #A37C16
    'var(--color-brown-200)', // #7B5E57
    'var(--color-iron-grey-200)', // #5E5955
    'var(--color-green-300)', // #029E37
    'var(--color-mint-200)', // #5E846F
    'var(--color-turquoise-200)', // #3C6761
    'var(--color-camarone-200)' // #1B5E20
    // You can add more colors from your variables.css if needed
];

export const getColorById = (index: number): string => {
    return colorPalette[index % colorPalette.length];
};

// First, let's add a helper function to get lighter version of CSS variables
export const getLighterColor = (colorVar: string): string => {
    // Remove 'var(' and ')' and get the CSS variable name
    const cssVarName = colorVar.slice(4, -1);
    // Get the number from the variable name (e.g., 'blue-300' -> '300')
    const colorLevel = cssVarName.split('-').pop();

    // If it ends in numbers 200-900, replace with 100 version
    if (colorLevel && /[2-9]00/.test(colorLevel)) {
        return `var(${cssVarName.replace(/-[2-9]00$/, '-100')})`;
    }

    return colorVar;
};
