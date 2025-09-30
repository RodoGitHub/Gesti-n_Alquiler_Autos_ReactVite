import { useState } from 'react';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
        setMessage('Las contraseñas no coinciden');
        return;
        }

        try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Usuario registrado correctamente!');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } else {
            setMessage(data.message || 'Error al registrar el usuario');
        }
        } catch (error) {
        setMessage('Error de conexión con el servidor');
        console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Registrarse</h2>

        {message && <p>{message}</p>}

        <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />

        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />

        <button type="submit">Registrarse</button>
        </form>
    );
    }
