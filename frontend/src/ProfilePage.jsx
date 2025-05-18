import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout, getData } from "./api";
import ThemeToggle from "./ThemeToggle";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProfile().then(res => {
      if (!res) navigate("/");
      else setProfile(res);
    });
  }, [navigate]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  async function handleGetData() {
    setError("");
    const d = await getData();
    if (d) setData(d);
    else setError("Ошибка получения данных");
  }

  if (!profile) return null;

  return (
    <div>
      <h2>Личный кабинет</h2>
      <ThemeToggle />
      <div>Логин: {profile.login}</div>
      <button onClick={handleLogout}>Выйти</button>
      <hr />
      <button onClick={handleGetData}>Обновить данные</button>
      {data && (
        <div>
          <div>Значение: {data.value}</div>
          <div>Время: {new Date(data.time).toLocaleTimeString()}</div>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}