import { ICON_SET } from './iconset-full';

/**
* Retrieves the svg path from the icon name from the full iconset.
* @param iconName : the icon name as known in material icon.
*/
export const findSvgPath = (iconName?: string): string => {
   if (iconName) {
       return ICON_SET[iconName];
   }
   return '';
}
