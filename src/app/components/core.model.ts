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
    HCE_GLOBAL     = "presence",
    LED_STAT       = "HCE_LED_STAT/#",
    LED_INFO       = "HCE_LED_STAT",
    LOCK_STAT      = "HCE_LOCK_STAT/#",
    LOCK_INFO      = "HCE_LOCK_STAT",
    PMP_STAT       = "HCE_PMP_STAT/#",
    PMP_INFO       = "HCE_PMP_STAT",
    CAM_STAT       = "HCE_CAM_STAT/#",
    CAM_INFO       = "HCE_CAM_STAT",
    HCE_LED_001    = "HCE_LED_001",
    HCE_LED_002    = "HCE_LED_002",
    HCE_LED_003    = "HCE_LED_003",
    HCE_LED_004    = "HCE_LED_004",
    HCE_LOCK_001   = "HCE_LOCK_001",
    HCE_LOCK_002   = "HCE_LOCK_002",
    HCE_LOCK_003   = "HCE_LOCK_003",
    HCE_WTR_001    = "HCE_PMP_001",
    HCE_WTR_002    = "HCE_PMP_002",
    HCE_CAM_001    = "HCE_CAM_001",
    HCE_CAM_002    = "HCE_CAM_002"
}
