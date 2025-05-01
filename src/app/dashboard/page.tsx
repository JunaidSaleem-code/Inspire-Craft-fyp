"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type UserData = {
  name: string;
  email: string;
  artworksSold: number;
  balance: number;
};

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    axios.get("/api/dashboard")
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {userData.name} 👋</h1>
      <p>Email: {userData.email}</p>
      <p>Artworks Sold: {userData.artworksSold}</p>
      <p>Balance: PKR {userData.balance}</p>
    </div>
  );
}
