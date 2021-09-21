import { NotificationDto } from "../dto/notification.dto";
import { Notification } from "./notification.interface";
import apisauce from 'apisauce';
import apn from "node-apn";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PushNotification implements Notification {

    notify(notification: NotificationDto): Promise<any> {
        if (notification.plataform == "ios") {
            return this.notifyIOSDevice(notification);
        }
        return this.notifyAndroidDevice(notification);
    }


    private notifyIOSDevice(notification: NotificationDto) {
        let options = {
            token: {
              key: process.env.PATH_APPLE_APN_KEY,
              keyId: process.env.YOUR_P8_KEY_ID,
              teamId: process.env.APPLE_TEAM_ID
            },
            production: process.env.APPLE_PUSH_NOTIFICATION_IS_PRODUCTION
        };
          
        // @ts-ignore
        const apnProvider = new apn.Provider(options);
        const message = new apn.Notification();
        message.expiry = Math.floor(Date.now() / 1000) + 3600;
        message.badge = 3;
        message.sound = "ping.aiff";
        message.alert = notification.title;
        message.payload = { 'message': notification.message };
        message.topic = process.env.APPLE_APP_BUNDLE_ID;

        return apnProvider.send(message, notification.tokenDevice)
    }
        
    private notifyAndroidDevice(notification: NotificationDto) {
        const clientApi = apisauce.create({
            baseURL: process.env.FCM_PUSH_NOTIFICATION_URL
        });

        clientApi.setHeaders({
            'Content-Type': 'application/json',
            Authorization: `key=${process.env.FCM_SERVER_KEY}`,
        });


        return clientApi.post("/send", {
            to: notification.tokenDevice,
            priority: 'normal',
            data: {
                experienceId: process.env.EXPO_EXPERIENCE_ID,
                title: notification.title,
                message: notification.message,
            },
        })
    }

}