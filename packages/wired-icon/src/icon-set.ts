import { ICON_SET as ACTION_ICON_SET } from './icon-set-action';
import { ICON_SET as ALERT_ICON_SET } from './icon-set-alert';
import { ICON_SET as AV_ICON_SET } from './icon-set-av';
import { ICON_SET as COMMUNICATION_ICON_SET } from './icon-set-communication';
import { ICON_SET as DEVICE_ICON_SET } from './icon-set-device';

/**
 * key is the name of the icon
 * value is the path for the svg (d attribute on path svg element)
 */
export type SvgIconSet = {
    [key: string]: string
};

const iconSets: SvgIconSet[] = [];
iconSets.push(ACTION_ICON_SET);
iconSets.push(ALERT_ICON_SET);
iconSets.push(AV_ICON_SET);
iconSets.push(COMMUNICATION_ICON_SET);
iconSets.push(DEVICE_ICON_SET);

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