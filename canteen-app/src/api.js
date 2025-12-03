// This file simulates API calls to a backend.
// In a real application, these would be actual fetch/axios requests.

let mockMenu = [
  { id: '1', name: 'Chicken Biryani', price: 120, special: true, description: 'Fragrant rice with tender chicken' },
  { id: '2', name: 'Veg Thali', price: 90, special: false, description: 'Assortment of vegetarian dishes' },
  { id: '3', name: 'Paneer Butter Masala', price: 110, special: false, description: 'Creamy paneer curry' },
  { id: '4', name: 'Gulab Jamun', price: 30, special: false, description: 'Sweet fried milk dumplings' },
];

let mockOrders = [];

export const getDailyMenu = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMenu;
};

export const addMenuItem = async (item) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newItem = { ...item, id: (mockMenu.length + 1).toString() };
  mockMenu.push(newItem);
  return newItem;
};

export const updateMenuItem = async (updatedItem) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockMenu = mockMenu.map(item => item.id === updatedItem.id ? updatedItem : item);
  return updatedItem;
};

export const deleteMenuItem = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockMenu = mockMenu.filter(item => item.id !== id);
  return { success: true };
};

export const placeOrder = async (order) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newOrder = { ...order, id: (mockOrders.length + 1).toString(), status: 'Pending', timestamp: new Date().toISOString() };
  mockOrders.push(newOrder);
  console.log("Mock Order Placed:", newOrder);
  // This is where you'd trigger your backend to send a WhatsApp message
  // For demonstration, we'll log it.
  const whatsappMessage = `
*New Order Received!*
Name: ${newOrder.customerName}
Phone: ${newOrder.phoneNumber}
Alt. Phone: ${newOrder.altPhoneNumber || 'N/A'}
Address: ${newOrder.address}
Payment Type: ${newOrder.paymentType}
Order Items:
${newOrder.items.map(item => `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n')}
Total: ₹${newOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
`;
  console.log("WhatsApp Message Content (to be sent by backend):", whatsappMessage);
  return newOrder;
};

export const getOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockOrders;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockOrders = mockOrders.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  return { success: true };
};