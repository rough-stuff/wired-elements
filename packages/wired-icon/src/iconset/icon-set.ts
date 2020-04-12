// TODO: create a wired-iconset library with iconset loading capability
import { ICON_SET as ACTION_ICON_SET } from './icon-set-action';
import { ICON_SET as ALERT_ICON_SET } from './icon-set-alert';
import { ICON_SET as AV_ICON_SET } from './icon-set-av';
import { ICON_SET as COMMUNICATION_ICON_SET } from './icon-set-communication';
import { ICON_SET as CONTENT_ICON_SET } from './icon-set-content';
import { ICON_SET as DEVICE_ICON_SET } from './icon-set-device';
import { ICON_SET as EDITOR_ICON_SET } from './icon-set-editor';
import { ICON_SET as FILE_ICON_SET } from './icon-set-file';
import { ICON_SET as HARDWARE_ICON_SET } from './icon-set-hardware';
import { ICON_SET as IMAGE_ICON_SET } from './icon-set-image';
import { ICON_SET as MAPS_ICON_SET } from './icon-set-maps';
import { ICON_SET as NAVIGATION_ICON_SET } from './icon-set-navigation';
import { ICON_SET as NOTIFICATION_ICON_SET } from './icon-set-notification';
import { ICON_SET as PLACES_ICON_SET } from './icon-set-places';
import { ICON_SET as SOCIAL_ICON_SET } from './icon-set-social';
import { ICON_SET as TOGGLE_ICON_SET } from './icon-set-toggle';

/**
 * key is the name of the icon
 * value is the path for the svg (d attribute on path svg element)
 */
export type SvgIconSet = {
    [key: string]: string
};

/**
 * We could have one gigantic associative array...
 * Or find a way to organize the icons intelligently for performance
 */
const iconSets: SvgIconSet[] = [];
iconSets.push(ACTION_ICON_SET);
iconSets.push(ALERT_ICON_SET);
iconSets.push(AV_ICON_SET);
iconSets.push(COMMUNICATION_ICON_SET);
iconSets.push(CONTENT_ICON_SET);
iconSets.push(DEVICE_ICON_SET);
iconSets.push(EDITOR_ICON_SET);
iconSets.push(FILE_ICON_SET);
iconSets.push(HARDWARE_ICON_SET);
iconSets.push(IMAGE_ICON_SET);
iconSets.push(MAPS_ICON_SET);
iconSets.push(NAVIGATION_ICON_SET);
iconSets.push(NOTIFICATION_ICON_SET);
iconSets.push(PLACES_ICON_SET);
iconSets.push(SOCIAL_ICON_SET);
iconSets.push(TOGGLE_ICON_SET);

/**
 * Retrieves the svg path from the icon name.
 * @param iconName : the icon name as known in material icon.
 */
export const getSvgPath = (iconName: string): string => {
    let result = '';
    let iconSetsIndex = 0;

    while (!result && iconSetsIndex < iconSets.length) {
        result = iconSets[iconSetsIndex][iconName];
        iconSetsIndex++;
    }
    return result;
}
