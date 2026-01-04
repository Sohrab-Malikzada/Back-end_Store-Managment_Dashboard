import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

export async function createUser(db, { email, password, role }) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  function getDefaultPermissions(role) {
    switch (role) {
      case "admin":
        return {
          dashboard: true,
          sales: true,
          inventory: true,
          employees: true,
          analytics: true,
          payroll: true,
          debts: true,
          purchases: true,
          userManagement: true
        };
      case "cashier":
        return {
          dashboard: true,
          sales: true,
          inventory: false,
          employees: false,
          analytics: false,
          payroll: false,
          debts: true,
          purchases: false,
          userManagement: false
        };
      case "pos":
        return {
          dashboard: true,
          sales: true,
          inventory: true,
          employees: false,
          analytics: false,
          payroll: false,
          debts: true,
          purchases: false,
          userManagement: false
        };
      case "data_entry":
        return {
          dashboard: true,
          sales: false,
          inventory: true,
          employees: false,
          analytics: false,
          payroll: false,
          debts: false,
          purchases: true,
          userManagement: false
        };
      default:
        return {};
    }
  }

  const user = {
    email,
    password: hashedPassword,
    role,
    permissions: getDefaultPermissions(role)
  };
  await db.collection("users").insertOne(user);
  return user;
}




async function run() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const db = client.db("store");
  await createUser(db, {
  email: "pos@company.com",
  password: "pos123",
  role: "pos"
});
  client.close();
}
run();
