import { NotificationDto } from "../dto/notification.dto";

export interface Notification {

    notify(notification: NotificationDto): Promise<any>;
}