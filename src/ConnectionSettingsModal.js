import React, { useState } from 'react';
import './ConnectionSettingsModal.css'; //стили для Sidebar
import { setServerAddress } from './serverConfig'; // Импортируйте функции утилиты
function ConnectionSettingsModal({ isOpen, onClose }) {
    const [isClient, setIsClient] = useState(false);

    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const handleSave = () => {
        if (isClient && !address.trim()) {
            setError('Адрес сервера не может быть пустым');
            return;
        }

        setError(''); // Очищаем сообщение об ошибке, если оно было
        setServerAddress(address.trim()); // Сохраняем адрес сервера
        window.location.reload(); // Обновляем страницу
    };

    return (
        isOpen && (
            <div className="modal-backdrop">
                <div className="modal-content">


                    <h2>Параметры подключения</h2>
                    <div className="switches-container">
                        <div className="switch-row">
                            <div className="switch-label">Хост</div>
                            <label className="switch">
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={!isClient}
                                    onChange={() => setIsClient(false)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="switch-row">
                            <div className="switch-label">Клиент</div>
                            <label className="switch">
                                <input
                                    type="radio"
                                    name="mode"
                                    checked={isClient}
                                    onChange={() => setIsClient(true)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    {isClient && (
                        <div className="address-input">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="http://localhost:5000"
                            />
                        </div>
                    )}
                    {error && <div className="error">{error}</div>}
                    <button className="close-button" onClick={handleSave}>Сохранить</button>
                    <button className="close-button" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        )
    );
}

export default ConnectionSettingsModal;
