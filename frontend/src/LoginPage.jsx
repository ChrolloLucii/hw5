import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "./api";
import ThemeToggle from "./ThemeToggle";

export default function LoginPage() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const res = await login(loginValue, password);
    if (res.success) {
      navigate("/profile");
    } else {
      setError(res.error || "Ошибка входа");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const res = await register(loginValue, password);
    if (res.success) {
      navigate("/profile");
    } else {
      setError(res.error || "Ошибка регистрации");
    }
  }

  return (
    <div>
      <h2>Вход / Регистрация</h2>
      <ThemeToggle />
      <form>
        <input
          placeholder="Логин"
          value={loginValue}
          onChange={e => setLoginValue(e.target.value)}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div>
          <button onClick={handleLogin}>Войти</button>
          <button onClick={handleRegister}>Зарегистрироваться</button>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}