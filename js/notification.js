const notificationContainer = document.getElementById('notification-container');
  
function NotificationManager() { }

NotificationManager.prototype.createNotification = function (type, text) {
    const newNotification = document.createElement('div');
    newNotification.classList.add('notification', `notification-${type}`);

    const innerNotification = text;

    newNotification.innerHTML = innerNotification;
    notificationContainer.appendChild(newNotification);

    setTimeout(() => {
        newNotification.classList.add('hide');
        setTimeout(() => {
            notificationContainer.removeChild(newNotification);
        }, 500);
    }, 5000);

}