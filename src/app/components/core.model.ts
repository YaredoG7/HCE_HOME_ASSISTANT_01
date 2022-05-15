export interface DeviceProfile {
    device_id: string,
    device_name: string,
    device_group: string,
    device_port: string,
    device_ip: string,
    device_mac: string,
    device_img_src: string,
    owner: string,
    device_meta: any [],
    device_pin: number,
    isActive: boolean,
    status: string,
    status_id: number,
    metadata?:{
        resolution?: string,
        vid_record?: string,
        can_stream?: boolean,
        can_record?: boolean
        
    },
    selected?: boolean,
    role?: string
}
export enum Topics {
    HCE_GLOBAL      = "presence",
    HCE_INFO        = "HCE_STAT",
    HCE_NODE_BASE   = "NODE_01/#",
    HCE_NODE_BASE_X = "NODE_01",
    HCE_LED_001     = "NODE_LIGHT001",
    HCE_LED_002     = "NODE_LIGHT002",
    HCE_LED_003     = "NODE_LIGHT003",
    HCE_LED_004     = "NODE_LIGHT004",
    HCE_LOCK_001    = "NODE_LOCK001",
    HCE_LOCK_002    = "NODE_LOCK002",
    HCE_LOCK_003    = "NODE_LOCK003",
    HCE_WTR_001     = "NODE_WTR001",
    HCE_WTR_002     = "NODE_WTR002",
    HCE_CAM_001     = "NODE_CAM001",
    HCE_CAM_002     = "NODE_CAM002"
}
