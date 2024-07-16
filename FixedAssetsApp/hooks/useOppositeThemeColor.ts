/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export function useOppositeThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    let theme = useColorScheme();
    if(theme == "light"){
        theme = "dark";
    }
    else if (theme == "dark"){
        theme = "light";
    }
    else{ //if it is null
        theme = "dark";
    }
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}
