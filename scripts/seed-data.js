// Sample data seeding script for development
console.log(`
📊 Sample Data for Testing

You can manually add this data to your Firestore collections for testing:

USERS Collection:
1. Admin User:
{
  firstName: "Admin",
  lastName: "User",
  email: "admin@ebus.com",
  role: "admin",
  phone: "+1234567890",
  createdAt: "2024-01-01T00:00:00.000Z"
}

2. Driver User:
{
  firstName: "John",
  lastName: "Driver",
  email: "driver@ebus.com",
  role: "driver",
  phone: "+1234567891",
  createdAt: "2024-01-01T00:00:00.000Z"
}

3. Regular User:
{
  firstName: "Jane",
  lastName: "Passenger",
  email: "user@ebus.com",
  role: "user",
  phone: "+1234567892",
  createdAt: "2024-01-01T00:00:00.000Z"
}

BUSES Collection:
1. Sample Bus 1:
{
  busNumber: "BUS001",
  busType: "ac",
  source: "Central Station",
  destination: "Airport",
  driverName: "John Driver",
  driverPhone: "+1234567891",
  capacity: 45,
  fare: 25.50,
  departureTime: "08:00",
  arrivalTime: "09:30",
  status: "active",
  currentLocation: "Central Station",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

2. Sample Bus 2:
{
  busNumber: "BUS002",
  busType: "non-ac",
  source: "Downtown",
  destination: "University",
  driverName: "Mike Wilson",
  driverPhone: "+1234567893",
  capacity: 35,
  fare: 15.00,
  departureTime: "09:15",
  arrivalTime: "10:00",
  status: "active",
  currentLocation: "Downtown",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

To add this data:
1. Go to Firebase Console > Firestore Database
2. Create collections 'users' and 'buses'
3. Add documents with the above data
4. Use the email/password combinations to test login
`)
