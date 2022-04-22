import {reactive} from 'vue';
import HeaderStyle from './HeaderStyle';
import TabItemStyle from './TabItemStyle';
import SceneCardStyle from './SceneCardStyle';

export const blackStyle = {
    mainBackgroundColor:  '#0A0D14',
    containerBackgroundColor: '#15182B',
    containerBoxShadow: '0px 1px 8px 2px rgba(19, 22, 35, 0.5)',
    sceneCreateCardBackground: '#262D49',
    sceneCreateCardFontColor: '#C7D5E4',
    header: HeaderStyle.blackStyle,
    tabItem: TabItemStyle.blackStyle,
    scene: SceneCardStyle.blackStyle,
}

export const whiteStyle = {
    mainBackgroundColor:  '#fff',
    containerBackgroundColor: '#FCFEFF',
    containerBoxShadow: '0px 1px 8px 2px rgba(183, 187, 194, 0.5)',
    sceneCreateCardBackground: '#D6DDE4',
    sceneCreateCardFontColor: '#8fa4bb',
    header: HeaderStyle.whiteStyle,
    tabItem: TabItemStyle.whiteStyle,
    scene: SceneCardStyle.whiteStyle,
}

export const themeStyle = reactive({
    style: null
})