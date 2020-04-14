// TODO: create a wired-iconset library with iconset loading capability
import { ICON_SET } from './iconset-common';

/**
 * key is the name of the icon
 * value is the path for the svg (d attribute on path svg element)
 */
export type SvgIconSet = {
    [key: string]: string
};

/**
 * Retrieves the svg path with the icon name from a limited iconset.
 * @param iconName : the icon name as known in material icon.
 */
export const getSvgPath = (iconName?: string): string => {
    if (iconName) {
        return ICON_SET[iconName];
    }
    return '';
}
