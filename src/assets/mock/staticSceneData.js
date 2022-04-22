export const schema_version = '1.0';
export const traffic_lights = [
    {
        "id": 10,  // Traffic light id，从地图里获取（如果有的话）
        "name": "light1",
        "position": [0.0, 0.0, 0.0],
        "signals": [
            {
                "red": { 
                    "lanes": [1, 2, 3], // 选填字段， 但signals不能为空
                    "durations": [[0, 10.0], [12, 15]] // 各信号的duration不能重叠
                },
                "green": {
                    "lanes": [1, 2, 3],
                    "durations": [[0, 10.0], [12, 15]]
                }
            }
        ],
        "exsiting_period": [[0, 10], [20, 30]] ,
        "perception_period": [[0, 10]]
    }
]
export const cones = [
    {
        "name": "cone1",
        "position": [0.0, 0.0, 0.0],
        "yaw": 0.0,  // 保留字段。
        "size": [3.0, 5.0, 5.0],
        "exsiting_period": [[0, 10], [20, 30]] ,
        "perception_period": [[0, 10]]
    }
]
export const traffic_signs = [
    {
        "name": "sign1",
        "position": [0.0, 0.0, 0.0],
        "yaw": 0.0,
        "size": [3.0, 5.0, 5.0],
        "type": "sign",
        "content": "limit_50/limit_80/accident",  
        "exsiting_period": [[0, 10], [20, 30]] ,
        "perception_period": [[0, 10]]
    }
]
export const update_method = "bot/frontend_0.1.1"; // 场景创建/修改的来源
export const version_update_comment = "";  // 场景版本更新说明，选填
export const minimal_frontend_version = '0.1';  // 最低前端版本要求
export const minimal_backend_version = '0.1';  // 最低后端版本要求