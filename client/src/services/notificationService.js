const notificationService = {
  requestPermission: () => {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    // Ask the user for permission
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
  },

  checkAndNotify: (product) => {
    // Check if permission has been granted
    if (Notification.permission !== 'granted') {
      return;
    }
    
    // Check if stock is below or equal to the threshold
    if (product.stock <= product.threshold) {
      const notification = new Notification('Low Stock Alert!', {
        body: `${product.name} has reached a low stock level (${product.stock} remaining).`,
        // You can optionally add an icon
        // icon: '/path/to/icon.png' 
      });
    }
  },
};

export default notificationService;