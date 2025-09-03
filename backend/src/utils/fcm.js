
// TODO: Install firebase-admin
// npm install firebase-admin

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to add service account key)
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const sendNotificationToAgent = async (fcmToken, order) => {
  const message = {
    token: fcmToken,
    notification: {
      title: 'New Delivery Request',
      body: `Delivery needed from ${order.farmerId.farmName} to ${order.deliveryZone}`,
    },
    data: {
      orderId: order._id.toString(),
      type: 'delivery_request',
      farmName: order.farmerId.farmName,
      deliveryZone: order.deliveryZone,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.log('Error sending message:', error);
    throw error;
  }
};

const sendNotificationToMultipleAgents = async (agents, order) => {
  const tokens = agents.filter(agent => agent.fcmToken).map(agent => agent.fcmToken);
  
  if (tokens.length === 0) {
    console.log('No FCM tokens found for agents');
    return;
  }

  const message = {
    tokens,
    notification: {
      title: 'New Delivery Request',
      body: `Delivery needed from ${order.farmerId.farmName} to ${order.deliveryZone}`,
    },
    data: {
      orderId: order._id.toString(),
      type: 'delivery_request',
      farmName: order.farmerId.farmName,
      deliveryZone: order.deliveryZone,
    },
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent messages:', response.successCount);
    return response;
  } catch (error) {
    console.log('Error sending messages:', error);
    throw error;
  }
};

module.exports = {
  sendNotificationToAgent,
  sendNotificationToMultipleAgents
};
