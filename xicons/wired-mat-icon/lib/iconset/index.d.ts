/**
 * key is the name of the icon
 * value is the path for the svg (d attribute on path svg element)
 */
export declare type SvgIconSet = {
    [key: string]: string;
};
/**
 * Returns a utility function to browse an iconset
 * @param ICON_SET the iconset to be used
 */
export declare const iconsetLoader: (ICON_SET: SvgIconSet) => (iconName?: string | undefined) => string;
