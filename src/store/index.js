import {createStore} from 'vuex';

const store = createStore({
    state() {
        return {
            theme: '',
            sceneJson: '',
            historyList: [],
            versionList: [],
            menuList: [],
        }
    },
    mutations: {
        CHANGE_THEME(state, value) {
            state.theme = value;
        },
        SAVE_VERSION_LIST(state, value) {
            state.versionList = value;
            localStorage.setItem('versionList', JSON.stringify(value));
        },
        SAVE_MENU_LIST(state, value) {
            state.menuList = value;
        },
        SAVE_SCENE_JSON(state, value) {
            state.sceneJson = value;
            localStorage.setItem('sceneJson', JSON.stringify(value));
        },
        SAVE_HISTORY_LIST(state, value) {
            state.historyList = value;
            localStorage.setItem('historyList', JSON.stringify(value));
        },
        INIT_EDIT_DATA(state) {
            ['sceneJson', 'historyList', 'versionList'].forEach(item => {
                const value = localStorage.getItem(item);
                if (value) {
                    state[item] = JSON.parse(value);
                }
            })
        }
    },
})
export default store;