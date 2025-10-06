import api from "../lib/api";

export const fetchAllNotifications = async () => {
  const res = await api.get("/notifications");

  return res.data;
};

export const readNotification = async (notificationId) => {
  const res = await api.patch(`notifications/${notificationId}/read`);

  return res.data;
};
