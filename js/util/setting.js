const store = require('electron-store');
const log = require('electron-log');

const config = new store()

log.info('Setting.js has been loaded.')

module.exports = {
    customBackGround: {
        cat: 'Menu',
        id: 'customBG',
        title: 'Custom background image',
        type: 'text',
        val: config.get('customBG'),
        restart: false,
        default: 'https://cdn.discordapp.com/attachments/983598732505411595/1181099378149175358/image_13_1.png'
    },
    customGameLogo: {
        cat: 'Menu',
        id: 'customLogo',
        title: 'Custom game logo image',
        type: 'text',
        val: config.get('customLogo'),
        restart: false,
        default: 'https://cdn.discordapp.com/attachments/983598732505411595/1181131421830623312/image_3-min.png'
    },
    customGameLogoText: {
        cat: 'Menu',
        id: 'customGameLogoText',
        title: 'Custom logo text',
        type: 'text',
        val: config.get('customGameLogoText'),
        restart: false,
        default: 'Victory and Eternal fun'
    },
    customCrosshairCheck: {
        cat: 'Crosshair',
        id: 'customCrosshairCheckbox',
        title: 'Use custom crosshair',
        type: 'checkbox',
        val: config.get('customCrosshairCheckbox'),
        restart: false,
        default: true,
    },
    customCrosshairImage: {
        cat: 'Crosshair',
        id: 'customCrosshairImage',
        title: 'Custom crosshair URL',
        type: 'text',
        val: config.get('customCrosshairImage'),
        restart: false,
        default: 'https://cdn.discordapp.com/attachments/616206938048561152/996062796892614716/KovaaK-Crosshair_1.png'
    },
    crosshairSizeX: {
        cat: 'Crosshair',
        id: 'crosshairSizeX',
        title: 'crosshair Size X',
        type: 'range-text',
        val: config.get('crosshairSizeX'),
        restart: false,
        default: '22',
    },
    crosshairSizeY: {
        cat: 'Crosshair',
        id: 'crosshairSizeY',
        title: 'crosshair Size Y',
        type: 'range-text',
        val: config.get('crosshairSizeY'),
        restart: false,
        default: '22',
    },
    detectCrosshairSize: {
        cat: 'Crosshair',
        id: 'detectCrosshairSize',
        title: 'Auto crosshair sizing',
        type: 'button',
        buttonVal: 'Size set',
        val: config.get('detectCrosshairSize'),
        restart: false,
        val: 'Detect',
    },
    cssType: {
        cat: 'CSS',
        id: 'cssType',
        title: 'Custom CSS type',
        type: 'select',
        val: config.get('cssType'),
        options: {
            none: 'Disable',
            text: 'Textarea',
            localfile: 'Local File',
            online: 'From URL'
        },
        restart: true,
        default: 'none'
    },
    cssTextarea: {
        cat: 'CSS',
        id: 'cssTextarea',
        title: 'CSS Textarea',
        type: 'textarea',
        val: config.get('cssTextarea'),
        restart: false,
        default: ''
    },
    cssLocal: {
        cat: 'CSS',
        id: 'cssLocal',
        title: 'Local CSS',
        type: 'openFile',
        val: config.get('cssLocal'),
        restart: false,
        default: '',
    },
    cssUrl: {
        cat: 'CSS',
        id: 'cssUrl',
        title: 'CSS url',
        type: 'text',
        val: config.get('cssUrl'),
        restart: false,
        default: '',
    },
    quickJoinRegion: {
        cat: 'QuickJoin',
        id: 'quickJoinRegion',
        title: 'Region',
        type: 'select',
        val: config.get('quickJoinRegion'),
        options: {
            0: 'US West',
            1: 'US East ',
            2: 'Europe',
            3: 'Asia',
        },
        restart: false,
        default: '0'
    },
    quickJoinMode: {
        cat: 'QuickJoin',
        id: 'quickJoinMode',
        title: 'Gamemode',
        type: 'select',
        val: config.get('quickJoinMode'),
        options: {
            ffa: 'Free for All',
            ctg: 'Capture the Gem',
            svv: 'Survival',
            br: 'Battle Royale',
        },
        restart: false,
        default: 'ffa'
    },

    disableSnowflake: {
        cat: 'Mini Tool',
        id: 'disableSnow',
        title: 'Disable Snowflake',
        type: 'checkbox',
        val: config.get('disableSnow'),
        restart: false,
        default: false,
    },
    disableGemPopup: {
        cat: 'Mini Tool',
        id: 'disableGemPopup',
        title: 'Disable FreeGem popup',
        type: 'checkbox',
        val: config.get('disableGemPopup'),
        restart: false,
        default: false,
    },
    enableChatToWebhook: {
        cat: 'Mini Tool',
        id: 'enableCtW',
        title: 'Enable chat to webhook',
        type: 'checkbox',
        val: config.get('enableCtW'),
        restart: true,
        default: false,
    },
    webhookUrl: {
        cat: 'Mini Tool',
        id: 'webhookUrl',
        title: 'Webhook URL',
        type: 'password',
        val: config.get('webhookUrl'),
        restart: false,
        default: '',
    },
    resourceSwapperEnable: {
        cat: 'Mini Tool',
        id: 'resourceSwapperEnable',
        title: 'Enable Resource Swapper',
        type: 'checkbox',
        val: config.get('resourceSwapperEnable'),
        restart: true,
        default: false,
    },
}