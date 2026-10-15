import webpush from 'web-push';
import { assertVapid } from './vapid.js';

export function createWebPush(env) {
  const vapid = assertVapid(env);
  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);
  return function sendPush(subscription, payload) {
    return webpush.sendNotification(subscription, payload);
  };
}
