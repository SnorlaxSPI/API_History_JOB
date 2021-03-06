import client, { Connection, Channel, ConsumeMessage } from 'amqplib';

function connect(){
  return require('amqplib').connect("amqp://username:password@localhost:5672").then((conn: { createChannel: () => any; }) => conn.createChannel());
}

//function sendMessages (channel: Channel): void {
//  for (let i = 0; i < 10; i++) {
//    channel.sendToQueue('myQueue', Buffer.from(`Company:1 - 10/${i} até 20/${i}`));
//  }
//}

function createQueue(channel: Channel, queue: string){
  return new Promise((resolve, reject) => {
    try{
      channel.prefetch(5);
      channel.assertQueue(queue, { durable: true });
      resolve(channel);
    }
    catch(err){ reject(err) }
  });
}
 
export function sendToQueue(queue: string, message: any){
  connect()
    .then((channel: client.Channel) => createQueue(channel, queue))
    .then((channel: { sendToQueue: (arg0: any, arg1: Buffer) => any; }) => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
    .catch((err: any) => console.log(err));

}
 
export function consume(queue: string, callback: (message: { content: string; }) => Promise<void>){
  connect()
  .then((channel: client.Channel) => createQueue(channel, queue))
  .then((channel: { consume: (arg0: any, arg1: any, arg2: { noAck: boolean; }) => any; }) => channel.consume(queue, callback, { noAck: true }))
  .catch((err: any) => console.log(err));
}
 
module.exports = {
  sendToQueue,
  consume
}