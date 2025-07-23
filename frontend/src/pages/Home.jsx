import { useEffect, useState } from "react";
import api from "../api";

function Home() {
  const [user, setUser] = useState(null);
  const [gauge, setGauge] = useState(0);
  const [gender, setGender] = useState(0);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getGauge();
  }, []);

  useEffect(() => {
    getGender();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/api/auth/user/");
      setUser(res.data.username);
    } catch (error) {
      alert(error);
    }
  };

  const getGauge = async () => {
    try {
      const res = await api.get("/sentimentposts/gauge/");
      setGauge(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const getGender = async () => {
    try {
      const res = await api.get("/sentimentposts/gen/");
      setGender(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div>{user ? `Welcome ${user}` : "Heloworld..."}</div>

      {Object.entries(gauge).map(([label, percentage]) => {
        return (
          <div key={label}>
            <h1>{percentage}</h1>
          </div>
        );
      })}

      {/* gender data: check if the gender nested object exists before accessing the counts
      and mapping through it. this is to prevent causing an error if null */}
      {gender?.service_counts &&
        Object.entries(gender.service_counts).map(([label, count]) => {
          return (
            <div key={label}>
              <h1>{`${label}: ${count}`}</h1>
            </div>
          );
        })}
    </main>
  );
}

export default Home;
