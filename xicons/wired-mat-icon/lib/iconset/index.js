/**
 * Returns a utility function to browse an iconset
 * @param ICON_SET the iconset to be used
 */
export const iconsetLoader = (ICON_SET) => (iconName) => {
    if (iconName) {
        return ICON_SET[iconName];
    }
    return '';
};
