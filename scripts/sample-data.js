// Sample data for testing the Ebus Management System
console.log(`
📊 Sample Data for Ebus Management System

USERS COLLECTION (Add to Firestore manually):

1. Admin User:
{
  firstName: "Admin",
  lastName: "Manager",
  email: "admin@ebus.com",
  role: "admin",
  phone: "+91-9876543210",
  createdAt: "2024-01-01T00:00:00.000Z"
}

2. Driver User:
{
  firstName: "Rajesh",
  lastName: "Kumar",
  email: "driver@ebus.com",
  role: "driver",
  phone: "+91-9876543211",
  createdAt: "2024-01-01T00:00:00.000Z"
}

3. Regular User:
{
  firstName: "Priya",
  lastName: "Sharma",
  email: "user@ebus.com",
  role: "user",
  phone: "+91-9876543212",
  createdAt: "2024-01-01T00:00:00.000Z"
}

BUSES COLLECTION (Add to Firestore manually):

1. Delhi to Mumbai Route:
{
  busNumber: "DL01-2024",
  busType: "ac",
  source: "Delhi",
  destination: "Mumbai",
  driverName: "Rajesh Kumar",
  driverPhone: "+91-9876543211",
  capacity: 45,
  fare: 1200.00,
  departureTime: "22:00",
  arrivalTime: "14:00",
  status: "active",
  currentLocation: "Delhi",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

2. Bangalore to Chennai Route:
{
  busNumber: "KA05-2024",
  busType: "luxury",
  source: "Bangalore",
  destination: "Chennai",
  driverName: "Suresh Reddy",
  driverPhone: "+91-9876543213",
  capacity: 35,
  fare: 800.00,
  departureTime: "23:30",
  arrivalTime: "06:30",
  status: "active",
  currentLocation: "Bangalore",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

3. Pune to Goa Route:
{
  busNumber: "MH12-2024",
  busType: "non-ac",
  source: "Pune",
  destination: "Goa",
  driverName: "Amit Patil",
  driverPhone: "+91-9876543214",
  capacity: 40,
  fare: 600.00,
  departureTime: "20:00",
  arrivalTime: "08:00",
  status: "active",
  currentLocation: "Pune",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

4. Kolkata to Bhubaneswar Route:
{
  busNumber: "WB07-2024",
  busType: "ac",
  source: "Kolkata",
  destination: "Bhubaneswar",
  driverName: "Debasis Das",
  driverPhone: "+91-9876543215",
  capacity: 42,
  fare: 450.00,
  departureTime: "21:00",
  arrivalTime: "05:00",
  status: "active",
  currentLocation: "Kolkata",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

5. Jaipur to Udaipur Route:
{
  busNumber: "RJ14-2024",
  busType: "mini",
  source: "Jaipur",
  destination: "Udaipur",
  driverName: "Mohan Singh",
  driverPhone: "+91-9876543216",
  capacity: 25,
  fare: 350.00,
  departureTime: "06:00",
  arrivalTime: "12:00",
  status: "maintenance",
  currentLocation: "Jaipur",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastUpdated: "2024-01-01T00:00:00.000Z"
}

HOW TO ADD SAMPLE DATA:

1. Go to Firebase Console > Firestore Database
2. Create collection "users"
3. Add documents with auto-generated IDs
4. Copy the user data above into each document
5. Create collection "buses"  
6. Add documents with auto-generated IDs
7. Copy the bus data above into each document

AUTHENTICATION ACCOUNTS:
Create these accounts in Firebase Authentication:
- admin@ebus.com / password123
- driver@ebus.com / password123
- user@ebus.com / password123

TEST SCENARIOS:

1. Admin Login:
   - Login as admin@ebus.com
   - Access all sections (Search, Bus Management, User Management, Profile)
   - Add/Edit/Delete buses
   - Manage user roles
   - Delete users

2. Driver Login:
   - Login as driver@ebus.com
   - Access Search, Bus Management, Profile
   - Add/Edit buses (cannot delete unless admin)
   - Cannot access User Management

3. User Login:
   - Login as user@ebus.com
   - Access Search and Profile only
   - Search buses by source/destination
   - View bus details and contact information

4. Search Testing:
   - Search "Delhi" to "Mumbai"
   - Search only source: "Bangalore"
   - Search only destination: "Goa"
   - Clear search to see all buses

This sample data provides a comprehensive test environment for all features!
`)
