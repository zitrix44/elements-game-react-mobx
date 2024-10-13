import { observer } from "mobx-react-lite";

import './BgIconed.css';
import './BgIconed.x.css';
import './BgIconed.y.css';

type TbgIcon = {
    i: number;
    i_3: number;
    i_7: number;
    i_10: number;
    id: string;
    x: number;
    y: number;
    mdIcon: string;
}

export const BG_DEFAULT_ICONS = [
    'bolt',
    'shopping_cart_checkout',
    'star_half',
    'token',
    'html',
    'delete_sweep',
    'swipe_up',
    'dynamic_form',
    'cycle',
    'two_wheeler', 
    'directions_boat',
    'pedal_bike',
    'gondola_lift',
    'snowmobile',
    'pentagon',
    'ink_pen',
    'join_right',
    'function',
    'snippet_folder',
    'colors',
    'book_2',
    'stylus_laser_pointer',
    'table_eye',
    'language_pinyin',
    'script',
    'golf_course',
    'gite',
    'carpenter',
    'personal_bag',
    'pets',
    'sunny',
    'potted_plant',
    'cookie',
    'clear_day',
    'wind_power',
    'oil_barrel',
    'psychiatry',
    'footprint',
    'domino_mask',
    'deceased',
    'emoticon',
    'family_star',
    'bomb',
    'helicopter',
    'candle',
    'total_dissolved_solids',
    'poker_chip',
    'volcano',
    'healing',
    'blur_medium',
    'traffic',
    'dry_cleaning',
    'pet_supplies',
    'things_to_do',
    'coffee',
    'countertops',
    'faucet',
    'hardware',
    'mode_fan',
    'checkroom',
    'blender',
    'kettle',
    'household_supplies',
    'stadia_controller',
    'tools_power_drill',
    'laundry',
    'light_group',
    'tools_pliers_wire_stripper',
    'mfg_nest_yale_lock',
    'settings_alert',
    'nest_thermostat_zirconium_eu',
    'table_lamp',
    'mode_dual',
    'smart_toy',
    'print',
    'save',
    'robot',
    'robot_2',
    'security_key',
    'memory_alt',
    'camera_video',
    'lda',
    'tv_remote',
    'ventilator',
    'deskphone',
    'hard_drive',
    'hub',
    'call',
    'send',
    'notifications',
    'forum',
    'import_contacts',
    'drafts',
    'for_you',
    'call_merge',
    'satellite_alt',
    'alternate_email',
    'schedule',
    'language',
    'build',
    'bug_report',
    'code',
    'fingerprint',
    'celebration',
    'support',
    'all_inclusive',
    'interests',
    'bookmarks',
    'flutter_dash',
    'anchor',
    'webhook',
    'component_exchange',
    'power_settings_circle',
    'savings', 
    'precision_manufacturing',
    'barcode',
    'copyright',
    'atr',
    'bubble_chart',
    'schema',
    'enterprise',
    'chart_data',
    'energy',
    'barcode_reader',
    'forklift',
    'front_loader',
    'qr_code_2',
    'receipt_long',
    'mic',
    'podcasts',
    'sound_detection_dog_barking',
    'queue_music',
    'view_in_ar',
    'radio',
    'volume_down_alt',
    'replay_5',
    'digital_out_of_home',
    'video_search',
    'speed_2x',
    'speed_1_2',
    'replace_audio',
    'edit_audio',
    'android',
    'network_check',
    'flashlight_on',
    'grid_4x4',
    'battery_charging_60',
    'network_ping',
    'usb',
    'self_improvement',
    'sports_gymnastics',
    'biotech',
    'trophy',
    'toys',
    'architecture',
    'sports_score',
    'camping',
    'toys_and_games',
    'rewarded_ads',
    'sports_and_outdoors',
    'person_play',
    'bath_private',
    'skateboarding',
    'sledding',
    'bia',
    'cadence',
    'castle',
    'fort',
    'folder_open',
    'signature',
    'format_paragraph',
    'lasso_select',
    'ink_highlighter_move',
    'ar_stickers',
    '7k',
    'local_shipping',
    'unpaved_road',
    'directions_railway_2',
    'roller_skating',
    'point_of_sale',
    'speaker',
    'scanner',
    'settings_input_hdmi',
    'joystick',
    'bungalow',
    'beach_access',
    'travel',
    'houseboat',
    'smoking_rooms',
    'sports_bar',
    'lunch_dining',
    'mop',
    'mode_cool',
    'mode_off_on',
    'bedroom_baby',
    'fence',
    'lightbulb_2',
    'nest_cam_floodlight',
    'nest_true_radiant',
    'floor_lamp',
    'tools_ladder',
    'apparel',
    'event_seat',
    'gate',
    'scene',
];

export const BgIconed = observer((
    {
        randomSeed = 77,
        className = '',
        iStart = 30,
        iStep = 30,
        iStepMultipty = 1,
        xCount = 5,
        yCount = 5,
        opacity = 1,
    }: {
        randomSeed: number
        className?: string,
        iStart?: number,
        iStep?: number,
        iStepMultipty?: number,
        xCount?: number,
        yCount?: number,
        opacity?: number,
    }
) => {
    const icons: TbgIcon[] = [];
    let i = 0;
    for (let y = 0; y < yCount; y++) {
        for (let x = 0; x < xCount; x++) {
            i++;
            const myI = Math.floor(randomSeed + iStart + iStep * iStepMultipty * i);
            const mdIcon = BG_DEFAULT_ICONS[Math.floor(myI % BG_DEFAULT_ICONS.length)];
            icons.push({
                i,
                i_3: (myI % 3),
                i_7: (myI % 7),
                i_10: (myI % 10),
                id: i +'='+ mdIcon,
                x: Math.floor(x * (100 / xCount)),
                y: Math.floor(y * (100 / yCount)),
                mdIcon
            });
        }
    }
    if (opacity == 0) return null;
    return <>
        <div className={`bg-iconed-grid ${className}`} style={{opacity}}>
            {
                icons.map(({i, i_3, i_7, i_10, id, x, y, mdIcon}: TbgIcon) => {
                    return <span key={id} className={`bg-iconed-icon bg-iconed_${i} bg-iconed-i3_${i_3} bg-iconed-i7_${i_7} bg-iconed-i10_${i_10} bg-iconed-x_${x} bg-iconed-y_${y}`}>
                        <span className="bg-iconed-icon-wrap1">
                            <span className="bg-iconed-icon-wrap2">
                                <span className="bg-iconed-icon-wrap3">
                                    <span className="material-symbols-outlined">{mdIcon}</span>
                                </span>
                            </span>
                        </span>
                    </span>
                })
            }
        </div>
    </>;
});